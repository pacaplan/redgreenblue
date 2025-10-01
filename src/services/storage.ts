import AsyncStorage from '@react-native-async-storage/async-storage';

const DOCUMENT_KEY = '@redgreenblue:document';

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
};
