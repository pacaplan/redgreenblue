import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputSelectionChangeEventData,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { useDocumentStore } from '../store/documentStore';
import { ColoredText } from './ColoredText';
import { TextSpan, UI_COLORS } from '../types/colors';

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
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const currentSpanIdRef = useRef<string | null>(null);

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

  const handleSelectionChange = (
    event: NativeSyntheticEvent<TextInputSelectionChangeEventData>
  ) => {
    setSelection(event.nativeEvent.selection);
  };

  const transparentTextInputStyle: TextStyle = useMemo(
    () => ({
      ...styles.textInput,
      backgroundColor: UI_COLORS.transparent,
      caretColor: UI_COLORS.caret,
      color: UI_COLORS.transparent,
      selectionColor: UI_COLORS.selection,
    }),
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.editorSurface}>
        <View style={[styles.displayLayer, { pointerEvents: 'none' }]}>
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
        />
      </View>
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
});

