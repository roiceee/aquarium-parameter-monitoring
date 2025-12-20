# Aquarium Monitor - Lo-Fi Prototype

This is a **static, black and white lo-fi prototype** of the Aquarium Parameter Monitoring web application.

## Purpose

This prototype demonstrates the UI/UX structure without any backend functionality:

- ✅ All components are present
- ✅ View mode switching works (Dashboard, Settings, Analytics)
- ✅ Black and white design
- ✅ Static placeholder data
- ❌ No Firebase integration
- ❌ No real-time data
- ❌ No PWA features
- ❌ No data persistence

## Running the Prototype

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Run development server:

   ```bash
   pnpm dev
   ```

3. Open browser to displayed URL (usually `http://localhost:5173`)

## Features

### Dashboard View

- 3 sensor cards (pH, Temperature, TDS) with static values
- Progress bars showing sensor readings
- Status alerts
- Black and white styling with borders

### Settings View

- Threshold configuration for all sensors
- Input validation
- Local state management (changes not persisted)

### Analytics View

- Statistics cards with placeholder data
- Chart placeholders (no Recharts library)
- Data table with sample rows
- Export buttons (non-functional)

## Design Notes

- Monospace font (Courier New) for lo-fi aesthetic
- All borders are solid black (2px)
- Gray scale colors only
- Minimal transitions (0.1s)
- No shadows or gradients
- Box-style layout

## Differences from Production App

This prototype **does not include**:

- Firebase Realtime Database integration
- Firestore historical logs
- Firebase Cloud Messaging (notifications)
- PWA service worker
- Real-time data updates
- Recharts data visualization
- Export to CSV/XLSX functionality
- Any backend logic

## File Structure

```
lofi-prototype/
├── src/
│   ├── components/
│   │   ├── ui/          # Black/white button, card, input
│   │   ├── SensorCard.tsx
│   │   ├── StatusAlert.tsx
│   │   ├── ThresholdSettings.tsx
│   │   └── Analytics.tsx
│   ├── lib/
│   │   ├── utils.ts
│   │   └── alertUtils.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx          # Main component with view switching
│   ├── main.tsx
│   └── index.css        # Black/white theme
├── public/
├── package.json
├── vite.config.ts
└── README.md
```

## Technologies Used

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- lucide-react (icons)
- shadcn/ui (base components)

---

**This is a design prototype only. For the full-featured application, see the `web-app/` directory.**
