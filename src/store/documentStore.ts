import { create } from 'zustand';
import { DocumentState } from './types';
import { storage } from '../services/storage';
import { TextSpan, ColorState } from '../types/colors';

const { setTimeout: scheduleTimeout, clearTimeout: cancelTimeout } = globalThis;

// Debounce timer for auto-save
let saveTimeout: ReturnType<typeof scheduleTimeout> | null = null;
const AUTOSAVE_DELAY = 500; // milliseconds

// Generate unique ID for text spans
const generateSpanId = (): string => {
  return `span_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const scheduleSave = (callback: () => void) => {
  if (saveTimeout) {
    cancelTimeout(saveTimeout);
  }
  saveTimeout = scheduleTimeout(callback, AUTOSAVE_DELAY);
};

export const useDocumentStore = create<DocumentState>((set, get) => ({
  text: '',
  textSpans: [],
  originalSpans: [],
  changeGroups: [],
  isDiffMode: false,
  
  setText: (text: string) => {
    set({ text });
    scheduleSave(() => {
      storage.saveDocument(text);
    });
  },
  
  setTextSpans: (spans: TextSpan[]) => {
    const textFromSpans = spans.map((span) => span.text).join('\n');
    set({ textSpans: spans, text: textFromSpans });
    scheduleSave(() => {
      storage.saveTextSpans(spans);
      storage.saveDocument(textFromSpans);
    });
  },
  
  addTextSpan: (text: string, color: ColorState = 'blue') => {
    const newSpan: TextSpan = {
      id: generateSpanId(),
      text,
      color,
    };
    
    const currentSpans = get().textSpans;
    const updatedSpans = [...currentSpans, newSpan];
    get().setTextSpans(updatedSpans);
  },
  
  updateTextSpan: (id: string, updates: Partial<TextSpan>) => {
    const currentSpans = get().textSpans;
    const updatedSpans = currentSpans.map(span => 
      span.id === id ? { ...span, ...updates } : span
    );
    get().setTextSpans(updatedSpans);
  },
  
  toggleSpanColor: (id: string) => {
    const currentSpans = get().textSpans;
    const updatedSpans = currentSpans.map(span => {
      if (span.id === id) {
        // Toggle blue ↔ yellow only
        const newColor: ColorState = span.color === 'blue' ? 'yellow' : 
                                    span.color === 'yellow' ? 'blue' : span.color;
        return { ...span, color: newColor };
      }
      return span;
    });
    get().setTextSpans(updatedSpans);
  },
  
  setDiffMode: (diffSpans: TextSpan[], changeGroups, originalSpans: TextSpan[]) => {
    const textFromSpans = diffSpans.map((span) => span.text).join('\n');
    set({ 
      isDiffMode: true,
      textSpans: diffSpans,
      changeGroups,
      originalSpans,
      text: textFromSpans,
    });
  },
  
  acceptChangeGroup: (groupId: string) => {
    const { textSpans, changeGroups } = get();
    const group = changeGroups.find(g => g.id === groupId);
    
    if (!group) return;
    
    // Remove this change group from the list
    const updatedChangeGroups = changeGroups.filter(g => g.id !== groupId);
    
    // Convert this group's spans: delete red, convert green to white
    const updatedSpans = textSpans
      .filter(span => {
        // Keep all spans except red ones from this group
        if (span.changeGroupId === groupId && span.color === 'red') {
          return false;
        }
        return true;
      })
      .map(span => {
        // Convert green spans from this group to white
        if (span.changeGroupId === groupId && span.color === 'green') {
          return { ...span, color: 'white' as ColorState, changeGroupId: undefined };
        }
        return span;
      });
    
    // If all change groups are resolved, exit diff mode
    if (updatedChangeGroups.length === 0) {
      get().exitDiffMode();
    } else {
      const textFromSpans = updatedSpans.map((span) => span.text).join('\n');
      set({ 
        textSpans: updatedSpans,
        changeGroups: updatedChangeGroups,
        text: textFromSpans,
      });
    }
  },
  
  rejectChangeGroup: (groupId: string) => {
    const { textSpans, changeGroups, originalSpans } = get();
    const group = changeGroups.find(g => g.id === groupId);
    
    if (!group) return;
    
    // Remove this change group from the list
    const updatedChangeGroups = changeGroups.filter(g => g.id !== groupId);
    
    // Convert this group's spans: delete green, restore red to original blue/yellow
    const updatedSpans = textSpans
      .filter(span => {
        // Keep all spans except green ones from this group
        if (span.changeGroupId === groupId && span.color === 'green') {
          return false;
        }
        return true;
      })
      .map(span => {
        // Convert red spans from this group back to original color
        if (span.changeGroupId === groupId && span.color === 'red') {
          // Find original color from originalSpans
          const originalSpan = originalSpans.find(os => os.text === span.text);
          return { ...span, color: (originalSpan?.color || 'blue') as ColorState, changeGroupId: undefined };
        }
        return span;
      });
    
    // If all change groups are resolved, exit diff mode
    if (updatedChangeGroups.length === 0) {
      get().exitDiffMode();
    } else {
      const textFromSpans = updatedSpans.map((span) => span.text).join('\n');
      set({ 
        textSpans: updatedSpans,
        changeGroups: updatedChangeGroups,
        text: textFromSpans,
      });
    }
  },
  
  exitDiffMode: () => {
    const { textSpans } = get();
    const textFromSpans = textSpans.map((span) => span.text).join('\n');
    set({ 
      isDiffMode: false,
      changeGroups: [],
      originalSpans: [],
      text: textFromSpans,
    });
    scheduleSave(() => {
      storage.saveTextSpans(textSpans);
      storage.saveDocument(textFromSpans);
    });
  },
}));

// Load persisted document on app start
storage.loadDocument().then((savedText) => {
  if (savedText !== null) {
    useDocumentStore.setState({ text: savedText });
  }
});

// Load persisted text spans on app start
storage.loadTextSpans().then((savedSpans) => {
  if (savedSpans !== null) {
    const textFromSpans = savedSpans.map((span) => span.text).join('\n');
    useDocumentStore.setState({ textSpans: savedSpans, text: textFromSpans });
  }
});
