# Aquarium Parameter Monitoring

A real-time aquarium water quality monitoring application built with React, TypeScript, and Firebase Realtime Database.

## Features

- 📊 Real-time monitoring of pH, temperature, and TDS levels
- 🔔 Automatic alerts when parameters exceed safe thresholds
- ⚙️ Configurable threshold settings with validation
- 🔄 Two-way Firebase sync for sensor data and settings
- 🎨 Modern UI with Tailwind CSS and shadcn/ui components

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, shadcn/ui (New York style)
- **Backend**: Firebase Realtime Database, Firebase Auth
- **Icons**: lucide-react
- **Package Manager**: pnpm

## Setup

### Prerequisites

- Node.js (v18 or higher)
- pnpm (`npm install -g pnpm`)
- Firebase account with Realtime Database

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd aquarium-parameter-monitoring
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Edit `.env` and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

5. Start the development server:

```bash
pnpm dev
```

## Firebase Database Structure

Your Firebase Realtime Database should have the following structure:

```json
{
  "sensors": {
    "phLevel": 7.2,
    "temp": 25.5,
    "tdsLevel": 320
  },
  "thresholds": {
    "ph": { "min": 6.5, "max": 8.0 },
    "temperature": { "min": 22, "max": 28 },
    "tds": { "min": 150, "max": 400 }
  }
}
```

## Available Scripts

```bash
pnpm dev          # Start dev server (Vite HMR)
pnpm build        # TypeScript check + production build
pnpm lint         # ESLint check
pnpm preview      # Preview production build
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── SensorCard.tsx   # Individual sensor display
│   ├── StatusAlert.tsx  # Alert notifications
│   └── ThresholdSettings.tsx  # Settings modal
├── lib/
│   ├── firebase.ts      # Firebase configuration
│   ├── alertUtils.ts    # Status computation logic
│   └── utils.ts         # Utility functions
├── types/
│   └── index.ts         # TypeScript type definitions
├── App.tsx              # Main app component
└── main.tsx             # App entry point
```

## Contributing

Feel free to submit issues and pull requests!

## License

MIT
