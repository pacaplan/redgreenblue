import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextSpan } from '../types/colors';

const DOCUMENT_KEY = '@redgreenblue:document';
const TEXT_SPANS_KEY = '@redgreenblue:textSpans';

export const storage = {
  async saveDocument(text: string): Promise<void> {
    try {
      await AsyncStorage.setItem(DOCUMENT_KEY, text);
    } catch (error) {
      console.error('Error saving document:', error);
    }
  },

  async loadDocument(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(DOCUMENT_KEY);
    } catch (error) {
      console.error('Error loading document:', error);
      return null;
    }
  },

  async saveTextSpans(spans: TextSpan[]): Promise<void> {
    try {
      const spansJson = JSON.stringify(spans);
      await AsyncStorage.setItem(TEXT_SPANS_KEY, spansJson);
    } catch (error) {
      console.error('Error saving text spans:', error);
    }
  },

  async loadTextSpans(): Promise<TextSpan[] | null> {
    try {
      const spansJson = await AsyncStorage.getItem(TEXT_SPANS_KEY);
      if (spansJson === null) {
        return null;
      }
      return JSON.parse(spansJson) as TextSpan[];
    } catch (error) {
      console.error('Error loading text spans:', error);
      return null;
    }
  },
};
