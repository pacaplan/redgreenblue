import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useDocumentStore } from '../store/documentStore';
import { ChangeGroupDisplay } from './ChangeGroupDisplay';
import { ColoredText } from './ColoredText';
import { groupSpansByChangeGroup } from '../utils/diffUtils';
import { UI_COLORS } from '../types/colors';

/**
 * DiffView displays the diff results with change groups
 * Shows red (removed), green (added), and white (unchanged) text
 * Each change group has Accept/Reject buttons
 */
export const DiffView: React.FC = () => {
  const textSpans = useDocumentStore((state) => state.textSpans);
  const changeGroups = useDocumentStore((state) => state.changeGroups);
  const acceptChangeGroup = useDocumentStore((state) => state.acceptChangeGroup);
  const rejectChangeGroup = useDocumentStore((state) => state.rejectChangeGroup);
  
  // Group spans by their change groups
  const spanGroups = groupSpansByChangeGroup(textSpans, changeGroups);
  
  let changeNumber = 1;
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Review AI Changes</Text>
        <Text style={styles.subHeaderText}>
          Accept or reject each change independently
        </Text>
      </View>
      
      {spanGroups.map((spanGroup, index) => {
        if (spanGroup.changeGroup) {
          // This is a change group - render with accept/reject buttons
          const currentChangeNumber = changeNumber;
          changeNumber++;
          
          return (
            <ChangeGroupDisplay
              key={spanGroup.changeGroup.id}
              changeGroup={spanGroup.changeGroup}
              spans={spanGroup.spans}
              changeNumber={currentChangeNumber}
              onAccept={acceptChangeGroup}
              onReject={rejectChangeGroup}
            />
          );
        } else {
          // This is unchanged text (white) - render without buttons
          return (
            <View key={`unchanged-${index}`} style={styles.unchangedSection}>
              <ColoredText
                spans={spanGroup.spans}
                style={styles.unchangedText}
              />
            </View>
          );
        }
      })}
      
      {changeGroups.length === 0 && (
        <View style={styles.noChangesContainer}>
          <Text style={styles.noChangesText}>All changes have been reviewed!</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: UI_COLORS.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  subHeaderText: {
    fontSize: 14,
    color: '#666',
  },
  unchangedSection: {
    marginVertical: 4,
  },
  unchangedText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'monospace',
    color: '#666',
  },
  noChangesContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  noChangesText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
});

