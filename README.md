# 🫧 Neumorphic Habit Tracker

A modern, tactile, and minimalist habit-tracking application built with a **Neumorphic (Soft UI)** design system in React, TypeScript, Tailwind CSS, and Capacitor for Android. 

Designed for deliberate daily routine building, habit consistency, and in-depth monthly visual analytics — with **zero mock data** out of the box, giving you a fresh, clean slate from day one.

---

## ✨ Features

- **Tactile Neumorphic (Soft UI) Interface**:
  - Realistic extruded and debossed soft shadows that give depth and tactile satisfaction to buttons, cards, and toggles.
  - Seamless **Dark & Light Mode** toggle tailored with custom neumorphic lighting geometry.
- **Pure Clean Slate (Zero Pre-existing Mock Habits)**:
  - Starts 100% empty. No dummy habits or fake completions. You have full ownership of your tracking journey.
- **Daily Tracker & Momentum**:
  - Interactive 7-day pill carousel for quick day navigation.
  - Real-time completion momentum progress bar with joyful celebration confetti when you hit 100%.
  - Tactile debossed completion switches with streak badge indicators (`🔥 Streak`).
  - Daily personal reflection & gratitude notes stored per day.
- **Comprehensive Monthly Report & Visual Analytics**:
  - Month and year navigation to review historical consistency.
  - Overview KPI metrics: Completion Rate (%), Total Check-ins, Active Streak, and Perfect 100% Days.
  - **GitHub-style Monthly Heatmap Grid**: 7-day weekday columns with color-intensity tiles mapping your consistency.
  - Interactive Day Inspector drawer to inspect any specific date's completions.
  - Individual habit performance breakdowns with monthly progress bars.
  - **Export to Markdown**: Copy formatted markdown monthly review or download directly.
  - **Print & PDF Export**: Printer-friendly CSS rules optimized for monthly summaries.
- **Customizable Habits**:
  - 8 curated aesthetic color accents.
  - Categories: Health, Productivity, Mindfulness, Fitness, Learning, Finance, Creativity, Other.
  - Frequency scheduling: Every Day, Weekdays Only, Weekends Only, or Custom Days of the Week.
  - Flexible targets: Count and unit of measurement (e.g. 8 glasses, 30 mins, 10 pages).
- **Data Privacy & Backup**:
  - 100% offline, local persistence in your browser/device storage.
  - One-click JSON backup export and import.
- **Android APK Ready**:
  - Packaged with Capacitor for Android.
  - GitHub Actions automated CI workflow building release and debug APKs.

---

## 📱 Android APK Installation

You can install the app directly on your Android device:

1. Download the `HabitTracker.apk` file from the [Releases section](https://github.com/amotixayush-dev/Habit-tracker/releases) or the root of this repository.
2. Transfer or download the APK to your Android device.
3. Open the downloaded `.apk` file and tap **Install** (allow installation from unknown sources if prompted in Android Settings).
4. Launch **Habit Tracker** and start building your routines!

---

## 🚀 Quick Start (Web Development)

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### Running Locally

```bash
# Clone the repository
git clone https://github.com/amotixayush-dev/Habit-tracker.git
cd Habit-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Building for Production

```bash
# Build production bundle
npm run build
```

---

## 🤖 Building Android APK with Capacitor

```bash
# Build web assets and sync to Android project
npm run build
npx cap sync android

# Build Debug APK
cd android
./gradlew assembleDebug
```

The APK will be generated at:
`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Neumorphic CSS Tokens
- **Icons**: Lucide React
- **Mobile Container**: Capacitor 6 (Android)
- **Delight & Animations**: Canvas Confetti

---

## 🛡️ Verification & Security

Equipped with automated quality protocols and Antigravity workspace skills:
- **Conventional Commits**: Validated with Commitlint
- **VibeBreaker Protocol**: Multi-pass adversarial audit for resilience and security

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
