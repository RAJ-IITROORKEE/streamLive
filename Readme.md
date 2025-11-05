# StreamLive — consolidated README

This repository contains the StreamLive (Photo Click) web application: a Next.js frontend (in `livestream/`) and a FastAPI backend (in `services/backend/`).

This single README replaces the multiple project markdown files. Sensitive values (API keys, DB URIs, secrets) are intentionally excluded — see the "Environment variables" section below for placeholders and instructions.

## What this repository contains

- `livestream/` — Frontend (Next.js)
- `services/backend/` — Backend (FastAPI)
- scripts and deployment helpers (e.g., `deploy-vercel.ps1`)

## High-level features

- Multi-camera support (webcam and IP cameras)
- Snapshot capture with upload to Cloudinary (or other cloud storage)
- MongoDB for camera and photo metadata
- Simple FastAPI backend providing snapshot and photo endpoints
- Ready for deployment to Vercel (frontend) and Railway/Render (backend)

## Quickstart — development (safe, no secrets)

1. Start the backend (PowerShell):

```powershell
cd services/backend
python -m venv .venv
\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

2. Start the frontend (new terminal):

```powershell
cd livestream
npm install
npm run dev
```

3. Open `http://localhost:3000` in your browser. For local testing, set `NEXT_PUBLIC_API_URL` to `http://localhost:8000` (see Environment variables below).

## Environment variables (placeholders only — DO NOT put secrets here in the README)

Set these in your local `.env.local` (frontend) and in your hosting provider's environment settings for production.

- `MONGODB_URI` — MongoDB connection string. Example placeholder:
	- `MONGODB_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/<DBNAME>?retryWrites=true&w=majority`
- `CLOUDINARY_CLOUD_NAME` — Your Cloudinary cloud name (non-secret)
- `CLOUDINARY_API_KEY` — Cloudinary API key (sensitive) — keep secret
- `CLOUDINARY_API_SECRET` — Cloudinary API secret (sensitive) — keep secret
- `NEXT_PUBLIC_API_URL` — Public URL of the backend used by the frontend (e.g., `https://api.example.com`)

Important: do NOT paste actual secrets or full connection strings into repository files or README. Use environment variables or your host's secret manager.

## Deployments (summary)

- Backend: recommended hosts — Railway, Render, or any container host. Ensure CORs allows your frontend origin.
- Frontend: recommended host — Vercel (set the root directory to `livestream` when importing repo).

Key steps (summary):
1. Deploy backend, get backend URL (e.g., `https://your-backend.example`)
2. Add `NEXT_PUBLIC_API_URL` pointing to the backend in Vercel environment variables
3. Add `MONGODB_URI` and Cloudinary credentials in the backend environment
4. Update backend CORS origins to include your Vercel domain

For full step-by-step instructions, see the original docs (they have been consolidated into this README); if you need a copy of a specific guide before deletion, I can restore it to an `archive/` folder.

## Security & best practices

- Never commit real API keys, secrets, or full DB URIs to this repository.
- Use the hosting provider's environment variable manager (Vercel/ Railway/Render) for secrets.
- For camera exposure: prefer client-side capture or secure tunneling (Tailscale/ngrok) over directly exposing camera ports to the internet.
- Rotate keys if you ever accidentally exposed them.

## Project structure (short)

```
Photo-click-Main/
├─ livestream/         # Next.js frontend (app dir)
├─ services/backend/   # FastAPI backend
├─ deploy-vercel.ps1
└─ README.md           # -> this file (consolidated)
```

## Where to find endpoints (developer reference)

- Frontend: `livestream/` — run `npm run dev` there
- Backend: `services/backend/` — serves endpoints (e.g., `/health`, `/photos`, `/snapshot`)

## If you want the original guides

I have consolidated the content into this single README. If you prefer the separated guide files (Camera guide, Deployment, MongoDB/Cloudinary setup, Quickstart, etc.) I can:

- a) restore them into an `archive/docs/` folder (recommended), or
- b) keep them deleted and maintain only this consolidated README.

Tell me which you prefer and I'll proceed. For now, the repo will move to only this README unless you ask to keep an archive.

---

_Verified: sensitive values were removed/redacted during consolidation._

## License

MIT — see LICENSE
