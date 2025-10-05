import React, { useRef } from 'react';
import { Text, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { TextSpan, SPAN_COLORS, UI_COLORS, SPAN_TEXT_COLORS } from '../types/colors';
import { useDocumentStore } from '../store/documentStore';

interface ColoredTextProps {
  spans: TextSpan[];
  style?: StyleProp<TextStyle>;
  placeholder?: string;
  placeholderColor?: string;
}

export const ColoredText: React.FC<ColoredTextProps> = ({
  spans,
  style,
  placeholder,
  placeholderColor = UI_COLORS.placeholder,
}) => {
  const toggleSpanColor = useDocumentStore((state) => state.toggleSpanColor);
  const lastTapRef = useRef<{ [key: string]: number }>({});

  const handlePress = (spanId: string, spanColor: string) => {
    // Only enable double-tap on blue and yellow spans
    if (spanColor !== 'blue' && spanColor !== 'yellow') {
      return;
    }

    const now = Date.now();
    const lastTap = lastTapRef.current[spanId] || 0;
    const timeDiff = now - lastTap;

    // Double-tap detected (within 300ms)
    if (timeDiff < 300) {
      toggleSpanColor(spanId);
      lastTapRef.current[spanId] = 0; // Reset
    } else {
      lastTapRef.current[spanId] = now;
    }
  };

  if (spans.length === 0) {
    return (
      <Text style={[styles.baseText, style, { color: placeholderColor }]}>
        {placeholder}
      </Text>
    );
  }

  return (
    <Text style={[styles.baseText, style]}>
      {spans.map((span, index) => (
        <React.Fragment key={span.id}>
          <Text
            onPress={() => handlePress(span.id, span.color)}
            style={[
              styles.span,
              {
                backgroundColor: SPAN_COLORS[span.color],
                color: SPAN_TEXT_COLORS[span.color],
              },
            ]}
          >
            {span.text}
          </Text>
          {index < spans.length - 1 && '\n'}
        </React.Fragment>
      ))}
    </Text>
  );
};

const styles = StyleSheet.create({
  baseText: {
    color: UI_COLORS.textPrimary,
    flexWrap: 'wrap',
    fontFamily: 'monospace',
    fontSize: 18,
    lineHeight: 26,
  },
  span: {
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
});
