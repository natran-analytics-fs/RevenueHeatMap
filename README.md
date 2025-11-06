# Revenue Heatmap — Secure Auto-Publish Setup

This repo contains:
- `index.html`: client-only app (Leaflet) that uploads billing files & ZIP shapes and posts updates to a proxy.
- `.github/workflows/publish.yml`: GitHub Action that writes `data/*.json` upon `repository_dispatch`.
- `worker/`: Cloudflare Worker proxy (serverless) that securely triggers the GitHub Action with a server-side token.
- `.github/workflows/deploy-worker.yml`: (optional) Action that deploys your Worker from GitHub on every push.

## 1) Variables / Secrets you must set

### GitHub → Repository → Settings → Secrets and variables → Actions
- `PUBLISH_PAT` — Fine-grained PAT with **Repository → Contents: Read/Write** for this repo.
- `CLOUDFLARE_API_TOKEN` — API token with permission to deploy Workers.
- `CLOUDFLARE_ACCOUNT_ID` — Your Cloudflare account ID (Workers & Pages dashboard).
- `DISPATCH_PAT` — Fine-grained PAT with access to this repo (**Contents: Read** OK) used by the Worker to call `repository_dispatch`.

### Cloudflare Worker (Dashboard → Workers & Pages → your Worker → Settings → Variables
- **Vars** (non-secret):
  - `GH_OWNER` = `your-github-owner` (e.g., `natran-analytics-fs`)
  - `GH_REPO`  = `your-repo-name` (e.g., `RevenueHeatMap`)
  - `CORS_ORIGIN` = your Pages/site origin, e.g., `https://natran-analytics-fs.github.io`
- **Secret**:
  - `DISPATCH_PAT` = same token as above (or a token with repo-level access sufficient for `repository_dispatch`).

> Do **not** store tokens in the browser. The app only calls the Worker URL.

## 2) Deploy the Worker from GitHub (recommended)
1. Commit this repo to your default branch (`main` or `Main`).
2. Ensure the four GitHub Secrets above exist.
3. Push any change under `worker/` → GitHub Action **deploy-worker** will build & deploy the Worker.
4. Obtain the Worker URL from the Action logs or Cloudflare dashboard, e.g.:  
   `https://heatmap-publish-proxy.<subdomain>.workers.dev`

## 3) Hook the app to the Worker
- Open the deployed `index.html` (GitHub Pages or local).
- Click **Settings** (top right) → set **Proxy URL** to your Worker URL.
- Badge will show **Proxy: ON**.

## 4) Using the app
- **Upload** billing CSV/XLS/XLSX and ZIP shapefile (.zip) or GeoJSON.
- **Color ranges**: edit in the Menu; map & table recolor instantly.
- **Year filter**: fast buttons; style refresh only (no re-render).
- Every upload/save triggers a **POST to Worker** → `repository_dispatch` → `publish.yml` writes to `data/`.

## 5) GitHub Pages (optional)
- Repo → **Settings → Pages** → Branch: your default (`main`/`Main`), Folder: `/root`.
- Visit: `https://<owner>.github.io/<repo>/`.

## Troubleshooting
- 401 / Bad credentials: tokens must be **secrets** (Worker/Actions), not in the browser.
- No Action run: check Worker logs; confirm `repository_dispatch` fired; ensure `publish.yml` is on default branch.
- CORS errors: set Cloudflare Var `CORS_ORIGIN` to your exact site origin (or `*` for testing).

## Security model
- Browser holds **no tokens**.
- Worker uses **DISPATCH_PAT** (secret) server-side to trigger dispatch.
- GitHub Action uses **PUBLISH_PAT** (secret) to commit to `data/`.
