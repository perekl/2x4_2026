# Source sprite sheets (add your combined images here)

Place your combined sprite sheet PNGs in this folder:

| File | Description |
|------|-------------|
| `cutouts-sheet.png` | Photorealistic Bob & Perek cutouts on checkerboard background |
| `posters-sheet.png` | Movie poster style dramatic images |

Then run from the project root:

```bash
npm run crop-assets
```

The script auto-detects each character sprite, removes the checkerboard background,
and saves individually named files to `public/assets/` per `scripts/sprite-manifest.json`.

Primary site assets are aliased automatically:
- `suspects/bob-full.png` ← bob golf swing
- `suspects/perek-full.png` ← perek with golf bag
- `courtroom/judge.png` ← bob judge robes
- `courtroom/attorney.png` ← perek pointing attorney
