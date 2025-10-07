import { create } from 'zustand';

// AI processing states
export type AIProcessingState = 'idle' | 'processing' | 'complete';

// AI store interface
interface AIStore {
  state: AIProcessingState;
  progress: number; // 0-100
  message: string;
  startProcessing: () => void;
  completeProcessing: () => void;
  resetProcessing: () => void;
  setProgress: (progress: number) => void;
  setMessage: (message: string) => void;
}

export const useAIStore = create<AIStore>((set) => ({
  state: 'idle',
  progress: 0,
  message: '',
  
  startProcessing: () => {
    set({ 
      state: 'processing', 
      progress: 0, 
      message: 'Preparing AI processing...' 
    });
  },
  
  completeProcessing: () => {
    set({ 
      state: 'complete', 
      progress: 100, 
      message: 'Processing complete!' 
    });
  },
  
  resetProcessing: () => {
    set({ 
      state: 'idle', 
      progress: 0, 
      message: '' 
    });
  },
  
  setProgress: (progress: number) => {
    set({ progress });
  },
  
  setMessage: (message: string) => {
    set({ message });
  },
}));
