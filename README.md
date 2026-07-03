# 🏔️ SummitIQ — Global Pre-Trek Intelligence Platform

SummitIQ is a high-fidelity, full-stack pre-trek intelligence and routing platform built for adventurers, mountaineers, and hikers. It features multi-layered 3D topography mappings, real-time safety briefings powered by the Gemini 3.5 Flash LLM, altitude acclimatization tracking, tactical gear list planning, and an integrated emergency beacon utility.

With native Capacitor wrappers, SummitIQ compiles seamlessly into fully functioning **iOS** and **Android** mobile applications.

---

## 🚀 Core Features

1. **🗺️ 3D Interactive Scout Mapping**
   - High-performance, hardware-accelerated mountain topography rendering using **MapLibre GL**.
   - Custom hillshading layers and Esri World Imagery Satellite tiles for true depth and terrain assessment.
   - Dynamic waypoint, campsite, checkpoint, water-source, and risk-zone marking.
   - 3D Auto-Orbiting Scout Mode for hands-free path flyovers.

2. **🧠 AI Safety & Weather Briefings**
   - Direct integration with **Gemini 3.5 Flash** to provide instant pre-trek and live route safety reports.
   - Smart recommendation engine matching a hiker's personal fitness and experience profiles to global treks.
   - Real-time weather condition risk analysis (START vs. DELAY recommendation) with structured JSON safety criteria.

3. **💓 Health Monitor & Altitude Tracker**
   - Interactive acclimatization curves plotting ascent vs. safe altitude thresholds over time.
   - Blood oxygenation ($SpO_2$) simulation and acute mountain sickness (AMS) alerts.
   - Custom heart rate zoning and active cardio load metrics.

4. **🎒 Tactical Packing Assistant**
   - Custom list builders divided by category (Survival, Navigation, Apparel, Shelter, Culinary).
   - Dynamic total weight indicators and mandatory safety validation checklists.

5. **🚨 Emergency Beacon (SOS)**
   - Simulated satellite beacon transmission targeting global coordination hubs.
   - Coordinate reporting matching high-precision HTML5 geolocation streams.

---

## 🛠️ Architecture & Tech Stack

```
                     ┌────────────────────────┐
                     │   React Web App (SPA)   │
                     │  (Vite + Tailwind CSS) │
                     └───────────┬────────────┘
                                 │
                     ┌───────────┴────────────┐
                     │    Capacitor Runtime   │
                     │ (Mobile Native Wrapper)│
                     └─────┬────────────┬─────┘
                           │            │
            ┌──────────────▼─────┐┌─────▼──────────────┐
            │    Android (Java)  ││     iOS (Swift)    │
            └────────────────────┘└────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │      Express Backend    │
                    │  (API Proxy, Port 3000) │
                    └────────────┬────────────┘
                                 │
             ┌───────────────────┼───────────────────┐
             ▼                   ▼                   ▼
     [ Firebase Auth ]   [ Google GenAI SDK ]   [ CartoDB / Esri ]
     (User Profiles &      (Gemini 3.5 Flash       (Topo & Satellite
     Secure Database)       Safety Models)            GIS Mapping)
```

### Frontend Core
* **Framework**: React 19 (TypeScript)
* **Build System**: Vite 6.2 + Tailwind CSS v4 (native lightning-fast compiling)
* **Animation**: Framer Motion (via `motion/react`) for fluid screen changes
* **State Management**: React Hooks + Firebase Auth Context
* **Mapping**: `react-map-gl/maplibre` + `maplibre-gl` (with WebGL/WebGPU acceleration)

### Backend Services
* **Engine**: Node.js + Express
* **TypeScript Loader**: `tsx` (TypeScript Execute) for zero-compilation dev flow
* **AI Core**: Official `@google/genai` TypeScript SDK (accessing `gemini-3.5-flash`)
* **Database & Security**: **Firebase Firestore** for profile caching & active sessions
* **Authentication**: **Firebase Authentication** supporting Google OAuth

### Mobile Integration
* **Engine**: Capacitor Core (`@capacitor/core` + `@capacitor/cli`)
* **Target Platforms**: Android (Gradle compile wrapper) and iOS (CocoaPods/Xcode workspace)

---

## 📁 Repository Directory Structure

```
├── .env.example              # Template for server-side environment parameters
├── .gitignore                # Production ignores (excludes node_modules, build outputs)
├── MOBILE_GUIDE.md           # Absolute guide for compilation on Android & Xcode
├── README.md                 # Project executive summary (this file)
├── capacitor.config.ts       # Capacitor native app identifiers and build targets
├── components.json           # Styling configuration framework
├── firebase-blueprint.json   # Schema templates for Firestore database models
├── firestore.rules           # Secure granular database access boundaries
├── package.json              # App manifests, build scripts, and dependencies
├── server.ts                 # Full Express backend acting as a secure API Proxy
├── tsconfig.json             # Root strict TypeScript configurations
├── vite.config.ts            # Frontend compiler options (disables HMR for stability)
└── src/                      # Client-Side Application Core
    ├── App.tsx               # Primary interface, layout routing, and shell
    ├── AuthContext.tsx       # Firebase session & Auth listeners
    ├── firebase.ts           # Client-side Firestore and Auth configuration
    ├── index.css             # Unified CSS containing Tailwind directives
    ├── main.tsx              # React mounting entrypoint
    ├── mockData.ts           # Expansive GIS, waypoint, and route catalog data
    ├── types.ts              # Absolute TypeScript interfaces (Trek, Checkpoint, Weather)
    ├── components/           # Sub-components and Modules
    │   ├── ErrorBoundary.tsx # Catch-all react viewport crashes
    │   ├── MapComponent.tsx  # MapLibre 3D mountain navigator
    │   ├── Modules.tsx       # Tabbed views (Weather, Health, Packing, Safety)
    │   ├── TrekCard.tsx      # High-fidelity dashboard trek selection interface
    │   ├── TrekDetail.tsx    # Immersive route layout, elevation graphs, and guides
    │   └── ui/               # Modular UI building blocks (Button, Input, Badge, etc.)
    └── services/             # Client-side API dispatchers
        └── gemini.ts         # Secure server-side proxy dispatchers
```

---

## ⚙️ Setting Up & Running Locally

### 1. Configure Secrets
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Install Project Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
The server will start on port `3000` (http://localhost:3000), serving the compiled web application with backend API services.

---

## 📱 Compiling to Native Mobile

### 1. Build and Sync Web Assets
```bash
npm run mobile:build
```

### 2. Run Android Platform
```bash
npm run mobile:android
```
*(Triggers Android Studio to compile `/android` into a native package or APK.)*

### 3. Run iOS Platform
```bash
npm run mobile:ios
```
*(Triggers Xcode to compile `/ios` into an IPA or run in iOS Simulator.)*

*Refer to **`MOBILE_GUIDE.md`** for detailed step-by-step instructions for Xcode, Gradle, and Firebase Service Account configurations.*
