import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { ChangeGroup } from '../utils/diffUtils';
import { SPAN_COLORS } from '../types/colors';

interface ChangeGroupDisplayProps {
  changeGroup: ChangeGroup;
  onAccept: (groupId: string) => void;
  onReject: (groupId: string) => void;
}

/**
 * Minimal floating buttons for accept/reject
 * Styled like the toggle button - appears below the last green line
 */
export const ChangeGroupButtons: React.FC<ChangeGroupDisplayProps> = ({
  changeGroup,
  onAccept,
  onReject,
}) => {
  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.acceptButton,
          { opacity: pressed ? 0.7 : 1 }
        ]}
        onPress={() => onAccept(changeGroup.id)}
      >
        <Text style={styles.buttonText}>✓ Accept</Text>
      </Pressable>
      
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.rejectButton,
          { opacity: pressed ? 0.7 : 1 }
        ]}
        onPress={() => onReject(changeGroup.id)}
      >
        <Text style={styles.buttonText}>✕ Reject</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    position: 'absolute',
    right: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  acceptButton: {
    backgroundColor: '#FFFFFF', // White - text becomes white after accepting
  },
  rejectButton: {
    backgroundColor: SPAN_COLORS.blue, // Blue - text reverts to blue after rejecting
  },
  buttonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '600',
  },
});

