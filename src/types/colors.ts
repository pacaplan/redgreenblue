// Color system types for RedGreenBlue app
export type ColorState = 'blue' | 'yellow' | 'red' | 'green' | 'white';

// Text span data structure
export interface TextSpan {
  id: string;
  text: string;
  color: ColorState;
  changeGroupId?: string; // Optional: ID of the change group this span belongs to (for diff mode)
}

// Color constants with exact hex values
export const COLORS = {
  blue: '#ADD8E6', // Light blue for new text input
  yellow: '#FFFF99', // Light yellow for user-marked AI prompts
  red: '#FFB6C1', // Light red for original text during AI processing
  green: '#90EE90', // Light green for AI suggestions
  white: '#FFFFFF', // White for accepted AI suggestions
} as const;

// Text colors and UI chroma values
export const UI_COLORS = {
  background: '#FFFFFF',
  caret: '#111111',
  placeholder: '#999999',
  selection: '#99CCFF',
  textPrimary: '#111111',
  textSecondary: '#333333',
  transparent: 'transparent',
} as const;

// Background colors for text spans (lighter highlights)
// Per ui-mockups.md specification:
// RED: Light red background (#FFE5E5) for deleted/replaced lines
// GREEN: Light green background (#E5FFE5) for added/new lines  
// WHITE: White/light gray background (#FFFFFF) for unchanged lines
// BLUE: Light blue background (#E5F2FF) for original user input
// YELLOW: Light yellow background (#FFF9E5) for user-marked prompts
export const SPAN_COLORS = {
  blue: '#E5F2FF',
  yellow: '#FFF9E5',
  red: '#FFE5E5',
  green: '#E5FFE5',
  white: UI_COLORS.transparent,
} as const;

// Text colors for text spans
// Per ui-mockups.md specification:
// RED: dark red text (#CC0000)
// GREEN: dark green text (#007700)
// BLUE: dark blue text (#0066CC)
// YELLOW: dark yellow text (#B8860B)
// WHITE: normal black text
export const SPAN_TEXT_COLORS: Record<ColorState, string> = {
  blue: '#0066CC',
  green: '#007700',
  red: '#CC0000',
  white: UI_COLORS.textPrimary,
  yellow: '#B8860B',
};
