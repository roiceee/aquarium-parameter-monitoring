# Web App vs Lo-Fi Prototype Comparison

This document compares the production web app with the lo-fi prototype.

## Quick Overview

| Aspect           | Production (`web-app/`)  | Lo-Fi Prototype (`lofi-prototype/`) |
| ---------------- | ------------------------ | ----------------------------------- |
| **Purpose**      | Full-featured monitoring | Static UI prototype                 |
| **Data**         | Real-time from Firebase  | Static placeholders                 |
| **Styling**      | Colored, modern          | Black & white, lo-fi                |
| **Backend**      | Firebase integration     | None                                |
| **Dependencies** | ~400+ packages           | ~200 packages                       |
| **Run Command**  | `cd web-app && pnpm dev` | `cd lofi-prototype && pnpm dev`     |

## Directory Structure Comparison

```
web-app/                          lofi-prototype/
├── src/                          ├── src/
│   ├── components/               │   ├── components/
│   │   ├── Analytics.tsx         │   │   ├── Analytics.tsx        [Simplified]
│   │   ├── ReloadPrompt.tsx      │   │   ├── SensorCard.tsx       [B&W version]
│   │   ├── SensorCard.tsx        │   │   ├── StatusAlert.tsx      [B&W version]
│   │   ├── StatusAlert.tsx       │   │   ├── ThresholdSettings.tsx[B&W version]
│   │   ├── ThresholdSettings.tsx │   │   └── ui/                  [B&W components]
│   │   └── ui/                   │   ├── lib/
│   ├── lib/                      │   │   ├── alertUtils.ts        [Copied]
│   │   ├── alertUtils.ts         │   │   └── utils.ts             [Copied]
│   │   ├── exportUtils.ts        │   └── types/
│   │   ├── firebase.ts           │       └── index.ts             [Copied]
│   │   ├── firestoreUtils.ts     └── public/                      [Minimal]
│   │   ├── notificationDebug.ts
│   │   └── utils.ts
│   └── types/
└── public/                       [PWA assets]
```

## Feature Comparison

### ✅ Included in Both

- Dashboard view with sensor cards
- Settings view with threshold configuration
- Analytics view
- View mode switching
- Status alerts
- TypeScript
- Tailwind CSS v4
- Vite build system
- ESLint configuration

### ✅ Only in Production (`web-app/`)

- **Firebase Integration**
  - Realtime Database for live sensor data
  - Firestore for historical logs
  - Firebase Authentication (anonymous)
  - Firebase Cloud Messaging (FCM)
- **PWA Features**

  - Service worker
  - Offline support
  - Install prompt
  - Update notifications (`ReloadPrompt`)
  - App manifest
  - Multiple icon sizes

- **Data Visualization**

  - Recharts line charts
  - Real-time data updates
  - Historical data queries
  - Export to CSV/XLSX (working)

- **Advanced Features**
  - Push notifications
  - Foreground message handling
  - FCM token management
  - Notification cooldowns
  - Beep control stored in Firebase

### ✅ Only in Prototype (`lofi-prototype/`)

- **Lo-Fi Aesthetic**

  - Black & white color scheme
  - Courier New monospace font
  - Bold borders (2px)
  - Minimal transitions (0.1s)
  - Flat design (no shadows)

- **Simplifications**
  - Static data (no backend)
  - Chart placeholders instead of Recharts
  - Local-only threshold changes
  - No service worker
  - Minimal dependencies

## Styling Comparison

### Production App Colors

```css
/* Cyan for pH */
.ph-sensor {
  background: #0891b2; /* cyan-600 */
  icon-bg: #ecfeff;    /* cyan-50 */
}

/* Blue for Temperature */
.temp-sensor {
  background: #2563eb; /* blue-600 */
  icon-bg: #eff6ff;    /* blue-50 */
}

/* Indigo for TDS */
.tds-sensor {
  background: #4f46e5; /* indigo-600 */
  icon-bg: #eef2ff;    /* indigo-50 */
}

/* Status Colors */
.success: #10b981 (emerald)
.warning: #f59e0b (amber)
.info: #3b82f6 (blue)
```

### Lo-Fi Prototype Colors

