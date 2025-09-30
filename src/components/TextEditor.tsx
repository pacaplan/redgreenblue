import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';

interface TextEditorProps {
  placeholder?: string;
  maxLength?: number;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  placeholder = 'Start typing...',
  maxLength = 2000,
}) => {
  const [text, setText] = useState('');
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const handleTextChange = (newText: string) => {
    if (newText.length <= maxLength) {
      setText(newText);
    }
  };

  const handleSelectionChange = (event: any) => {
    setSelection(event.nativeEvent.selection);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={text}
        onChangeText={handleTextChange}
        onSelectionChange={handleSelectionChange}
        selection={selection}
        placeholder={placeholder}
        placeholderTextColor="#999"
        multiline
        textAlignVertical="top"
        autoFocus
      />
      <View style={styles.footer}>
        <Text style={styles.characterCount}>
          {text.length}/{maxLength}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    padding: 0,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
  },
});
