# Aquarium Parameter Monitoring - AI Agent Instructions

## Project Overview

**Monorepo structure** with two independent codebases:

- `web-app/`: React PWA for real-time aquarium water quality monitoring with analytics
- `functions/`: Firebase Cloud Functions for automated notifications, scheduled logging, and backend logic

Real-time sensor monitoring (pH, temperature, TDS) with configurable thresholds, visual alerts, push notifications, and historical data analytics. Data flows: RTDB for real-time values → Firestore for historical logs → Recharts for visualization.

## Tech Stack

- **Frontend**: React 19 (TypeScript), Vite, PWA (vite-plugin-pwa), Recharts
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite`), shadcn/ui (New York style)
- **Icons**: lucide-react
- **Backend**: Firebase Realtime Database (real-time data), Firestore (historical logs), Firebase Auth (anonymous), Firebase Cloud Messaging (FCM)
- **Functions**: Firebase Cloud Functions v2 (Node 24, TypeScript) - 4 functions deployed
- **Package Manager**: pnpm (web-app), npm (functions)

## Monorepo Structure

```
/                              # Root - Firebase project config
├── web-app/                   # React PWA (primary development directory)
│   ├── src/                   # All frontend code
│   ├── public/                # PWA assets + service worker
│   ├── components.json        # shadcn/ui configuration
│   └── package.json           # pnpm workspace
└── functions/                 # Firebase Cloud Functions
    ├── src/index.ts           # Function definitions
    ├── lib/                   # Compiled JS output
    └── package.json           # npm workspace (separate from web-app)
```

**Critical**: Use `pnpm` for web-app commands, `npm` for functions. Navigate to correct directory before running commands.

## Architecture & Data Flow

### Dual-Database Architecture (CRITICAL)

**Two Firebase databases serve different purposes**:

1. **Realtime Database (RTDB)**: Live sensor values, thresholds, notification timestamps

   - Web app subscribes via `onValue()` listeners
   - Updated by external sensor hardware (not in this repo)
   - Functions read thresholds here for validation logic

2. **Firestore**: Historical sensor logs for analytics
   - Written by `scheduledDataLogger` Cloud Function every minute
   - Read by `Analytics.tsx` component via `fetchSensorLogs()`
   - Enables time-series visualization with Recharts

**Data Flow Diagram**:

```
Sensor Hardware → RTDB /sensors → Web App (real-time display)
                     ↓
            checkSensorThresholds (Function)
                     ↓
            FCM Topic "alerts" → Push Notifications
                     ↓
RTDB /sensors → scheduledDataLogger (every minute) → Firestore /sensorLogs
                                                            ↓
                                            Analytics Component (Recharts)
```

### Web App Component Hierarchy

```
App.tsx (state + 3 view modes + Firebase listeners)
├── Dashboard View
│   ├── SensorCard (×3: pH, temp, TDS with progress bars)
│   └── StatusAlert (computed via getStatus() utility)
├── Settings View
│   └── ThresholdSettings (inline editing, saves to RTDB)
├── Analytics View
│   └── Analytics (Recharts line charts + data management)
└── ReloadPrompt (PWA update notifications)
```

### State Management Pattern

- **Local state only** (useState) - no context/Redux
- `App.tsx` holds: `sensorData`, `thresholds`, `viewMode` ("dashboard" | "settings" | "analytics")
- **Three Firebase listeners in separate useEffect hooks**:
  1. `sensors/` path → updates `sensorData` state
  2. `thresholds/` path → updates `thresholds` state
  3. Anonymous auth on mount → required for RTDB/Firestore access
- **View mode toggle pattern**: Single state variable controls which component tree renders
- Status alerts computed on-demand via `getStatus()` utility (never cached)

### Firebase Integration Architecture

**Realtime Database Structure**:

```json
{
  "sensors": {
    "ph": 7.2,
    "temperature": 25.5,
    "tds": 320
  },
  "thresholds": {
    "ph": { "min": 6.5, "max": 8.0 },
    "temperature": { "min": 22, "max": 28 },
    "tds": { "min": 150, "max": 400 }
  },
  "notificationTimestamps": {
    "ph-high": 1734394800000,
    "temperature-low": 1734391200000
  }
}
```

**Firestore Structure**:

```
/sensorLogs (collection)
  /{auto-id} (document)
    - ph: number
    - temperature: number
    - tds: number
    - timestamp: Timestamp (server-generated)