```css
/* Everything */
.all-elements {
  foreground: #000000; /* Pure black */
  background: #ffffff; /* Pure white */
  borders: #000000; /* Black borders */
  gray-bg: #f5f5f5; /* Light gray */
  gray-text: #737373; /* Medium gray */
}
```

## Component Comparison

### SensorCard

**Production:**

- Colored background based on sensor type
- Colored progress bar (cyan/blue/indigo)
- Hover effects with shadow transitions
- Red text for out-of-range values

**Lo-Fi:**

- White background, black border
- Black progress bar on gray background
- Bold text for out-of-range values
- No color coding

### Analytics

**Production:**

- Real Recharts line charts with live data
- Interactive tooltips and legends
- Scrollable data table with actual logs
- Working CSV/XLSX export

**Lo-Fi:**

- Placeholder boxes with dashed borders
- Static statistics cards
- Sample data table (3 hardcoded rows)
- Non-functional export buttons

### ThresholdSettings

**Production:**

- Saves to Firebase Realtime Database
- Real-time sync across devices
- Colored input borders on focus

**Lo-Fi:**

- Saves to local state only
- No persistence
- Black borders on all inputs

## Running Both Apps

### Production App

```bash
cd web-app
pnpm install
pnpm dev
# Requires .env with Firebase config
# Opens at http://localhost:5173
```

### Lo-Fi Prototype

```bash
cd lofi-prototype
pnpm install
pnpm dev
# No .env needed
# Opens at http://localhost:5173
```

## Use Cases

### Use Production App When:

- Testing real sensor integration
- Demonstrating live monitoring
- Validating Firebase setup
- Testing notifications
- Deploying to production
- Showing full feature set

### Use Lo-Fi Prototype When:

- Conducting design reviews
- User testing without data
- Quick stakeholder demos
- Teaching UI/UX concepts
- Prototyping new layouts
- No backend access available

## Package Size Comparison

### Production (`web-app/`)

```json
{
  "dependencies": 16,
  "devDependencies": 11,
  "node_modules": ~400 packages,
  "size": ~150 MB
}
```

**Key packages:**

- firebase: ~10 MB
- recharts: ~5 MB
- workbox-window: ~500 KB
- vite-plugin-pwa: Dev only

### Lo-Fi (`lofi-prototype/`)

```json
{
  "dependencies": 9,
  "devDependencies": 11,
  "node_modules": ~200 packages,
  "size": ~80 MB
}
```

**Excluded:**

- No firebase (saves ~10 MB)
- No recharts (saves ~5 MB)
- No workbox/PWA (saves ~2 MB)
- No export utilities

## Migration Path

To convert lo-fi to production:

1. **Install Firebase**

   ```bash
   pnpm add firebase
   ```

2. **Add lib/firebase.ts**

   - Copy from production app
   - Configure with .env variables

3. **Install PWA plugins**

   ```bash
   pnpm add -D vite-plugin-pwa @vite-pwa/assets-generator
   pnpm add workbox-window
   ```

4. **Install Recharts**

   ```bash
   pnpm add recharts
   ```

5. **Update Components**

   - Replace static data with Firebase calls
   - Swap chart placeholders with Recharts
   - Add export utilities
   - Update color scheme

6. **Add Service Worker**
   - Configure vite-plugin-pwa
   - Add ReloadPrompt component
   - Create firebase-messaging-sw.js

## Performance Comparison

| Metric       | Production | Lo-Fi   |
| ------------ | ---------- | ------- |
| Cold start   | ~500ms     | ~300ms  |
| Hot reload   | ~100ms     | ~100ms  |
| Build time   | ~5s        | ~3s     |
| Bundle size  | ~800 KB    | ~400 KB |
| Initial load | ~2s        | ~1s     |

Lo-fi is faster due to fewer dependencies and no Firebase initialization.

## Recommended Workflow

1. **Start with Lo-Fi** for rapid UI iteration
2. **Gather feedback** on layout and flow
3. **Finalize design** in lo-fi version
4. **Migrate to production** step-by-step
5. **Test with real data** in production app
6. **Deploy** production version

---

**Both apps are fully functional within their intended scope.**

- Production: Full-featured monitoring with Firebase
- Lo-Fi: Static prototype for design validation

Choose based on your current needs!
