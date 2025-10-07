import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useDocumentStore } from '../store/documentStore';
import { useAIStore } from '../store/aiStore';

interface ProcessAIButtonProps {
  onPress: () => void;
}

export const ProcessAIButton: React.FC<ProcessAIButtonProps> = ({ onPress }) => {
  const textSpans = useDocumentStore((state) => state.textSpans);
  const isDiffMode = useDocumentStore((state) => state.isDiffMode);
  const aiState = useAIStore((state) => state.state);
  
  // Show button when document has blue or yellow text
  const hasProcessableText = textSpans.some(
    (span) => (span.color === 'blue' || span.color === 'yellow') && span.text.trim().length > 0
  );
  
  // Hide button if no processable text, if AI is processing, or if in diff mode
  if (!hasProcessableText || aiState === 'processing' || isDiffMode) {
    return null;
  }
  
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { opacity: pressed ? 0.7 : 1 }
      ]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>✨ Process with AI</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
    backgroundColor: '#6366F1', // Indigo color for AI action
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

