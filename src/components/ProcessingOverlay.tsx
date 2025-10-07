import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useAIStore } from '../store/aiStore';

export const ProcessingOverlay: React.FC = () => {
  const aiState = useAIStore((state) => state.state);
  const progress = useAIStore((state) => state.progress);
  const message = useAIStore((state) => state.message);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (aiState === 'processing') {
      // Fade in overlay
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
      // Create pulsing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Reset checkmark
      checkmarkScale.setValue(0);
    } else if (aiState === 'complete') {
      // Stop pulsing and show checkmark with bounce
      pulseAnim.stopAnimation(() => {
        pulseAnim.setValue(1);
      });
      
      Animated.spring(checkmarkScale, {
        toValue: 1,
        tension: 100,
        friction: 5,
        useNativeDriver: true,
      }).start();
    } else {
      // Fade out when idle
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
      pulseAnim.setValue(1);
      checkmarkScale.setValue(0);
    }
  }, [aiState, pulseAnim, checkmarkScale, fadeAnim]);
  
  if (aiState !== 'processing' && aiState !== 'complete') {
    return null;
  }
  
  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <View style={styles.container}>
        {aiState === 'processing' && (
          <>
            <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={styles.icon}>✨</Text>
            </Animated.View>
            
            <Text style={styles.message}>{message}</Text>
            
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>
            
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </>
        )}
        
        {aiState === 'complete' && (
          <>
            <Animated.View style={[styles.iconContainer, { transform: [{ scale: checkmarkScale }] }]}>
              <Text style={[styles.icon, styles.checkmark]}>✓</Text>
            </Animated.View>
            
            <Text style={[styles.message, styles.completeMessage]}>{message}</Text>
          </>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    minWidth: 280,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 24,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  checkmark: {
    color: '#10B981', // Green color for success
    fontSize: 64,
    fontWeight: 'bold',
  },
  completeMessage: {
    color: '#10B981', // Green color for success
  },
});
