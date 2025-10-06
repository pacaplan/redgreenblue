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
    <Text 
      style={[styles.baseText, style]}
      // @ts-ignore - includeFontPadding is Android-only
      includeFontPadding={false}
    >
      {spans.map((span, index) => (
        <React.Fragment key={span.id}>
          <Text
            style={[
              styles.span,
              {
                backgroundColor: SPAN_COLORS[span.color],
                color: SPAN_TEXT_COLORS[span.color],
              },
            ]}
            // @ts-ignore - includeFontPadding is Android-only
            includeFontPadding={false}
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
    // Android-specific fixes for blurry text
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
  span: {
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    // Android-specific fixes for blurry text
    textShadowColor: 'transparent',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 0,
  },
});
