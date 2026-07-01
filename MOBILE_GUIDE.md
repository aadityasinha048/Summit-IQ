# SummitIQ Native Mobile App Guide (iOS & Android)

This repository is fully configured with **Capacitor**—the modern native runtime powered by Ionic. Capacitor enables you to run this complete React + Vite + Tailwind + Firebase application as a **native application** on iOS and Android without any rewrite.

## 📱 Mobile Architecture at a Glance
* **UI & Rendering Engine**: High-performance React web core running on the system's ultra-optimized Native WebView (WebKit on iOS, Chrome on Chromium-based Android).
* **Native Bridges**: Direct access to local GPS coordinates, native alert prompts, biometric locks, and storage using Capacitor Plugin bridges.
* **Database & Auth**: Direct real-time Firebase Auth and Firestore syncing over native web sockets.

---

## 🛠️ Prerequisites & Local Setup

To compile and launch this app on a virtual simulator or your physical mobile device, follow these instructions on your local machine:

### 1. Developer Environment Requirements
* **Node.js**: Installed on your machine (v18 or higher is recommended).
* **Git**: Installed for version control.
* **For Android App Compilation**:
  * [Android Studio](https://developer.android.com/studio) downloaded and fully set up.
  * Android SDK, SDK Command-line Tools, and virtual system emulator images.
* **For iOS App Compilation** (Requires a macOS machine):
  * [Xcode](https://developer.apple.com/xcode/) installed from the Mac App Store.
  * CocoaPods command-line tool installed ('sudo gem install cocoapods' or via Homebrew).

### 2. Extract and Prepare Code
1. Export this workspace as a `.zip` file (via AI Studio settings) or push it directly to your GitHub repository.
2. Unzip the code on your development machine, open your terminal inside the folder, and run:
   ```bash
   npm install
   ```

---

## 🚀 Native Compilation & Launch Process

Follow these commands in your project root terminal to build and run the native apps:

### 1. Initial Native Platforms Configuration
You only need to run these commands **once** on your machine to provision the native project directories (`/android` and `/ios`):
```bash
# Add the compiled Android platform folder
npx cap add android

# Add the compiled iOS platform folder
npx cap add ios
```

### 2. Building & Syncing
Whenever you make custom visual changes in the React UI and want to view them on your mobile phone, build and sync with this unified script:
```bash
npm run mobile:build
```
*(This command builds your production React code into static assets inside `/dist` and automatically copies the assets into the Android & iOS assets directory.)*

### 3. Running & Compiling
Run your platform-specific native compilation manager to launch, debug, and test:

#### 🌟 Android Build (Run Emulator / Build APK)
```bash
npm run mobile:android
```
* **What this does**: Automatically launches **Android Studio** pointing directly to your `/android` wrapper folder.
* **What you do**: Click the **Run** button at the top of Android Studio to deploy the application directly into a responsive Android Virtual Device (AVD) or on your physical phone (with USB debugging enabled).

#### 🍏 iOS Build (Run Simulator / Build IPA)
```bash
npm run mobile:ios
```
* **What this does**: Automatically launches **Xcode** pointing directly to your `/ios` wrapper folder.
* **What you do**: Select your target system emulator (e.g. iPhone 15 Pro) and click the **Play/Build** button to launch the simulator.

---

## 🔐 Connecting Firestore & OAuth to Mobile

Since Firebase operates with distinct client credentials depending on the platform environment (Web vs. iOS vs. Android), follow these steps to enable flawless remote database synchronization and authentication inside your native app:

### 1. Android Configuration
1. Go to your [Firebase Console](https://console.firebase.google.com/).
2. Select your `SummitIQ` project.
3. Click **Add App** and select the **Android** platform icon.
4. Input your Android package name: **`com.summitiq.app`** (defined in your `capacitor.config.ts`).
5. Register the app, and download your platform-specific configuration file: **`google-services.json`**.
6. Place this downloaded `google-services.json` directly into:
   ```filepath
   /android/app/google-services.json
   ```

### 2. iOS Configuration
1. Click **Add App** inside your Firebase project console and select **iOS**.
2. Input your Bundle ID: **`com.summitiq.app`**.
3. Register the app, and download your file: **`GoogleService-Info.plist`**.
4. In Xcode, drag and drop the `GoogleService-Info.plist` file inside your workspace under the primary `App` target folder (ensure the checkbox "Copy items if needed" is selected).

---

## 🎨 Polishing Icons & Splash Screens

To automatically generate all sizes of app launchers, notification icons, and sleek native splash screens across both platforms:

1. Install the official assets generator utility globally:
   ```bash
   npm install -g @capacitor/assets
   ```
2. Place a high-resolution background asset inside `/resources` or `/assets`:
   * `icon-only.png` (min 1024x1024px)
   * `splash.png` (min 2732x2732px)
3. Execute the generator:
   ```bash
   npx capacitor-assets generate
   ```
This will automatically parse, slice, scale, and inject correctly structured icon and splash sizes straight into Xcode (`AppIcon.appiconset`) and Android Studio (`mipmap/` and `drawable/`) resource directories!

---

## 🔒 Publishing to App Stores

### 🗺️ Google Play Store (Android)
1. Open Android Studio via `npm run mobile:android`.
2. Go to `Build` > `Generate Signed Bundle / APK`.
3. Choose `Android App Bundle (AAB)`, enter your keystore password, configure production release, and click **Assemble**.
4. Upload the generated `.aab` file from `/android/app/release/` to the [Google Play Console](https://play.google.com/console).

### 🍎 Apple App Store (iOS)
1. Open Xcode via `npm run mobile:ios`.
2. Select target device as **Any iOS Device (arm64)**.
3. Go to **Product** > **Archive**.
4. Click **Distribute App** in the Organizer window to sign your code using your Apple Developer account certificate and upload it directly to Xcode Organizer / [App Store Connect](https://appstoreconnect.apple.com/).
