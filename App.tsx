import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import { TextEditor } from './src/components/TextEditor';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <TextEditor />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
