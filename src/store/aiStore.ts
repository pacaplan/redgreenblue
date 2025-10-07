import { create } from 'zustand';

// AI processing states
export type AIProcessingState = 'idle' | 'processing' | 'complete';

// AI store interface
interface AIStore {
  state: AIProcessingState;
  progress: number; // 0-100
  message: string;
  suggestion: string | null; // The AI-generated suggestion
  startProcessing: () => void;
  completeProcessing: (suggestion: string) => void;
  resetProcessing: () => void;
  setProgress: (progress: number) => void;
  setMessage: (message: string) => void;
}

export const useAIStore = create<AIStore>((set) => ({
  state: 'idle',
  progress: 0,
  message: '',
  suggestion: null,
  
  startProcessing: () => {
    set({ 
      state: 'processing', 
      progress: 0, 
      message: 'Preparing AI processing...',
      suggestion: null
    });
  },
  
  completeProcessing: (suggestion: string) => {
    set({ 
      state: 'complete', 
      progress: 100, 
      message: 'Processing complete!',
      suggestion
    });
  },
  
  resetProcessing: () => {
    set({ 
      state: 'idle', 
      progress: 0, 
      message: '',
      suggestion: null
    });
  },
  
  setProgress: (progress: number) => {
    set({ progress });
  },
  
  setMessage: (message: string) => {
    set({ message });
  },
}));
