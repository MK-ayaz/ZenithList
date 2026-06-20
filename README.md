# 🚀 ZenithList
**Reach your peak productivity with a local-first, minimalist experience.**

![ZenithList Header](assets/App_Preview/today_view.png)

ZenithList is a high-performance Todo application engineered for the modern mobile ecosystem. By prioritizing privacy, speed, and a streamlined user experience, it provides a focused environment for task management without the overhead of cloud synchronization.

## ✨ Key Features

### 🎯 Focused Task Management
- **Smart Views**: Specialized views for `Today`, `Upcoming`, `Inbox`, and `Completed` tasks to keep your mental load low.
- **Task Organization**: 
  - **Categories**: Group your life into projects, work, or personal areas.
  - **Priority Matrix**: High, Medium, and Low priority tagging for better decision making.
  - **Recurring Tasks**: Set it and forget it with automatic recurrence logic.

### 🎨 Premium Experience
- **Dynamic Theming**: Seamlessly switch between Light, Dark, and System modes to match your environment.
- **Fluid Motion**: High-fidelity animations powered by `React Native Reanimated 3`.
- **Native Feel**: Integrated haptic feedback for tactile confirmation of actions.
- **Optimized Performance**: Ultra-smooth scrolling using `@shopify/flash-list`.

### 🔒 Privacy & Speed
- **Local-First Architecture**: Zero cloud dependency. All data resides on your device via `AsyncStorage` and `Zustand Persist`.
- **Instant Access**: No loading spinners or API latency—your data is available immediately.

## 📸 App Previews

| Today View | Upcoming View | Inbox View |
| :---: | :---: | :---: |
| <img src="assets/App_Preview/today_view.png" width="200"> | <img src="assets/App_Preview/upcoming_view.png" width="200"> | <img src="assets/App_Preview/inbox_view.png" width="200"> |

| Done View | Statistics View |
| :---: | :---: |
| <img src="assets/App_Preview/done_view.png" width="200"> | <img src="assets/App_Preview/statistics_view.png" width="200"> |

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Expo SDK 56 (Managed Workflow) |
| **Navigation** | Expo Router (File-based) |
| **State & Persistence** | Zustand + `@react-native-async-storage/async-storage` |
| **Styling** | React Native StyleSheet |
| **Animations** | React Native Reanimated |
| **UI Components** | `@shopify/flash-list`, Lucide React Native |
| **Utilities** | `date-fns`, `expo-haptics` |

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS)
- Expo Go app or an Android/iOS emulator.

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/MK-ayaz/ZenithList.git
   cd ZenithList
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npx expo start
   ```

## 📦 Production Build

Build your production app using **Expo Application Services (EAS)**:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login and Configure
eas login
eas build:configure

# Build for Android
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production
```

## 🎨 Asset Registry

| Asset | File Name | Dimension | Description |
| :--- | :--- | :--- | :--- |
| **App Icon** | `icon.png` | 1024x1024 | Primary application icon |
| **Adaptive Icon** | `adaptive-icon.png` | 1024x1024 | Android foreground adaptive icon |
| **Favicon** | `favicon.png` | 48x48 | Web browser icon |
| **Splash Icon** | `splash-icon.png` | 226x226 | Centered launch screen logo |

## 📂 Project Architecture

```text
app/                # Expo Router: Screens, Layouts & Navigation
src/
├── components/     # Atomic UI components and feature-specific modules
├── hooks/          # Reusable business logic & state hooks
├── services/       # External integrations (Notifications, Haptics)
├── stores/         # Global state management (Zustand)
├── types/          # Centralized TypeScript interfaces
└── utils/          # Pure helper functions & Theme constants
```
