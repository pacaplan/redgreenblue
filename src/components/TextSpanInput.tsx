import React, { useRef, useEffect, useState } from 'react';
import { TextInput, StyleSheet, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { TextSpan } from '../types/colors';

interface TextSpanInputProps {
  span: TextSpan;
  onContentChange: (id: string, content: string) => void;
  onReturnPress: (id: string, cursorPosition: number) => void;
  shouldFocus?: boolean;
  onFocus?: (id: string) => void;
}

export const TextSpanInput: React.FC<TextSpanInputProps> = ({
  span,
  onContentChange,
  onReturnPress,
  shouldFocus = false,
  onFocus,
}) => {
  const inputRef = useRef<TextInput>(null);
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  useEffect(() => {
    if (shouldFocus && inputRef.current) {
      // Small delay to ensure the component is mounted
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [shouldFocus]);

  const handleContentChange = (text: string) => {
    onContentChange(span.id, text);
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Enter') {
      e.preventDefault();
      onReturnPress(span.id, selection.start);
    }
  };

  const handleSelectionChange = (event: any) => {
    setSelection(event.nativeEvent.selection);
  };

  const handleFocus = () => {
    if (onFocus) {
      onFocus(span.id);
    }
  };

  return (
    <TextInput
      ref={inputRef}
      style={[styles.input, { outlineStyle: 'none' }]}
      value={span.content}
      onChangeText={handleContentChange}
      onKeyPress={handleKeyPress}
      onSelectionChange={handleSelectionChange}
      onFocus={handleFocus}
      selection={selection}
      multiline
      scrollEnabled={false}
      textAlignVertical="top"
      placeholder={span.order === 0 && !span.content ? 'Start typing...' : ''}
      placeholderTextColor="#999"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    fontSize: 18,
    lineHeight: 18,
    color: '#333',
    fontFamily: 'monospace',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderWidth: 0,
    borderStyle: 'none',
    outline: 'none',
    boxShadow: 'none',
  },
});

