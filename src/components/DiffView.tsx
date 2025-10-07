import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDocumentStore } from '../store/documentStore';
import { ChangeGroupButtons } from './ChangeGroupDisplay';
import { ColoredText } from './ColoredText';
import { UI_COLORS } from '../types/colors';

/**
 * Minimal DiffView - renders like normal TextEditor
 * Shows colored text spans with floating Accept/Reject buttons
 * No headers, no borders, just text + minimal buttons
 */
export const DiffView: React.FC = () => {
  const textSpans = useDocumentStore((state) => state.textSpans);
  const changeGroups = useDocumentStore((state) => state.changeGroups);
  const acceptChangeGroup = useDocumentStore((state) => state.acceptChangeGroup);
  const rejectChangeGroup = useDocumentStore((state) => state.rejectChangeGroup);
  
  // Calculate button positions for each change group
  // Position below the last green line of each group
  const buttonPositions = useMemo(() => {
    const positions: Array<{ groupId: string; top: number }> = [];
    const lineHeight = 26; // Must match ColoredText lineHeight
    const paddingTop = 32; // Must match container padding
    const buttonOffset = 8; // Gap below the line to avoid overlap (same as TextEditor)
    
    let currentLineIndex = 0;
    const lastGreenLineForGroup: Record<string, number> = {};
    
    // Track which line each span is on and find last green line per group
    textSpans.forEach((span) => {
      if (span.changeGroupId && span.color === 'green') {
        lastGreenLineForGroup[span.changeGroupId] = currentLineIndex;
      }
      currentLineIndex++;
    });
    
    // Calculate button position for each change group (same logic as TextEditor)
    changeGroups.forEach((group) => {
      const lastGreenLine = lastGreenLineForGroup[group.id];
      if (lastGreenLine !== undefined) {
        // Position below the last green line
        // Same formula as TextEditor: padding + (lineIndex + 1) * lineHeight + offset
        const topPosition = paddingTop + ((lastGreenLine + 1) * lineHeight) + buttonOffset;
        positions.push({ groupId: group.id, top: topPosition });
      }
    });
    
    return positions;
  }, [textSpans, changeGroups]);
  
  return (
    <View style={styles.container}>
      {/* Render all text spans like normal editor */}
      <ColoredText
        spans={textSpans}
        style={styles.text}
      />
      
      {/* Floating Accept/Reject buttons for each change group */}
      {changeGroups.map((group) => {
        const position = buttonPositions.find(p => p.groupId === group.id);
        if (!position) return null;
        
        return (
          <View
            key={group.id}
            style={[styles.buttonsWrapper, { top: position.top }]}
          >
            <ChangeGroupButtons
              changeGroup={group}
              onAccept={acceptChangeGroup}
              onReject={rejectChangeGroup}
            />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: UI_COLORS.background,
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 32,
    position: 'relative',
  },
  text: {
    color: UI_COLORS.textPrimary,
    fontFamily: 'monospace',
    fontSize: 18,
    lineHeight: 26,
  },
  buttonsWrapper: {
    position: 'absolute',
    right: 16,
    zIndex: 10,
  },
});

