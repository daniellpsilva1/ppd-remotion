# Peak Performance Data — Remotion Marketing Video

30-second programmatic marketing video for **Peak Performance Data**, built with [Remotion](https://www.remotion.dev/).

## Composition

| Property | Value |
|----------|-------|
| ID | `PPDMarketing` |
| Duration | 45 seconds (1350 frames) |
| Resolution | 1920×1080 @ 30fps |

## Scenes

1. **Hook** — Logo + tagline typewriter
2. **Problem** — Fragmented tools → unified platform
3. **Wearables** — Garmin/Whoop/Polar sync + physiology dashboard
4. **Tennis** — Animated court heatmap + match stats
5. **Coach Intelligence** — Readiness matrix + AI assistant
6. **Roles** — Coach · Player · Parent · Club Admin
7. **CTA** — "Elevate your tennis." + demo request

## Commands

```bash
npm install
npm run dev          # Open Remotion Studio preview
npm run lint         # TypeScript + ESLint
npx remotion render PPDMarketing out/ppd-marketing.mp4
```

## Background music

Replace `public/music.mp3` with your royalty-free track (keep the filename). Audio fades in over 0.5s and out over the last 2 seconds. A silent 45s placeholder is included for rendering without a track.

## Brand assets

Brand tokens live in `src/brand.ts` (mirrored from `../AcademiesPresentation/content/brand.json`). Logos are in `public/`.

## Project structure

```
src/
├── PPDMarketing.tsx      # Main timeline + audio
├── brand.ts              # Colors, copy, scene durations
├── components/           # Reusable animated UI pieces
└── scenes/               # One file per storyboard scene
```
