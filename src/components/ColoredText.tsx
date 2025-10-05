import React from 'react';
import { Text, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { TextSpan, SPAN_COLORS, UI_COLORS, SPAN_TEXT_COLORS } from '../types/colors';

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
  if (spans.length === 0) {
    return (
      <Text style={[styles.baseText, style, { color: placeholderColor }]}>
        {placeholder}
      </Text>
    );
  }

  return (
    <Text style={[styles.baseText, style]}>
      {spans.map((span) => (
        <Text
          key={span.id}
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
