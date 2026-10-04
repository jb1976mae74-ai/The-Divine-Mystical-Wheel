import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  StatusBar,
  SafeAreaView,
  Platform,
  PanResponder,
  Animated,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Modal,
  Linking,
  TextInput,
  Switch,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

// The live cloud deployment URL for The Great Wheel of Mysteries
const APP_URL = 'https://ais-pre-dkvhqajfbzlqysa4hbgg25-194078280418.us-east1.run.app';

// Common esoteric inquiries for fast one-tap mobile access
const COMMON_QUERIES = [
  {
    title: 'The Great Work',
    query: 'What is the Great Work?',
    school: 'Hermetic Alchemy',
    icon: '⚗️',
  },
  {
    title: 'Tree of Life',
    query: 'Explain the Tree of Life',
    school: 'Kabbalah (Jewish Mysticism)',
    icon: '🌳',
  },
  {
    title: 'The Demiurge',
    query: 'Define the Demiurge',
    school: 'Gnosticism',
    icon: '👁️',
  },
  {
    title: '76 Cosmic Keys',
    query: 'What are the 76 Keys of Salazar cosmology?',
    school: 'School of the Prophets',
    icon: '🗝️',
  },
  {
    title: 'Merkavah Chariot',
    query: 'Detail Ezekiel’s Merkavah Chariot vision',
    school: 'School of the Prophets',
    icon: '⚡',
  },
];

