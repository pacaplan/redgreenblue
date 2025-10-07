import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TextEditor } from './src/components/TextEditor';
import { DiffView } from './src/components/DiffView';
import { ProcessAIButton } from './src/components/ProcessAIButton';
import { ProcessingOverlay } from './src/components/ProcessingOverlay';
import { useAIStore } from './src/store/aiStore';
import { useDocumentStore } from './src/store/documentStore';
import { processWithAI } from './src/services/mockAI';
import { generateLineDiff } from './src/utils/diffUtils';

export default function App() {
  const startProcessing = useAIStore((state) => state.startProcessing);
  const setProgress = useAIStore((state) => state.setProgress);
  const setMessage = useAIStore((state) => state.setMessage);
  const completeProcessing = useAIStore((state) => state.completeProcessing);
  const textSpans = useDocumentStore((state) => state.textSpans);
  const setDiffMode = useDocumentStore((state) => state.setDiffMode);
  const isDiffMode = useDocumentStore((state) => state.isDiffMode);
  
  const handleProcessWithAI = async () => {
    // Save original spans before processing
    const originalSpans = [...textSpans];
    
    // Start AI processing
    startProcessing();
    
    // Simulate AI processing with progress updates
    const messages = [
      'Analyzing your text...',
      'Understanding context...',
      'Generating improvements...',
      'Finalizing suggestions...',
    ];
    
    // Start the actual AI processing (runs in background)
    const aiPromise = processWithAI(textSpans);
    
    // Animate progress while AI is processing
    for (let i = 0; i < messages.length; i++) {
      setMessage(messages[i]);
      const progressStart = (i / messages.length) * 100;
      const progressEnd = ((i + 1) / messages.length) * 100;
      
      // Animate progress for this step
      for (let p = progressStart; p <= progressEnd; p += 5) {
        setProgress(p);
        await new Promise(resolve => setTimeout(resolve, 150));
      }
    }
    
    // Wait for AI to complete and get the suggestion
    const suggestion = await aiPromise;
    
    // Complete processing with the generated suggestion
    completeProcessing(suggestion);
    
    // Generate line-level diff
    const diffResult = generateLineDiff(originalSpans, suggestion);
    
    // Enter diff mode with the generated change groups
    setDiffMode(diffResult.diffSpans, diffResult.changeGroups, originalSpans);
    
    // Reset AI state after a brief delay to show completion
    setTimeout(() => {
      useAIStore.getState().resetProcessing();
    }, 1500);
  };
  
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          {isDiffMode ? (
            <DiffView />
          ) : (
            <>
              <TextEditor />
              <ProcessAIButton onPress={handleProcessWithAI} />
            </>
          )}
          <ProcessingOverlay />
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
