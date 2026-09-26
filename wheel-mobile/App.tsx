import React, { useState, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, StatusBar, SafeAreaView, Platform, PanResponder, Animated, ScrollView, RefreshControl } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Haptics from 'expo-haptics';

// The live cloud deployment URL for The Great Wheel of Mysteries
const APP_URL = 'https://ais-pre-dkvhqajfbzlqysa4hbgg25-194078280418.us-east1.run.app';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'oracle' | 'chronicles'>('oracle');
  const [theme, setTheme] = useState<'gold' | 'ink'>('gold');
  const [showHint, setShowHint] = useState(true);
  const webViewRef = useRef<WebView>(null);
  const hintOpacity = useRef(new Animated.Value(1)).current;
  const skeletonPulse = useRef(new Animated.Value(0.3)).current;

  // Theme definitions
  const currentTheme = {
    gold: {
      bg: '#08090e',
      accent: '#D4AF37',
      text: '#FFECA1',
      badgeBg: 'rgba(15, 23, 42, 0.94)',
      badgeBorder: 'rgba(212, 175, 55, 0.5)',
      name: 'Ancient Gold',
    },
    ink: {
      bg: '#020617',
      accent: '#38bdf8',
      text: '#f8fafc',
      badgeBg: 'rgba(15, 23, 42, 0.98)',
      badgeBorder: 'rgba(56, 189, 248, 0.6)',
      name: 'Midnight Ink',
    },
  }[theme];

  // Fade out the swipe guidance badge after 4 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(hintOpacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => setShowHint(false));
    }, 4000);
    return () => clearTimeout(timer);
  }, [hintOpacity]);

  // Skeleton pulse animation loop
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(skeletonPulse, {
          toValue: 0.85,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(skeletonPulse, {
          toValue: 0.3,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [skeletonPulse]);

  // Toggle theme handler
  const toggleTheme = () => {
    const nextTheme = theme === 'gold' ? 'ink' : 'gold';
    setTheme(nextTheme);
    try {
      Haptics.selectionAsync();
    } catch (e) {}

    // Optionally inject theme mode into WebView
    webViewRef.current?.injectJavaScript(`
      (function() {
        document.documentElement.setAttribute('data-mobile-theme', '${nextTheme}');
        window.dispatchEvent(new CustomEvent('mobile-theme-change', { detail: '${nextTheme}' }));
      })();
      true;
    `);
  };

  // Pull-to-refresh handler to re-sync the connection to the Oracle portal
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      // Fallback if haptics unavailable on web/simulator
    }
    webViewRef.current?.reload();
    const timer = setTimeout(() => {
      setRefreshing(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // PanResponder for swipe-to-navigate gesture between Oracle and Chronicles
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Trigger on intentional horizontal swipe gesture (dx > dy)
        return Math.abs(gestureState.dx) > 40 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.5;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
          // Swipe Right -> Open Chronicles
          setViewMode('chronicles');
          try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          } catch (e) {}
          webViewRef.current?.injectJavaScript(`
            (function() {
              const historyBtn = document.querySelector('button[aria-label*="Chronicles"], button[aria-label*="History"], button:has(svg.lucide-history), button:has(svg.lucide-notebook)');
              if (historyBtn) { historyBtn.click(); }
              else { window.location.hash = '#chronicles'; }
            })();
            true;
          `);
        } else if (gestureState.dx < -50) {
          // Swipe Left -> Return to Main Oracle
          setViewMode('oracle');
          try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          } catch (e) {}
          webViewRef.current?.injectJavaScript(`
            (function() {
              const closeBtn = document.querySelector('button[aria-label*="Close"], button:has(svg.lucide-x)');
              if (closeBtn) { closeBtn.click(); }
              else { window.location.hash = ''; }
            })();
            true;
          `);
        }
      },
    })
  ).current;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.bg }]} {...panResponder.panHandlers}>
      <StatusBar barStyle="light-content" backgroundColor={currentTheme.bg} />
      <ScrollView
        contentContainerStyle={[styles.scrollContainer, { backgroundColor: currentTheme.bg }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={currentTheme.accent}
            colors={[currentTheme.accent]}
            progressBackgroundColor={currentTheme.bg}
          />
        }
      >
        <WebView
          ref={webViewRef}
          source={{ uri: APP_URL }}
          style={[styles.webview, { backgroundColor: currentTheme.bg }]}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsBackForwardNavigationGestures={true}
          onLoadEnd={() => {
            setIsLoading(false);
            setRefreshing(false);
          }}
        />
      </ScrollView>

      {/* Floating Theme Toggle Pill Button */}
      <View style={styles.themeToggleContainer}>
        <Text
          onPress={toggleTheme}
          style={[
            styles.themeToggleBtn,
            {
              backgroundColor: currentTheme.badgeBg,
              borderColor: currentTheme.badgeBorder,
              color: currentTheme.text,
            },
          ]}
        >
          {theme === 'gold' ? '🏛️ Ancient Gold' : '🌌 Midnight Ink'}
        </Text>
      </View>

      {showHint && (
        <Animated.View
          style={[
            styles.hintBadge,
            {
              opacity: hintOpacity,
              backgroundColor: currentTheme.badgeBg,
              borderColor: currentTheme.badgeBorder,
            },
          ]}
        >
          <Text style={[styles.hintText, { color: currentTheme.text }]}>
            Swipe Right ➔ Chronicles | Swipe Left ➔ Oracle
          </Text>
        </Animated.View>
      )}
      {isLoading && (
        <View style={[styles.loadingOverlay, { backgroundColor: currentTheme.bg }]}>
          <View style={styles.skeletonHeader}>
            <Animated.View style={[styles.skeletonCircle, { borderColor: currentTheme.accent, opacity: skeletonPulse }]} />
            <Animated.View style={[styles.skeletonTitleBar, { backgroundColor: currentTheme.accent, opacity: skeletonPulse }]} />
            <Animated.View style={[styles.skeletonSubBar, { backgroundColor: currentTheme.text, opacity: skeletonPulse }]} />
          </View>
          <View style={styles.skeletonCardContainer}>
            <Animated.View style={[styles.skeletonCard, { borderColor: currentTheme.badgeBorder, backgroundColor: currentTheme.badgeBg, opacity: skeletonPulse }]} />
            <Animated.View style={[styles.skeletonCard, { borderColor: currentTheme.badgeBorder, backgroundColor: currentTheme.badgeBg, opacity: skeletonPulse }]} />
            <Animated.View style={[styles.skeletonCardLong, { borderColor: currentTheme.badgeBorder, backgroundColor: currentTheme.badgeBg, opacity: skeletonPulse }]} />
          </View>
          <View style={styles.skeletonFooter}>
            <ActivityIndicator size="small" color={currentTheme.accent} />
            <Text style={[styles.loadingText, { color: currentTheme.text }]}>Aligning Sacred Portals...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  skeletonHeader: {
    alignItems: 'center',
    marginBottom: 28,
  },
  skeletonCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    marginBottom: 16,
  },
  skeletonTitleBar: {
    width: 200,
    height: 16,
    borderRadius: 6,
    marginBottom: 8,
  },
  skeletonSubBar: {
    width: 120,
    height: 10,
    borderRadius: 4,
  },
  skeletonCardContainer: {
    width: '85%',
    maxWidth: 340,
    gap: 12,
    marginBottom: 28,
  },
  skeletonCard: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
  },
  skeletonCardLong: {
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
  },
  skeletonFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeToggleContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    right: 16,
    zIndex: 100,
  },
  themeToggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.2,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    overflow: 'hidden',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  hintBadge: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 12 : 12,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    zIndex: 99,
  },
  hintText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 0.5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 1,
  },
});
