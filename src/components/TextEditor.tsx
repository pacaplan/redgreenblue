import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputSelectionChangeEventData,
  TextStyle,
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

    const spanId = currentSpanIdRef.current ?? `span_${Date.now()}`;
    currentSpanIdRef.current = spanId;

    const existingSpan = textSpans.find((span) => span.id === spanId);
    const updatedSpan: TextSpan = {
      id: spanId,
      text: newText,
      color: existingSpan?.color ?? 'blue',
    };

    if (textSpans.length === 1 && textSpans[0].id === spanId) {
      const currentSpan = textSpans[0];
      if (currentSpan.text !== newText || currentSpan.color !== updatedSpan.color) {
        setTextSpans([updatedSpan]);
      }
    } else {
      setTextSpans([updatedSpan]);
    }
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
        <View pointerEvents="none" style={styles.displayLayer}>
          <ColoredText
            spans={textSpans.length > 0 ? textSpans : []}
            style={styles.displayText}
            placeholder={placeholder}
            placeholderColor={UI_COLORS.placeholder}
          />
        </View>
        <TextInput
          style={[
            transparentTextInputStyle,
            StyleSheet.absoluteFill,
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
    borderColor: UI_COLORS.transparent,
    borderStyle: 'none',
    borderWidth: 0,
    flex: 1,
    outline: 'none',
    position: 'relative',
  },
  textInput: {
    borderColor: UI_COLORS.transparent,
    borderRadius: 0,
    borderStyle: 'none',
    borderWidth: 0,
    boxShadow: 'none',
    color: UI_COLORS.textPrimary,
    flex: 1,
    fontFamily: 'monospace',
    fontSize: 18,
    lineHeight: 26,
    outline: 'none',
    outlineWidth: 0,
    padding: 0,
  },
});

