# Build Instructions for Free Vehicle Finder

## 📱 Prerequisites

Before building, ensure you have:

1. **Node.js** (v16+)
   ```bash
   node --version
   ```

2. **npm** or **yarn**
   ```bash
   npm --version
   ```

3. **Expo CLI**
   ```bash
   npm install -g expo-cli
   eas-cli@latest
   ```

4. **For Android Development**
   - Android Studio
   - Android SDK (API level 21+)
   - Android emulator or physical device

5. **For iOS Development** (macOS only)
   - Xcode
   - CocoaPods
   - iOS 14+ compatible device or simulator

## 🚀 Installation Steps

### 1. Clone Repository
```bash
git clone https://github.com/ArinBrock/Free-vehicle-finder.git
cd Free-vehicle-finder
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

## 🔧 Configuration

### 1. Google Maps API Key
Create a `.env` file in the root directory:
```
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
EXPO_PUBLIC_API_BASE_URL=https://api.example.com
```

### 2. Environment Variables
```bash
# .env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_KEY
EXPO_PUBLIC_API_BASE_URL=YOUR_API_URL
FIREBASE_API_KEY=YOUR_FIREBASE_KEY
```

## 🏗️ Development Build

### Start Development Server
```bash
npm start
# or
npx expo start
```

This will start the Expo development server. You'll see a terminal UI with options:

```
› Press a to open Android
› Press i to open iOS simulator
› Press w to open web
› Press r to reload
› Press m to toggle menu
```

### Run on Android Emulator
```bash
npm run android
# or
npx expo start --android
```

### Run on iOS Simulator (macOS)
```bash
npm run ios
# or
npx expo start --ios
```

### Run on Physical Device
1. Install Expo Go app from Play Store (Android) or App Store (iOS)
2. Run `npm start`
3. Scan QR code with Expo Go app
4. App loads on your device

## 📦 Production Build

### Build for Android

#### Option 1: Using Expo Application Services (EAS)
```bash
# Install EAS CLI
npm install -g eas-cli

# Build APK (for testing/distribution)
eas build --platform android --local

# Build AAB (for Google Play Store)
eas build --platform android --type app-signing
```

#### Option 2: Local Build
```bash
# Generate unsigned APK
npx expo prebuild --clean
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

### Build for iOS (macOS only)

#### Option 1: Using EAS
```bash
eas build --platform ios --local
```

#### Option 2: Using Xcode
```bash
# Prebuild for iOS
npx expo prebuild --clean --platform ios

# Open in Xcode
xed ios

# In Xcode: Select target > Build > Archive > Distribute App
```

### Build for Web
```bash
npm run build:web
# or
npx expo export:web
```

Output: `web-build/` directory ready for hosting

## 📤 Distribution

### Google Play Store
1. Create Google Play Developer account
2. Prepare app signing certificate
3. Build AAB (Android App Bundle)
4. Upload to Play Console

```bash
eas build --platform android --type app-signing
# Upload to Google Play Console
```

### Apple App Store
1. Create Apple Developer account
2. Complete app setup in App Store Connect
3. Build iOS app

```bash
eas build --platform ios
# Download and upload to App Store Connect
```

### Direct APK Distribution
1. Build APK for Android
2. Share APK file directly
3. Users can install via `adb install app.apk`

## 🧪 Testing the Build

### Before Release
```bash
# Test on emulator/simulator
npm run android  # or npm run ios

# Run unit tests
npm test

# Run E2E tests
npm run test:e2e
```

### Post-Build Testing
1. Test all screens and navigation
2. Test VIN verification with sample VINs
3. Test title verification with mock data
4. Test map functionality with location
5. Test search functionality
6. Verify permissions work correctly

## 🐛 Troubleshooting

### Common Issues

**Issue: "expo command not found"**
```bash
npm install -g expo-cli
```

**Issue: Android emulator won't start**
```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd emulator-name
```

**Issue: Build fails with permission errors**
```bash
# Android
cd android && ./gradlew clean && cd ..

# Then rebuild
npm run android
```

**Issue: iOS build fails on macOS**
```bash
# Clear cache and rebuild
npx expo prebuild --clean --platform ios
cd ios
pod install --repo-update
cd ..
```

**Issue: API keys not recognized**
- Verify `.env` file exists in root directory
- Ensure variable names match `app.json` usage
- Restart development server after changing `.env`

## 📊 Build Performance

### Optimization Tips
- Use production builds for testing
- Enable ProGuard for Android (release builds)
- Use app code splitting
- Optimize image assets (use WebP)
- Enable JavaScript engine optimization

### Reducing Build Size
```bash
# Use hermes engine for Android (faster, smaller)
# Configure in app.json:
"android": {
  "jsEngine": "hermes"
}

# Remove unused native modules from eas.json
```

## 🔐 Security

Before releasing:

1. ✅ Never commit `.env` files with real keys
2. ✅ Use environment-specific keys
3. ✅ Enable code signing
4. ✅ Run security audit: `npm audit`
5. ✅ Review permissions in `app.json`
6. ✅ Test with real location data
7. ✅ Verify API endpoints are HTTPS

## 📝 Version Management

Update version before building:
```json
{
  "version": "1.0.0",
  "expo": {
    "name": "Free Vehicle Finder",
    "slug": "free-vehicle-finder"
  }
}
```

## 🎯 Next Steps After Build

1. **Monitor crashes** - Set up Sentry or Firebase Crashlytics
2. **Track analytics** - Implement Firebase Analytics
3. **Gather feedback** - Add in-app feedback mechanism
4. **Plan updates** - Schedule regular release cycles
5. **Scale infrastructure** - Prepare backend for production load

## 📞 Support

For build issues:
- Check official [Expo documentation](https://docs.expo.dev)
- Review [React Native docs](https://reactnative.dev)
- Check GitHub issues
- Contact development team

---

**Happy Building! 🚀**