/fcmTokens (collection)
  /{tokenId} (document - token used as ID)
    - token: string (FCM registration token)
    - createdAt: Timestamp
    - lastUpdated: Timestamp
    - active: boolean
    - lastError?: string (if token failed)
    - lastErrorAt?: Timestamp
```

**Firebase Services** (`web-app/src/lib/firebase.ts`):

- Exports: `database` (RTDB), `firestore`, `auth`, `messaging`, `getTokenFunction()`
- Environment variables: All prefixed with `VITE_` (Vite requirement)
- Auth: Anonymous sign-in on app mount (required for RTDB/Firestore read/write)
- FCM: Token stored in Firestore via `storeFCMToken()` function
- **Foreground message handler**: `onMessage()` displays notifications when app is open

**3 Cloud Functions** (`functions/src/index.ts`):

1. **`sendNotification`** (HTTP): Manual trigger for testing (legacy, rarely used)
2. **`checkSensorThresholds`** (RTDB trigger): Watches `/sensors`, sends FCM on violations
   - Retrieves active tokens from Firestore `/fcmTokens` collection
   - Sends individual `TokenMessage` to each device (not topic-based)
   - Automatically marks invalid tokens as inactive
   - Uses notification cooldown: 10 seconds (configurable in `constants.ts`)
   - Stores timestamps in `/notificationTimestamps/{sensor}-{level}`
3. **`scheduledDataLogger`** (cron: every minute): Copies RTDB sensors → Firestore logs
   - Region: asia-southeast1, Timezone: Asia/Singapore
   - Enables historical analytics without RTDB query limits

### PWA Configuration

- **vite-plugin-pwa** with Workbox for offline support
- Service worker registers on app load via `ReloadPrompt` component
- Register type: `"prompt"` - user must explicitly reload for updates
- Manifest: `Aquarium Monitor` / `Aquamonitor` with 4 icon sizes (64, 192, 512, maskable)
- Dev mode PWA enabled: `devOptions.enabled: true` for testing
- Auto-injects registration script: `injectRegister: "auto"`

**Service Worker Pattern**:

```tsx
// ReloadPrompt.tsx uses virtual:pwa-register/react
const { needRefresh, updateServiceWorker } = useRegisterSW({...})
// Shows toast when update available, user clicks "Reload" to apply
```

### Type System (`src/types/index.ts`)

All sensor-related types centralized here:

- `SensorData`: current readings (ph, temperature, tds) - all required fields
- `Thresholds`: min/max bounds for each parameter - all required fields
- `AlertStatus`: alert type ("success" | "warning" | "info") and message for status display
- `SensorLog`: historical data with `id`, sensor values, and `timestamp: Date`

**Functions types** (`functions/src/types.ts`): Similar but with optional fields to handle partial RTDB data

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
# Web App (from web-app/ directory, uses pnpm)
pnpm dev          # Start dev server (Vite HMR + PWA dev mode)
pnpm build        # TypeScript check + production build
pnpm lint         # ESLint check
pnpm preview      # Preview production build

# Firebase Functions (from functions/ directory, uses npm)
npm run build     # Compile TypeScript to lib/
npm run serve     # Local emulator testing
npm run deploy    # Deploy to Firebase (after build)
npm run logs      # View function logs
```

**Multi-package workflow**:

1. Root `firebase.json` defines predeploy hooks: lint + build before deploy
2. Web app and functions are **independent** - no shared dependencies
3. Always `cd` to correct directory before running commands

**File Extensions**: Always use `.tsx` for components (even if no JSX) and `.ts` for utilities/types. Import paths explicitly include extensions (e.g., `"./types/index.ts"`).

## Styling & UI Conventions

**Tailwind v4 Approach**:

- Uses `@tailwindcss/vite` plugin (not PostCSS config)
- No `tailwind.config.js` - configuration in `components.json` for shadcn/ui
- Path alias `@/` points to `src/` (configured in `vite.config.ts`)

