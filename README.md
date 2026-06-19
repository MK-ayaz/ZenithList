# 🚀 ZenithList
**Reach your peak productivity.**

ZenithList is a high-performance, local-first Todo application built for the modern mobile ecosystem. It prioritizes privacy, speed, and a minimalist user experience.

## ✨ Features
- **Local-First Architecture**: All data is stored on-device using SQLite for maximum privacy and offline availability.
- **Smart Views**:
  - `Today`: Focus on immediate tasks.
  - `Upcoming`: Plan for the future.
  - `Inbox`: Capture everything.
  - `Completed`: Review your wins.
- **Natural Language Input**: Quick task entry (e.g., "Buy milk tomorrow").
- **Premium UI/UX**:
  - Minimalist design with NativeWind v5.
  - Fluid animations powered by Reanimated 3.
  - High-performance lists using @shopify/flash-list.
- **Productivity Insights**: Visual dashboard to track completion rates and streaks.
- **Local Reminders**: Scheduled notifications for due tasks.

## 🛠 Tech Stack
- **Framework**: Expo SDK 56 (Managed Workflow)
- **Navigation**: Expo Router (File-based)
- **Styling**: NativeWind v5 (Tailwind CSS)
- **State Management**: Zustand
- **Database**: `expo-sqlite`
- **Animations**: React Native Reanimated
- **Icons**: Lucide React Native
- **Date Handling**: date-fns

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS)
- Expo Go app on your device or an Android/iOS emulator.

### Installation
1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
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

## 📦 Production Build & Deployment

### Build via EAS
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for Android
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production
```

## 🎨 Assets Guide
The following assets are required for a production-ready build. Place them in the `assets/` directory:

| Asset | File Name | Dimension | Description |
| :--- | :--- | :--- | :--- |
| **App Icon** | `icon.png` | 1024x1024 | Main home screen icon |
| **Adaptive Icon** | `adaptive-icon.png` | 1024x1024 | Android foreground image |
| **Splash Screen** | `splash.png` | 2048x2048 | Launch screen image |

## 📂 Project Structure
```
src/
├── app/            # Expo Router screens and layouts
├── components/     # UI and Feature components
│   ├── ui/         # Generic reusable components
│   └── todo/       # Todo-specific components
├── services/       # SQLite and Notification logic
├── store/          # Zustand state stores
├── types/          # TypeScript definitions
└── utils/          # NLP parsing and date helpers
```
