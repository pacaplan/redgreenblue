import { create } from 'zustand';
import { DocumentState } from './types';
import { storage } from '../services/storage';

export const useDocumentStore = create<DocumentState>((set) => ({
  text: '',
  setText: (text: string) => {
    set({ text });
    storage.saveDocument(text);
  },
}));

// Load persisted document on app start
storage.loadDocument().then((savedText) => {
  if (savedText !== null) {
    useDocumentStore.setState({ text: savedText });
  }
});
