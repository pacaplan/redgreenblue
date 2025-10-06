import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputSelectionChangeEventData,
  TextStyle,
  ViewStyle,
  Pressable,
  Text,
} from 'react-native';
import { useDocumentStore } from '../store/documentStore';
import { ColoredText } from './ColoredText';
import { TextSpan, UI_COLORS, SPAN_COLORS } from '../types/colors';

interface TextEditorProps {
  placeholder?: string;
  maxLength?: number;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  placeholder = 'Start typing...',
  maxLength = 2000,
}) => {
  const text = useDocumentStore((state) => state.text);
  const textSpans = useDocumentStore((state) => state.textSpans);
  const setText = useDocumentStore((state) => state.setText);
  const setTextSpans = useDocumentStore((state) => state.setTextSpans);
  const toggleSpanColor = useDocumentStore((state) => state.toggleSpanColor);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [buttonPosition, setButtonPosition] = useState({ top: 0, visible: false });
  const currentSpanIdRef = useRef<string | null>(null);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ensure there is at least a default span on initial load
  useEffect(() => {
    if (textSpans.length === 0 && text.length > 0) {
      const defaultSpan: TextSpan = {
        id: `span_init_${Date.now()}`,
        text,
        color: 'blue',
      };
      currentSpanIdRef.current = defaultSpan.id;
      setTextSpans([defaultSpan]);
    } else if (textSpans.length > 0 && !currentSpanIdRef.current) {
      currentSpanIdRef.current = textSpans[textSpans.length - 1].id;
    }
  }, [text, textSpans, setTextSpans]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  const handleTextChange = (newText: string) => {
    if (newText.length > maxLength) {
      return;
    }

    setText(newText);

    if (newText.length === 0) {
      currentSpanIdRef.current = null;
      setTextSpans([]);
      return;
    }

    // Split new text into lines
    const newLines = newText.split('\n');
    const oldLines = text.split('\n');
    
    // Build new spans array, preserving IDs and colors where possible
    const newSpans: TextSpan[] = [];
    
    for (let i = 0; i < newLines.length; i++) {
      const lineText = newLines[i];
      const existingSpan = textSpans[i];
      
      // If we have an existing span at this position, preserve its ID and color
      if (existingSpan) {
        newSpans.push({
          id: existingSpan.id,
          text: lineText,
          color: existingSpan.color,
        });
      } else {
        // New line added - create new span with blue color
        newSpans.push({
          id: `span_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          text: lineText,
          color: 'blue',
        });
      }
    }

    setTextSpans(newSpans);
  };

  const getCurrentLineIndex = (cursorPos: number): number => {
    // Find which line (span) the cursor is currently in
    const lines = text.split('\n');
    let charCount = 0;
    for (let i = 0; i < lines.length; i++) {
      charCount += lines[i].length;
      if (cursorPos <= charCount) {
        return i;
      }
      charCount += 1; // Account for '\n'
    }
    return Math.max(0, lines.length - 1);
  };

  const handleSelectionChange = (
    event: NativeSyntheticEvent<TextInputSelectionChangeEventData>
  ) => {
    const newSelection = event.nativeEvent.selection;
    setSelection(newSelection);
    
    // Hide button immediately when user moves cursor or types
    setButtonPosition(prev => ({ ...prev, visible: false }));
    
    // Clear any existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    // Calculate button position based on current line
    const lineIndex = getCurrentLineIndex(newSelection.start);
    const lineHeight = 26; // Must match styles.displayText.lineHeight
    const paddingTop = 32; // Must match styles.container.paddingVertical
    const buttonHeight = 32; // Approximate button height (8px padding * 2 + text)
    const buttonOffset = 8; // Gap below the line to avoid overlap
    
    // Calculate Y position: padding + (lineIndex + 1) * lineHeight + offset
    // This places it below the next line to avoid covering current line
    const topPosition = paddingTop + ((lineIndex + 1) * lineHeight) + buttonOffset;
    
    // Check if current line can be toggled and is not blank
    const span = textSpans[lineIndex];
    const isLineBlank = !span || span.text.trim().length === 0;
    const canShow = span && (span.color === 'blue' || span.color === 'yellow') && !isLineBlank;
    
    // Show button after 500ms of inactivity
    if (canShow) {
      inactivityTimerRef.current = setTimeout(() => {
        setButtonPosition({
          top: topPosition,
          visible: true,
        });
      }, 500);
    }
  };

  const handleToggleCurrentLine = () => {
    const lineIndex = getCurrentLineIndex(selection.start);
    if (lineIndex >= 0 && lineIndex < textSpans.length) {
      const span = textSpans[lineIndex];
      if (span.color === 'blue' || span.color === 'yellow') {
        toggleSpanColor(span.id);
      }
    }
  };

  const currentLineIndex = getCurrentLineIndex(selection.start);
  const currentSpan = textSpans[currentLineIndex];

  const transparentTextInputStyle: TextStyle = useMemo(
    () => ({
      ...styles.textInput,
      backgroundColor: UI_COLORS.transparent,
      caretColor: UI_COLORS.caret,
      color: UI_COLORS.transparent,
      selectionColor: UI_COLORS.selection,
      // Android-specific fixes for blurry text
      textShadowColor: 'transparent',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 0,
    }),
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.editorSurface}>
        <View style={[styles.displayLayer, { pointerEvents: 'box-none' }]}>
          <ColoredText
            spans={textSpans.length > 0 ? textSpans : []}
            style={styles.displayText}
            placeholder={placeholder}
            placeholderColor={UI_COLORS.placeholder}
          />
        </View>
        <TextInput
          style={[
            StyleSheet.absoluteFill,
            transparentTextInputStyle,
          ]}
          value={text}
          onChangeText={handleTextChange}
          onSelectionChange={handleSelectionChange}
          selection={selection}
          placeholder={placeholder}
          placeholderTextColor={UI_COLORS.transparent}
          multiline
          textAlignVertical="top"
          autoFocus
          keyboardAppearance="light"
          underlineColorAndroid="transparent"
          scrollEnabled
          // @ts-ignore - includeFontPadding is Android-only
          includeFontPadding={false}
        />
      </View>
      {buttonPosition.visible && currentSpan && (
        <Pressable
          style={({ pressed }) => [
            styles.toggleButton,
            { 
              top: buttonPosition.top,
              backgroundColor: currentSpan.color === 'blue' ? SPAN_COLORS.yellow : SPAN_COLORS.blue,
              opacity: pressed ? 0.7 : 1,
            }
          ]}
          onPress={handleToggleCurrentLine}
        >
          <Text style={styles.toggleButtonText}>
            {currentSpan.color === 'blue' ? '→ Mark as Prompt' : '→ Mark as Text'}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: UI_COLORS.background,
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  displayLayer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
  },
  displayText: {
    color: UI_COLORS.textPrimary,
    fontFamily: 'monospace',
    fontSize: 18,
    lineHeight: 26,
  },
  editorSurface: {
    borderWidth: 0,
    flex: 1,
    position: 'relative',
  } as ViewStyle,
  textInput: {
    borderWidth: 0,
    borderColor: 'transparent',
    color: UI_COLORS.textPrimary,
    flex: 1,
    fontFamily: 'monospace',
    fontSize: 18,
    lineHeight: 26,
    padding: 0,
    paddingHorizontal: 4,
    paddingVertical: 2,
    // @ts-ignore - Web-specific styles
    outline: 'none',
    outlineWidth: 0,
  },
  toggleButton: {
    position: 'absolute',
    right: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  toggleButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
});

