import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

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
        style={[styles.textInput, { outlineStyle: 'none' }]}
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
    fontSize: 18,
    lineHeight: 26,
    color: '#333',
    fontFamily: 'Courier New',
    padding: 0,
    borderWidth: 0,
    borderStyle: 'none',
    outline: 'none',
    boxShadow: 'none',
  },
});

