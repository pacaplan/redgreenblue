// Color system types for RedGreenBlue app
export type ColorState = 'blue' | 'yellow' | 'red' | 'green' | 'white';

// Text span data structure
export interface TextSpan {
  id: string;
  text: string;
  color: ColorState;
}

// Color constants with exact hex values
export const COLORS = {
  blue: '#ADD8E6',     // Light blue for new text input
  yellow: '#FFFF99',   // Light yellow for user-marked AI prompts
  red: '#FFB6C1',      // Light red for original text during AI processing
  green: '#90EE90',    // Light green for AI suggestions
  white: '#FFFFFF',    // White for accepted AI suggestions
} as const;

// Background colors for text spans (slightly more saturated for visibility)
export const SPAN_COLORS = {
  blue: '#87CEEB',     // Sky blue
  yellow: '#FFEB3B',   // Bright yellow
  red: '#FF8A80',      // Light red
  green: '#81C784',    // Light green
  white: 'transparent', // No background for white text
} as const;