**shadcn/ui Integration** (`components.json`):

- Style: "new-york"
- CSS variables enabled, base color: "neutral"
- UI components in `src/components/ui/` (button, card, input)
- Add components via: `npx shadcn@latest add <component>`

**Design System**:

- Color scheme: cyan (pH), blue (temperature), indigo (TDS)
- Spacing: Consistent use of `px-6`, `py-6`, `gap-3` for layout
- Typography: `text-sm` for labels, `text-2xl` for primary values
- All cards use: `bg-white border rounded-lg shadow-sm hover:shadow-md`

## Environment Configuration

**Web App** (`.env` in `web-app/` directory):

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=https://project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
VITE_VAPID_KEY=...  # For FCM web push
```

**Critical**: All Vite env vars MUST be prefixed with `VITE_` or they won't be accessible via `import.meta.env`.

**TypeScript env types**: Defined in `src/vite-env.d.ts` for proper autocomplete.

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

**New Cloud Function**:

1. Add function in `functions/src/index.ts` using `onRequest` or `onCall`
2. Run `npm run build` to compile TypeScript
3. Test locally: `npm run serve` (starts emulators)
4. Deploy: `npm run deploy` from `functions/` directory
5. Check logs: `npm run logs`

## Critical Patterns to Preserve

1. **Database field naming**: App.tsx currently reads `data.ph`, `data.temperature`, `data.tds` directly from RTDB - verify current schema before assuming legacy field names
2. **Settings toggle pattern**: `viewMode` state controls conditional render between dashboard/settings/analytics views
3. **Type imports**: Use `import type { ... }` for type-only imports
4. **Decimal precision**: Pass `decimals` prop to format display (pH=2, temp=1, TDS=0)
5. **Alert computation**: Always derive alerts from current state via `getStatus()` utility, don't cache them
6. **Utility separation**: Status/alert logic lives in `src/lib/alertUtils.ts`, not in components
7. **PWA reload pattern**: `ReloadPrompt` component with explicit user action (not auto-reload)
8. **Anonymous auth**: Must call `signInAnonymously(auth)` before RTDB operations
9. **Monorepo navigation**: Always `cd` to correct directory (`web-app/` or `functions/`) before commands
10. **Firestore queries**: Analytics fetches logs with `orderBy("timestamp", "desc")` then reverses for chronological charts

## Known Gotchas

- **Database field mapping mismatch**: Original docs said `phLevel`/`temp`/`tdsLevel` but code may use direct names - always check current `App.tsx` useEffect listeners
- **Package manager confusion**: `pnpm` for web-app, `npm` for functions - they are separate workspaces
- **Firebase service worker**: `public/firebase-messaging-sw.js` is empty - FCM background messages not yet implemented
- **FCM token storage**: Token fetched but not persisted to RTDB - handle in `App.tsx` if implementing server-side notifications
- **Threshold persistence**: Changes saved to Firebase immediately on "Save" click, no local-only mode
- **PWA caching**: Workbox caches all assets - may need hard refresh during development if seeing stale content

## Testing & Debugging

**Web App**:

- Run `pnpm dev` and open `http://localhost:5173` (or assigned port)
- Check console for FCM token, Firebase connection errors
- Use Firebase Console → Realtime Database to manually update sensor values
- PWA features testable in dev mode (service worker active)

**Firebase Functions**:

- Local: `npm run serve` starts emulators, access at `http://localhost:5001`
- Test notifications: `curl -X POST http://localhost:5001/.../sendNotification -H "Content-Type: application/json" -d '{"type":"ph","level":"high","currentValue":8.5,"thresholdValue":8.0}'`
- Production logs: `npm run logs` (requires Firebase CLI auth)

**Common issues**:

- "Permission denied" on RTDB → Ensure anonymous auth is enabled in Firebase Console
- FCM token null → Check VAPID key in `.env`, verify FCM enabled in project
- Build errors → Run `pnpm build` or `npm run build` to see TypeScript errors before deploy

---

**Last Updated**: Structure reflects actual implementation with PWA, FCM, and Firebase Functions integration. Verify database field names in `App.tsx` if encountering data sync issues.
