import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ChangeGroup } from '../utils/diffUtils';
import { TextSpan, SPAN_COLORS, SPAN_TEXT_COLORS, UI_COLORS } from '../types/colors';
import { ColoredText } from './ColoredText';

interface ChangeGroupDisplayProps {
  changeGroup: ChangeGroup;
  spans: TextSpan[]; // The red and green spans for this change group
  changeNumber: number; // Display number (1, 2, 3, etc.)
  onAccept: (groupId: string) => void;
  onReject: (groupId: string) => void;
}

export const ChangeGroupDisplay: React.FC<ChangeGroupDisplayProps> = ({
  changeGroup,
  spans,
  changeNumber,
  onAccept,
  onReject,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Change {changeNumber}</Text>
      </View>
      
      <View style={styles.content}>
        <ColoredText
          spans={spans}
          style={styles.diffText}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.acceptButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => onAccept(changeGroup.id)}
        >
          <Text style={styles.buttonText}>✓ Accept</Text>
        </Pressable>
        
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.rejectButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => onReject(changeGroup.id)}
        >
          <Text style={styles.buttonText}>✕ Reject</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: '#666',
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#666',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  content: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  diffText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'monospace',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#CCC',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

