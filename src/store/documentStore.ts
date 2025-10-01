import { create } from 'zustand';
import { DocumentState } from './types';
import { storage } from '../services/storage';

// Debounce timer for auto-save
let saveTimeout: NodeJS.Timeout | null = null;
const AUTOSAVE_DELAY = 500; // milliseconds

export const useDocumentStore = create<DocumentState>((set) => ({
  text: '',
  setText: (text: string) => {
    set({ text });
    
    // Clear existing timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    
    // Set new timeout for auto-save
    saveTimeout = setTimeout(() => {
      storage.saveDocument(text);
    }, AUTOSAVE_DELAY);
  },
}));

// Load persisted document on app start
storage.loadDocument().then((savedText) => {
  if (savedText !== null) {
    useDocumentStore.setState({ text: savedText });
  }
});
