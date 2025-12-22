# Crime Forecast Visualization

Interactive web app for exploring spatial-temporal crime predictions, comparing model outputs, and inspecting accuracy metrics over time.

## Highlights
- Map-based grid visualization with model overlays (Actual, MLP, Baseline)
- Period selector to inspect predictions across time slices
- Model metrics panel with accuracy/PEI comparisons
- Research-focused landing and demo experience

## Tech Stack
- React 19 + TypeScript + Vite
- Tailwind CSS
- Leaflet + React-Leaflet
- GSAP / Framer Motion

## Getting Started

### Prerequisites
- Node.js 18+ (or a compatible LTS)
- A running API server at `http://localhost:8000`

### Install
```bash
npm install
```

### Run the app
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## API Expectations
The frontend expects these endpoints from the backend:
- `GET /api/health/`
- `GET /api/available-periods/`
- `GET /api/top-predictions/?period=...`
- `GET /api/metrics-by-period/?period=...`

Base URL is currently hardcoded in `src/api.ts`.

## Project Structure (key areas)
- `src/pages/Home.tsx`: landing and research narrative
- `src/pages/Demo.tsx`: grid visualization + controls
- `src/api.ts`: API client and data types

## Scripts
- `npm run dev`: start Vite dev server
- `npm run build`: typecheck + production build
- `npm run lint`: ESLint
- `npm run preview`: preview production build
