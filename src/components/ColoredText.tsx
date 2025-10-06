import React from 'react';
import { View, Text, StyleSheet, TextStyle, StyleProp } from 'react-native';
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
      <Text 
        style={[styles.baseText, style, { color: placeholderColor }]}
        // @ts-ignore - includeFontPadding is Android-only
        includeFontPadding={false}
      >
        {placeholder}
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      {spans.map((span, index) => (
        <View
          key={span.id}
          style={[
            styles.spanContainer,
            {
              backgroundColor: SPAN_COLORS[span.color],
            },
          ]}
        >
          <Text
            style={[
              styles.spanText,
              {
                color: SPAN_TEXT_COLORS[span.color],
              },
            ]}
            // @ts-ignore - includeFontPadding is Android-only
            includeFontPadding={false}
          >
            {span.text}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  baseText: {
    color: UI_COLORS.textPrimary,
    fontFamily: 'monospace',
    fontSize: 18,
    lineHeight: 26,
  },
  spanContainer: {
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginBottom: 2,
  },
  spanText: {
    fontFamily: 'monospace',
    fontSize: 18,
    lineHeight: 26,
  },
});
