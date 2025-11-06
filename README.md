# Houston Revenue by ZIP — Uploader Edition

This repo contains a **single-file web app** you can host on **GitHub Pages**. It does **not** include your large
source data files. Instead, users upload those files **in the browser**, the app processes them **client‑side**,
and you can optionally **publish only the small, processed artifacts** back to your repo.

## Why this avoids the 25MB limit
- Large source files (.zip shapefiles, .xls) are never committed to the repo.
- The app parses them with JS (shpjs + xlsx) and writes just:
  - `data/billing.json` (ZIP → revenue) — tiny
  - `data/houston_zctas.geojson` (simplified) — small
- A "Publish processed data" button commits those small files via the GitHub API.

## Deploy
1) Create a (public) repo and add:
   - `index.html` (this app)
   - A blank `data/` folder (optional; files will be created by publish)
2) In GitHub → **Settings → Pages** → Source: **Deploy from a branch**, Branch: **main**, Folder: **/**.
3) Open `https://<your-username>.github.io/<your-repo>/`.

## Use
- Open the site, go to **Data Upload / Status**, and upload:
  - Billing files (`.csv`, `.xls`, `.xlsx`)
  - ZIP shapes (Shapefile `.zip`) or **GeoJSON**
- The app stores processed results in your browser (IndexedDB).
- Click **Publish processed data** to write `/data/billing.json` and `/data/houston_zctas.geojson` to your repo
  (needs a Personal Access Token with **contents: write**).

Generated: 2025-11-06T15:32:43.883837
