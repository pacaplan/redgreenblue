import { TextSpan } from '../types/colors';

// Document store types
export interface DocumentState {
  text: string; // Keep for backward compatibility during transition
  textSpans: TextSpan[];
  setText: (text: string) => void;
  setTextSpans: (spans: TextSpan[]) => void;
  addTextSpan: (text: string, color?: 'blue' | 'yellow' | 'red' | 'green' | 'white') => void;
  updateTextSpan: (id: string, updates: Partial<TextSpan>) => void;
  toggleSpanColor: (id: string) => void; // Toggle blue ↔ yellow
}
