# The Great Wheel of Mysteries — Android / iOS Mobile Shell (Expo)

This folder contains the complete Expo wrapper with `react-native-webview` pre-configured to point to your live deployment:
`https://ais-pre-dkvhqajfbzlqysa4hbgg25-194078280418.us-east1.run.app`

## Prerequisites

1. Install EAS CLI globally if you haven't already:
   ```bash
   npm install -g eas-cli
   ```
2. Log in to your Expo account:
   ```bash
   eas login
   ```

## Build Android APK with EAS

1. Navigate to the `wheel-mobile` folder:
   ```bash
   cd wheel-mobile
   ```
2. Install the mobile dependencies:
   ```bash
   npm install
   ```
3. Run the EAS build command:
   ```bash
   eas build --platform android --profile preview
   ```
4. EAS will build a standalone `.apk` in the cloud that you can download and install directly on any Android device.

## Voice-to-Text & Speech Features

- **Microphone Recording (`expo-av`)**: Tap the floating `🎙️ Voice Query` button to activate microphone capture with live audio waveform metering.
- **AI Transcription (`/api/transcribe`)**: Spoken audio is analyzed and converted into sacred esoteric queries via Gemini 3.8 Flash.
- **Direct Bridge (`injectOracleQuery`)**: Transcriptions immediately bridge into `injectOracleQuery` to consult the Oracle within the WebView.
- **Expo-Speech Vocalization (`expo-speech`)**: Audibly vocalizes inquiries and Oracle invocations using device text-to-speech synthesis with customizable speech toggle.

## Advanced Mobile Environment: Termux & TermuxArch

For advanced users running The Great Wheel of Mysteries mobile companion or developing on Android via Termux:
- **TermuxArch ([termuxarch.github.io/TermuxArch](https://termuxarch.github.io/TermuxArch))**: Easily bootstrap an Arch Linux environment inside Termux on your Android device.
- This allows full local development, Node.js tooling, Python orchestration, and Git version control directly on mobile hardware alongside Expo.


