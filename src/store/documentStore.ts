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
  
  setText: (text: string) => {
    set({ text });
    scheduleSave(() => {
      storage.saveDocument(text);
    });
  },
  
  setTextSpans: (spans: TextSpan[]) => {
    const textFromSpans = spans.map((span) => span.text).join('');
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
    const textFromSpans = savedSpans.map((span) => span.text).join('');
    useDocumentStore.setState({ textSpans: savedSpans, text: textFromSpans });
  }
});
