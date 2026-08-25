# Multiflow museum replica

Clickable Win2000-era desktop recreation of the GoFlow / PrepFlow / HeatFlow / WellFlow suite.

Physics is **not** ported — Print and Graph show canned results from `Demosum2.flw` (see `public/cases/demosum.json`).

## Run

```bash
cd web
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Demo path

1. Double-click **GoFlow** on the desktop.
2. Wait for the splash (~2.5s) → setup form.
3. Leave defaults (Oil, black oil, RKS, oil well) → **OK**.
4. Section geometry → **OK** (one section when length equals end distance).
5. Pipe dims → Elevation pairs → Oil flow → Sensitivity → Working…
6. Back on setup: **Print** / **Graph** / **Preview** are enabled.
7. Launch PrepFlow / HeatFlow / WellFlow from the desktop or **Programs**.

## Notes

- Classic Windows chrome is CSS-only (teal title bars, grey bevels).
- Chart buttons 1–6 show original `chart_example_N.jpg` screenshots.
- **Live: Dist v Pressure** plots the canned profile with Recharts.
