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
