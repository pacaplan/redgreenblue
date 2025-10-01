import { create } from 'zustand';
import { DocumentState } from './types';

export const useDocumentStore = create<DocumentState>((set) => ({
  text: '',
  setText: (text: string) => set({ text }),
}));