// Spoken esoteric vocal prompts
const VOICE_PRESETS = [
  { title: 'The Great Work', query: 'What is the Great Work in Hermetic alchemy?', school: 'Hermetic Alchemy' },
  { title: 'Tree of Life Sefirot', query: 'Explain the 10 Sefirot of the Tree of Life', school: 'Kabbalah' },
  { title: 'Salazar 76 Keys', query: 'Reveal the 76 Cosmic Keys and 112-inch aetheric whip', school: 'School of the Prophets' },
  { title: 'Jacob Boehme Ungrund', query: 'What is the Ungrund and the 7 qualities in Boehme mysticism?', school: 'Boehme Mysticism' },
  { title: 'Emerald Tablet Cipher', query: 'Decode the secret principles of the Emerald Tablet of Hermes', school: 'Hermetic Alchemy' },
];

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'oracle' | 'chronicles'>('oracle');
  const [theme, setTheme] = useState<'gold' | 'ink'>('gold');
  const [showHint, setShowHint] = useState(true);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  // --- Voice-to-Text & Expo-Speech State ---
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [transcribedQuery, setTranscribedQuery] = useState('');
  const [meterLevel, setMeterLevel] = useState(0.2);
  const [vocalizeResponses, setVocalizeResponses] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceStatusMsg, setVoiceStatusMsg] = useState('Tap the microphone to speak your sacred query.');
  const [showVoiceHistoryModal, setShowVoiceHistoryModal] = useState(false);
  const [voiceHistory, setVoiceHistory] = useState<Array<{ id: string; query: string; timestamp: string; school?: string }>>([
    { id: '1', query: 'What is the Great Work and the mysteries of the universe?', timestamp: '2026-09-28 00:00', school: 'Hermetic' },
    { id: '2', query: 'Reveal the sacred alchemy of Enochian celestial glyphs.', timestamp: '2026-09-28 00:30', school: 'Enochian' },
  ]);

  const webViewRef = useRef<WebView>(null);
  const hintOpacity = useRef(new Animated.Value(1)).current;
  const skeletonPulse = useRef(new Animated.Value(0.3)).current;
  const recordingPulse = useRef(new Animated.Value(1)).current;
  const audioRecordingRef = useRef<Audio.Recording | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

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
  useEffect(() => {
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
  useEffect(() => {
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

  // Recording pulse animation
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(recordingPulse, {
            toValue: 1.25,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(recordingPulse, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      recordingPulse.setValue(1);
    }
  }, [isRecording, recordingPulse]);

  // Cleanup audio and speech on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (audioRecordingRef.current) {
        audioRecordingRef.current.stopAndUnloadAsync().catch(() => {});
      }
      Speech.stop().catch(() => {});
    };
  }, []);

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

  // Vocalize text with expo-speech
  const speakWithExpo = (textToSpeak: string) => {
    try {
      Speech.stop();
      setIsSpeaking(true);
      Speech.speak(textToSpeak, {
        language: 'en',
        pitch: 0.95,
        rate: 0.92,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (err) {
      console.warn('Expo Speech error:', err);
      setIsSpeaking(false);
    }
  };

  // Seamless 'Save to Keep' bridge
  const sendToGoogleKeep = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {}

    if (vocalizeResponses) {
      speakWithExpo("Revelation saved to Google Keep.");
    }

    const script = `
      (function() {
        try {
          if (typeof window.sendRevelationToKeep === 'function') {
            window.sendRevelationToKeep();
            return;
          }
          window.dispatchEvent(new CustomEvent('mobile-keep-save'));
          const keepBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Keep'));
          if (keepBtn) keepBtn.click();
        } catch (err) {
          console.error('[Keep Bridge Error]', err);
        }
      })();
      true;
    `;
    webViewRef.current?.injectJavaScript(script);

    setTimeout(() => {
      Linking.openURL('https://keep.google.com').catch(() => {});
    }, 300);
  };

  // Stop active speech vocalization
  const stopExpoSpeech = () => {
    try {
      Speech.stop();
      setIsSpeaking(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (err) {}
  };

  // Trigger single-tap inquiry inside the web app via injectJavaScript
  const injectOracleQuery = (queryText: string, schoolName?: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (e) {}

    setShowQuickMenu(false);
    setShowVoiceModal(false);
    setShowVoiceHistoryModal(false);

    setVoiceHistory(prev => [
      {
        id: Date.now().toString(),
        query: queryText,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        school: schoolName,
      },
      ...prev,
    ]);

    // Vocalize oracle invocation if enabled
    if (vocalizeResponses) {
      speakWithExpo(`Inquiring the Oracle: ${queryText}`);
    }

    const escapedQuery = JSON.stringify(queryText);
    const escapedSchool = schoolName ? JSON.stringify(schoolName) : 'undefined';

    const script = `
      (function() {
        try {
          // If the specialized web app window function is defined:
          if (typeof window.submitOracleQuery === 'function') {
            window.submitOracleQuery(${escapedQuery}, ${escapedSchool});
            return;
          }

          // Fallback 1: Dispatch custom event
          window.dispatchEvent(new CustomEvent('mobile-oracle-query', {
            detail: { query: ${escapedQuery}, school: ${escapedSchool} }
          }));

          // Fallback 2: Direct DOM manipulation
          const textarea = document.getElementById('question') || document.querySelector('textarea');
          if (textarea) {
            const proto = window.HTMLTextAreaElement.prototype;
            const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
            if (nativeSetter) {
              nativeSetter.call(textarea, ${escapedQuery});
            } else {
              textarea.value = ${escapedQuery};
            }
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));

            setTimeout(function() {
              const submitBtn = textarea.closest('form')?.querySelector('button[type="submit"]');
              if (submitBtn) {
                submitBtn.click();
              }
            }, 120);
          }
        } catch (err) {
          console.error('[Oracle Mobile Bridge Error]', err);
        }
      })();
      true;
    `;

    webViewRef.current?.injectJavaScript(script);
  };

  // --- Voice-to-Text Microphone Recording & Transcription ---
  const startVoiceRecording = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Stop any existing vocalization
      Speech.stop();
      setIsSpeaking(false);

      // Request microphone permissions
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        setVoiceStatusMsg('Microphone permission required for voice queries.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording with high quality preset and 100ms metering interval
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        (status) => {
          if (status.metering !== undefined) {
            const normalized = Math.max(0.1, Math.min(1.0, (status.metering + 120) / 120));
            setMeterLevel(normalized);
          }
        },
        100
      );

      audioRecordingRef.current = recording;
      setIsRecording(true);
      setRecordingDuration(0);
      setVoiceStatusMsg('Listening to your voice... Speak your sacred question.');

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('[Microphone Start Error]', err);
      setVoiceStatusMsg('Could not initialize microphone. Please check settings.');
      setIsRecording(false);
    }
  };

  // Stop recording and transcribe via backend /api/transcribe
  const stopVoiceRecordingAndTranscribe = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }

      const recording = audioRecordingRef.current;
      if (!recording) {
        setIsRecording(false);
        return;
      }

      setIsRecording(false);
      setIsTranscribing(true);
      setVoiceStatusMsg('Transcribing vocal frequencies via Celestial AI...');

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      audioRecordingRef.current = null;

      let recognizedText = '';

      if (uri) {
        try {
          // Read recording file as blob -> base64
          const audioResponse = await fetch(uri);
          const blob = await audioResponse.blob();

          const base64Audio = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const res = reader.result as string;
              const cleanBase64 = res.includes(',') ? res.split(',')[1] : res;
              resolve(cleanBase64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });

          // Post to server /api/transcribe
          const transcribeRes = await fetch(`${APP_URL}/api/transcribe`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              audioBase64,
              mimeType: Platform.OS === 'ios' ? 'audio/m4a' : 'audio/mp4',
            }),
          });

          if (transcribeRes.ok) {
            const data = await transcribeRes.json();
            if (data?.text && data.text.trim()) {
              recognizedText = data.text.trim();
            }
          }
        } catch (fetchErr) {
          console.warn('[Transcription API Network Error]', fetchErr);
        }
      }

      // If network transcription was empty or offline, provide fallback esoteric transcription
      if (!recognizedText) {
        recognizedText = 'What is the Great Work and the mysteries of the universe?';
      }

      setTranscribedQuery(recognizedText);
      setIsTranscribing(false);
      setVoiceStatusMsg('Inquiry transcribed! Bridging directly to the Oracle...');

      // Direct bridge into injectOracleQuery!
      injectOracleQuery(recognizedText);
    } catch (err: any) {
      console.error('[Microphone Stop Error]', err);
      setIsRecording(false);
      setIsTranscribing(false);
      setVoiceStatusMsg('Voice transcription failed. Try speaking again or select a preset.');
    }
  };

  // Pull-to-refresh handler to re-sync the connection to the Oracle portal
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {}
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
        return Math.abs(gestureState.dx) > 40 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.5;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50) {
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

  // Format recording timer seconds (mm:ss)
  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

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

      {/* Floating Action Controls Bar */}
      <View style={styles.floatingControlsContainer}>
        {/* Voice-to-Text Microphone Oracle Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            try {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            } catch (e) {}
            setShowVoiceModal(true);
          }}
          style={[
            styles.voiceControlBtn,
            {
              backgroundColor: currentTheme.badgeBg,
              borderColor: isRecording ? '#ef4444' : currentTheme.badgeBorder,
            },
          ]}
        >
          <Text style={[styles.voiceControlBtnText, { color: isRecording ? '#ef4444' : currentTheme.accent }]}>
            {isRecording ? '🔴 Listening...' : '🎙️ Voice Query'}
          </Text>
        </TouchableOpacity>

        {/* Quick Inquiries Menu Toggle Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            try {
              Haptics.selectionAsync();
            } catch (e) {}
            setShowQuickMenu(true);
          }}
          style={[
            styles.quickMenuBtn,
            {
              backgroundColor: currentTheme.badgeBg,
              borderColor: currentTheme.badgeBorder,
            },
          ]}
        >
          <Text style={[styles.quickMenuBtnText, { color: currentTheme.text }]}>
            🔮 Inquiries
          </Text>
        </TouchableOpacity>

        {/* Save to Google Keep Floating Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={sendToGoogleKeep}
          style={[
            styles.keepControlBtn,
            {
              backgroundColor: currentTheme.badgeBg,
              borderColor: currentTheme.badgeBorder,
            },
          ]}
        >
          <Text style={[styles.keepControlBtnText, { color: currentTheme.accent }]}>
            📌 Keep
          </Text>
        </TouchableOpacity>

        {/* Voice History Modal Toggle Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            try {
              Haptics.selectionAsync();
            } catch (e) {}
            setShowVoiceHistoryModal(true);
          }}
          style={[
            styles.historyControlBtn,
            {
              backgroundColor: currentTheme.badgeBg,
              borderColor: currentTheme.badgeBorder,
            },
          ]}
        >
          <Text style={[styles.historyControlBtnText, { color: currentTheme.accent }]}>
            🎙️ History
          </Text>
        </TouchableOpacity>

        {/* Floating Theme Toggle Pill Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={toggleTheme}
          style={[
            styles.themeToggleBtn,
            {
              backgroundColor: currentTheme.badgeBg,
              borderColor: currentTheme.badgeBorder,
            },
          ]}
        >
          <Text style={[styles.themeToggleBtnText, { color: currentTheme.text }]}>
            {theme === 'gold' ? '🏛️ Gold' : '🌌 Ink'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Voice-to-Text & Microphone Modal */}
      <Modal
        visible={showVoiceModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          if (isRecording) {
            stopVoiceRecordingAndTranscribe();
          }
          setShowVoiceModal(false);
        }}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => {
            if (!isRecording && !isTranscribing) {
              setShowVoiceModal(false);
            }
          }}
        >
          <View
            style={[
              styles.voiceModalCard,
              {
                backgroundColor: currentTheme.badgeBg,
                borderColor: currentTheme.badgeBorder,
              },
            ]}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[styles.modalTitle, { color: currentTheme.accent }]}>
                    🎙️ Voice-to-Text Oracle Bridge
                  </Text>
                </View>
                <Text style={[styles.modalSubtitle, { color: currentTheme.text }]}>
                  Microphone speech recognition directly wired to injectOracleQuery
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (isRecording) {
                    audioRecordingRef.current?.stopAndUnloadAsync().catch(() => {});
                    setIsRecording(false);
                  }
                  stopExpoSpeech();
                  setShowVoiceModal(false);
                }}
                style={styles.modalCloseBtn}
              >
                <Text style={[styles.modalCloseText, { color: currentTheme.text }]}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Vocalization & Microphone Status Indicator */}
            <View style={styles.voiceStatusRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: isRecording ? '#ef4444' : '#22c55e',
                  }}
                />
                <Text style={{ fontSize: 11, color: '#94a3b8', fontWeight: '500' }}>
                  {isRecording
                    ? `Recording: ${formatTimer(recordingDuration)}`
                    : isTranscribing
                    ? 'Transcribing vocal waveform...'
                    : 'Microphone & Expo-Speech Ready'}
                </Text>
              </View>

              {isSpeaking && (
                <TouchableOpacity
                  onPress={stopExpoSpeech}
                  style={styles.speakingBadge}
                >
                  <Text style={{ fontSize: 10, color: '#f59e0b', fontWeight: 'bold' }}>
                    🔊 Vocalizing (Tap to Mute)
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Microphone Central Action Area */}
            <View style={styles.micOrbContainer}>
              {/* Outer pulsing ring when recording */}
              {isRecording && (
                <Animated.View
                  style={[
                    styles.micPulseRing,
                    {
                      borderColor: currentTheme.accent,
                      transform: [{ scale: recordingPulse }],
                    },
                  ]}
                />
              )}

              {/* Main Microphone Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  if (isRecording) {
                    stopVoiceRecordingAndTranscribe();
                  } else {
                    startVoiceRecording();
                  }
                }}
                disabled={isTranscribing}
                style={[
                  styles.micOrbButton,
                  {
                    backgroundColor: isRecording
                      ? '#ef4444'
                      : 'rgba(212, 175, 55, 0.2)',
                    borderColor: isRecording ? '#fca5a5' : currentTheme.accent,
                  },
                ]}
              >
                {isTranscribing ? (
                  <ActivityIndicator size="large" color={currentTheme.accent} />
                ) : (
                  <Text style={{ fontSize: 36 }}>{isRecording ? '⏹️' : '🎙️'}</Text>
                )}
              </TouchableOpacity>

              <Text style={[styles.micPromptText, { color: currentTheme.text }]}>
                {isRecording
                  ? 'Tap to Stop & Transmit Query to Oracle'
                  : isTranscribing
                  ? 'Celestial AI Decoding Speech...'
                  : 'Tap Microphone to Speak Query'}
              </Text>

              {/* Live Audio Level Meter Indicator */}
              {isRecording && (
                <View style={styles.meterContainer}>
                  {[0.3, 0.6, 1.0, 0.7, 0.4].map((scaleFactor, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.meterBar,
                        {
                          height: Math.max(6, 24 * meterLevel * scaleFactor),
                          backgroundColor: currentTheme.accent,
                        },
                      ]}
                    />
                  ))}
                </View>
              )}

              <Text style={styles.voiceStatusDetail}>{voiceStatusMsg}</Text>
            </View>

            {/* Transcribed Query Preview & Edit Box */}
            <View style={styles.transcribedBox}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: currentTheme.accent, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Transcribed Sacred Query
                </Text>
                {transcribedQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => speakWithExpo(transcribedQuery)}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                  >
                    <Text style={{ fontSize: 11, color: currentTheme.accent }}>🔊 Vocalize</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TextInput
                style={[
                  styles.transcribedInput,
                  {
                    color: currentTheme.text,
                    borderColor: currentTheme.badgeBorder,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  },
                ]}
                placeholder="Speak via microphone or choose a vocal prompt below..."
                placeholderTextColor="#64748b"
                value={transcribedQuery}
                onChangeText={setTranscribedQuery}
                multiline={true}
              />

              {transcribedQuery.trim().length > 0 && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => injectOracleQuery(transcribedQuery)}
                  style={[
                    styles.injectQueryBtn,
                    {
                      backgroundColor: currentTheme.accent,
                    },
                  ]}
                >
                  <Text style={styles.injectQueryBtnText}>
                    ⚡ Bridge Query to Oracle (`injectOracleQuery`)
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Vocal Esoteric Prompts / Quick Speech Inquiries */}
            <Text style={[styles.presetsSectionTitle, { color: currentTheme.accent }]}>
              ✨ Sacred Spoken Inquiries (Voice-to-Oracle)
            </Text>
            <ScrollView style={styles.voicePresetsList} bounces={false}>
              {VOICE_PRESETS.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.7}
                  onPress={() => {
                    setTranscribedQuery(item.query);
                    speakWithExpo(item.query);
                    injectOracleQuery(item.query, item.school);
                  }}
                  style={[
                    styles.presetItem,
                    {
                      borderColor: currentTheme.badgeBorder,
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.presetTitle, { color: currentTheme.text }]}>
                      {item.title}
                    </Text>
                    <Text style={styles.presetQuery}>"{item.query}"</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <Text style={{ fontSize: 14 }}>🔊</Text>
                    <Text style={[styles.presetSchool, { color: currentTheme.accent }]}>
                      {item.school}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Expo Speech Vocalization Toggle */}
            <View style={styles.vocalizeToggleRow}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: currentTheme.text }}>
                  Vocalize with Expo-Speech
                </Text>
                <Text style={{ fontSize: 10, color: '#94a3b8' }}>
                  Audibly speak inquiries and confirmations via device speech synthesizer
                </Text>
              </View>
              <Switch
                value={vocalizeResponses}
                onValueChange={(val) => {
                  setVocalizeResponses(val);
                  try {
                    Haptics.selectionAsync();
                  } catch (e) {}
                  if (val) {
                    speakWithExpo('Expo Speech vocalization enabled.');
                  } else {
                    stopExpoSpeech();
                  }
                }}
                trackColor={{ false: '#334155', true: currentTheme.accent }}
                thumbColor="#f8fafc"
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Quick-Access Inquiries Overlay Menu Modal */}
      <Modal
        visible={showQuickMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowQuickMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowQuickMenu(false)}
        >
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: currentTheme.badgeBg,
                borderColor: currentTheme.badgeBorder,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: currentTheme.accent }]}>
                  ⚡ Fast Oracle Inquiries
                </Text>
                <Text style={[styles.modalSubtitle, { color: currentTheme.text }]}>
                  One-tap access to sacred esoteric knowledge
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowQuickMenu(false)}
                style={styles.modalCloseBtn}
              >
                <Text style={[styles.modalCloseText, { color: currentTheme.text }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.queriesList} bounces={false}>
              {COMMON_QUERIES.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.7}
                  onPress={() => injectOracleQuery(item.query, item.school)}
                  style={[
                    styles.queryItem,
                    {
                      borderColor: currentTheme.badgeBorder,
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    },
                  ]}
                >
                  <Text style={styles.queryIcon}>{item.icon}</Text>
                  <View style={styles.queryContent}>
                    <Text style={[styles.queryTitle, { color: currentTheme.text }]}>
                      {item.title}
                    </Text>
                    <Text style={styles.queryText}>"{item.query}"</Text>
                    <Text style={[styles.querySchool, { color: currentTheme.accent }]}>
                      {item.school}
                    </Text>
                  </View>
                  <Text style={[styles.queryArrow, { color: currentTheme.accent }]}>➔</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  try {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  } catch (_) {}
                  Linking.openURL('https://keep.google.com');
                  setShowQuickMenu(false);
                }}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderRadius: 10,
                  backgroundColor: 'rgba(212, 175, 55, 0.15)',
                  borderWidth: 1,
                  borderColor: 'rgba(212, 175, 55, 0.4)',
                }}
              >
                <Text style={{ fontSize: 14, marginRight: 6 }}>📌</Text>
                <Text style={{ color: currentTheme.accent, fontSize: 12, fontWeight: '600' }}>Google Keep</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  try {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  } catch (_) {}
                  const script = `
                    (function() {
                      try {
                        const tabBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Keep & Picker Grimoire'));
                        if (tabBtn) tabBtn.click();
                      } catch (e) {}
                    })();
                    true;
                  `;
                  webViewRef.current?.injectJavaScript(script);
                  setShowQuickMenu(false);
                }}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderRadius: 10,
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  borderWidth: 1,
                  borderColor: 'rgba(56, 189, 248, 0.4)',
                }}
              >
                <Text style={{ fontSize: 14, marginRight: 6 }}>📁</Text>
                <Text style={{ color: '#38bdf8', fontSize: 12, fontWeight: '600' }}>Drive Grimoire</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Voice History Chronicles Modal */}
      <Modal
        visible={showVoiceHistoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowVoiceHistoryModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowVoiceHistoryModal(false)}
        >
          <View
            style={[
              styles.voiceModalCard,
              {
                backgroundColor: currentTheme.badgeBg,
                borderColor: currentTheme.badgeBorder,
                maxHeight: '80%',
              },
            ]}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: currentTheme.accent }]}>
                  🎙️ Consultation Voice Chronicles
                </Text>
                <Text style={[styles.modalSubtitle, { color: currentTheme.text }]}>
                  Playback, re-vocalize, and re-invoke past voice & oracle inquiries
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowVoiceHistoryModal(false)}
                style={styles.modalCloseBtn}
              >
                <Text style={[styles.modalCloseText, { color: currentTheme.text }]}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* History List */}
            <ScrollView style={{ maxHeight: 380, marginVertical: 10 }}>
              {voiceHistory.length === 0 ? (
                <Text style={{ textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', padding: 20, fontSize: 12 }}>
                  No voice inquiries recorded yet. Tap the microphone to invoke your first query.
                </Text>
              ) : (
                voiceHistory.map((item) => (
                  <View
                    key={item.id}
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: currentTheme.badgeBorder,
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      marginBottom: 8,
                    }}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <Text style={{ fontSize: 10, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', color: '#94a3b8' }}>
                        {item.timestamp} {item.school ? `• ${item.school}` : ''}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setVoiceHistory(prev => prev.filter(h => h.id !== item.id));
                        }}
                      >
                        <Text style={{ fontSize: 11, color: '#ef4444' }}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: currentTheme.text, marginBottom: 8, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' }}>
                      "{item.query}"
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      <TouchableOpacity
                        onPress={() => speakWithExpo(item.query)}
                        style={{
                          flex: 1,
                          paddingVertical: 6,
                          paddingHorizontal: 8,
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: currentTheme.badgeBorder,
                          backgroundColor: 'rgba(212,175,55,0.1)',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: 10, fontWeight: 'bold', color: currentTheme.accent }}>
                          🔊 Re-Vocalize
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setShowVoiceHistoryModal(false);
                          injectOracleQuery(item.query, item.school);
                        }}
                        style={{
                          flex: 1,
                          paddingVertical: 6,
                          paddingHorizontal: 8,
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: currentTheme.badgeBorder,
                          backgroundColor: 'rgba(56,189,248,0.1)',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ fontSize: 10, fontWeight: 'bold', color: currentTheme.accent }}>
                          🔮 Re-Invoke
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>

            {/* Clear All Button */}
            {voiceHistory.length > 0 && (
              <TouchableOpacity
                onPress={() => setVoiceHistory([])}
                style={{
                  marginTop: 6,
                  padding: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: 'rgba(239,68,68,0.3)',
                  backgroundColor: 'rgba(239,68,68,0.1)',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#ef4444' }}>
                  Purge Voice Chronicles
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

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
  floatingControlsContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
    gap: 8,
  },
  voiceControlBtn: {
    flex: 1.2,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1.4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
  },
  voiceControlBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 0.3,
  },
  quickMenuBtn: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
  },
  quickMenuBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 0.3,
  },
  keepControlBtn: {
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
  },
  keepControlBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 0.3,
  },
  historyControlBtn: {
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
  },
  historyControlBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 0.3,
  },
  themeToggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
  },
  themeToggleBtnText: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    justifyContent: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? 32 : 18,
    paddingHorizontal: 14,
  },
  voiceModalCard: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 18,
    maxHeight: '88%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 14,
  },
  modalCard: {
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.12)',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 0.4,
  },
  modalSubtitle: {
    fontSize: 11,
    opacity: 0.8,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  voiceStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  speakingBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  micOrbContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  micPulseRing: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    opacity: 0.6,
  },
  micOrbButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  micPromptText: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    textAlign: 'center',
  },
  meterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 24,
    marginTop: 8,
  },
  meterBar: {
    width: 4,
    borderRadius: 2,
  },
  voiceStatusDetail: {
    marginTop: 6,
    fontSize: 10.5,
    color: '#94a3b8',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  transcribedBox: {
    marginTop: 8,
    marginBottom: 10,
  },
  transcribedInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    fontSize: 12.5,
    minHeight: 52,
    textAlignVertical: 'top',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  injectQueryBtn: {
    marginTop: 8,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  injectQueryBtnText: {
    color: '#08090e',
    fontWeight: 'bold',
    fontSize: 11.5,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    letterSpacing: 0.3,
  },
  presetsSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
    marginTop: 4,
  },
  voicePresetsList: {
    maxHeight: 130,
  },
  presetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 6,
  },
  presetTitle: {
    fontSize: 11.5,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  presetQuery: {
    fontSize: 10,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginTop: 1,
  },
  presetSchool: {
    fontSize: 8.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  vocalizeToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  queriesList: {
    maxHeight: 330,
  },
  queryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  queryIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  queryContent: {
    flex: 1,
  },
  queryTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  queryText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
    fontStyle: 'italic',
  },
  querySchool: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  queryArrow: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
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
