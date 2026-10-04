/**
 * Web Haptic Feedback Utility
 * Wraps the browser's Vibration API as a substitute for React Native's Haptics.
 */

export const triggerHapticFeedback = (type: 'start' | 'finish') => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    if (type === 'start') {
      // Light feedback for start: [duration]
      navigator.vibrate(50);
    } else if (type === 'finish') {
      // Distinct feedback for finish: [duration, pause, duration]
      navigator.vibrate([100, 50, 100]);
    }
  }
};
