import { TextSpan } from '../types/colors';
import { ChangeGroup } from '../utils/diffUtils';

// Document store types
export interface DocumentState {
  text: string; // Keep for backward compatibility during transition
  textSpans: TextSpan[];
  originalSpans: TextSpan[]; // Store original spans before diff for rejection
  changeGroups: ChangeGroup[];
  isDiffMode: boolean; // Whether we're in diff review mode
  setText: (text: string) => void;
  setTextSpans: (spans: TextSpan[]) => void;
  addTextSpan: (text: string, color?: 'blue' | 'yellow' | 'red' | 'green' | 'white') => void;
  updateTextSpan: (id: string, updates: Partial<TextSpan>) => void;
  toggleSpanColor: (id: string) => void; // Toggle blue ↔ yellow
  setDiffMode: (diffSpans: TextSpan[], changeGroups: ChangeGroup[], originalSpans: TextSpan[]) => void;
  acceptChangeGroup: (groupId: string) => void;
  rejectChangeGroup: (groupId: string) => void;
  exitDiffMode: () => void;
}
