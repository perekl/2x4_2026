# Asset Guide — Operation: Moonlight Tee

All images load from `/public/assets/`. Drop a file at the path below and refresh — no code changes needed.

## ✅ Already provided (Bob & Perek)

| Path | Source |
|------|--------|
| `suspects/*` | Auto-cropped from `source/` sprite sheets — run `npm run crop-assets` |
| `posters/*` | Same sprite sheets |
| `courtroom/judge.png`, `attorney.png` | Aliased from suspect cutouts |
| `misc/wanted-poster.png` | Supplemental sprite sheet |

## ✅ Generated placeholders (replace anytime)

| Path | Used in |
|------|---------|
| `evidence/glow-ball.png` | Evidence Locker — Exhibit A |
| `evidence/night-vision.jpg` | Exhibit B |
| `evidence/flashlight.jpg` | Exhibit C |
| `evidence/tire-tracks.jpg` | Exhibit D |
| `evidence/scorecard.jpg` | Exhibit E |
| `crime-scene/aerial-map.jpg` | Crime Scene map background |
| `courtroom/background.jpg` | Courtroom section backdrop |
| `misc/goose.png` | Witness Statements — Goose |
| `props/glow-ball.png` | Mini game collectibles |
| `props/golf-tee.png` | Mini game |
| `props/ball-marker.png` | Mini game |

## How to upload your own images

### Option A — Replace individual files
1. Match the filename exactly (e.g. `evidence/night-vision.jpg`)
2. Put it in `public/assets/...`
3. Run `npm run build` before deploying to HostGator

### Option B — New Bob/Perek poses
1. Add combined sprite sheets to `public/assets/source/`
2. Run `npm run crop-assets`

### Option C — Drag into GitHub
Commit files directly to `public/assets/` on your branch.

## Recommended specs

| Type | Format | Size |
|------|--------|------|
| Evidence photos | JPG or PNG | 800–1200px wide |
| Aerial map | JPG | 1600×1000 or similar |
| Courtroom BG | JPG | 1920×1080 |
| Character cutouts | PNG with transparency | Any |
| Goose | PNG transparent | 400×400+ |

## What only you can provide

- **Real photos** of your actual golf course (great for aerial map)
- **Custom team branding** for the final reveal
- **Your faces** if you want the suspects to be unmistakably you (already done via sprite sheets)

Everything else can stay as generated stock-style placeholders or be swapped file-for-file.
