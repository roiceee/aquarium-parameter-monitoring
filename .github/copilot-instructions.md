# Aquarium Parameter Monitoring - AI Agent Instructions

## Project Overview

React + TypeScript + Vite application for real-time aquarium water quality monitoring. Uses simulated sensor data (pH, temperature, TDS) with configurable thresholds and visual alerts. Firebase is configured but not actively used for data persistence yet.

## Tech Stack

- **Frontend**: React 19 (with TypeScript), Vite for dev/build
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite`), shadcn/ui components (New York style)
- **Icons**: lucide-react
- **Backend**: Firebase (configured but minimal usage currently)
- **Package Manager**: pnpm

## Architecture & Data Flow

### Component Hierarchy

```
App.tsx (state management)
├── SensorCard (display + progress bars)
├── StatusAlert (alert UI)
└── ThresholdSettings (modal-style settings)
```

### State Management Pattern

- **Local state only** (useState) - no context or external state management
- `App.tsx` holds all application state: `sensorData`, `thresholds`, `showSettings`
- Sensor data fetched from Firebase Realtime Database via `onValue` listener
- Status alerts computed on-demand via `getStatus()` utility (imported from `src/lib/alertUtils.ts`)

### Firebase Realtime Database Integration

- Database references: `sensors/` and `thresholds/` paths
- Expected data structure:
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
- Real-time subscriptions in `App.tsx` via two separate `onValue` listeners
- Sensor data updates automatically when database values change
- Threshold updates are persisted to RTDB via `set()` function when saved in settings
- Database instance exported from `src/lib/firebase.ts` as `database`

### Type System (`src/types/index.ts`)

All sensor-related types centralized here:

- `SensorData`: current readings (ph, temperature, tds)
- `Thresholds`: min/max bounds for each parameter
- `AlertStatus`: alert type and message for status display

### Component Patterns

**SensorCard Design**:

- Props include both data AND presentation concerns (color, icon, decimals)
- Progress bar calculated as percentage: `((value - min) / (max - min)) * 100`
- Conditional red text when `value < min || value > max`
- Color system uses object lookup: `colorClasses[color]` for cyan/blue/indigo variants

**Alert Logic** (`src/lib/alertUtils.ts`):

- Pure function `getStatus(sensorData, thresholds)` generates `AlertStatus[]`
- pH & temperature violations → "warning", TDS violations → "info" (low) or "warning" (high)
- Default "success" alert when no issues detected

## Development Workflows

**Essential Commands**:

```bash
pnpm dev          # Start dev server (Vite HMR)
pnpm build        # TypeScript check + production build
pnpm lint         # ESLint check
pnpm preview      # Preview production build
```

**File Extensions**: Always use `.tsx` for components (even if no JSX) and `.ts` for utilities/types. Import paths explicitly include extensions (e.g., `"./types/index.ts"`).

## Styling & UI Conventions

**Tailwind v4 Approach**:

- Uses `@tailwindcss/vite` plugin (not PostCSS config)
- No `tailwind.config.js` - configuration in `components.json` for shadcn/ui
- Path alias `@/` points to `src/` (configured in `vite.config.ts`)

**shadcn/ui Integration** (`components.json`):

- Style: "new-york"
- CSS variables enabled, base color: "neutral"
- UI components in `src/components/ui/` (button, card)
- Add components via: `npx shadcn@latest add <component>`

**Design System**:

- Color scheme: cyan (pH), blue (temperature), indigo (TDS)
- Spacing: Consistent use of `px-6`, `py-6`, `gap-3` for layout
- Typography: `text-sm` for labels, `text-2xl` for primary values
- All cards use: `bg-white border rounded-lg shadow-sm hover:shadow-md`

## Firebase Integration

- Initialized in `src/lib/firebase.ts` with project config
- **Realtime Database actively used** for sensor data
- Database path structure: `sensors/{phLevel, temp, tdsLevel}`
- Real-time listener automatically updates UI when data changes
- Export pattern: `export const database = getDatabase(app)`
- Utilities in `src/lib/alertUtils.ts` for status computation logic

## Adding New Features

**New Sensor Type**:

1. Update `SensorData` and `Thresholds` in `src/types/index.ts`
2. Add to `App.tsx` state initialization
3. Update Firebase database structure (add new field under `sensors/`)
4. Extend `getStatus()` logic in `src/lib/alertUtils.ts`
5. Add `SensorCard` instance with appropriate icon/color/units
6. Update Firebase RTDB listener in `App.tsx` useEffect to map new field

**New Component**:

- Place in `src/components/` (or `ui/` subfolder if reusable primitive)
- Import types from `src/types/index.ts`
- Use lucide-react for icons (e.g., `import { Icon } from "lucide-react"`)
- Follow naming: PascalCase files matching component name

## Critical Patterns to Preserve

1. **Firebase RTDB field mapping**: Database uses `phLevel`, `temp`, `tdsLevel` - mapped to `ph`, `temperature`, `tds` in state
2. **Settings toggle pattern**: `showSettings` boolean controls conditional render between sensors/settings view
3. **Type imports**: Use `import type { ... }` for type-only imports
4. **Decimal precision**: Pass `decimals` prop to format display (pH=2, temp=1, TDS=0)
5. **Alert computation**: Always derive alerts from current state via `getStatus()` utility, don't cache them
6. **Utility separation**: Status/alert logic lives in `src/lib/alertUtils.ts`, not in components

## Known Limitations

- Thresholds are now synced with Firebase - changes persist across sessions
- Settings changes are saved to Firebase Realtime Database when "Save" is clicked
- Requires Firebase RTDB to be populated with both sensor data and thresholds externally
