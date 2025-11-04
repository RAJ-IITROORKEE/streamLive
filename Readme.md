# StreamLive
Modern camera streaming and snapshot management platform built with Next.js and FastAPI.

## Features
- Multi-camera support with real-time streaming
- Snapshot capture with timer functionality
- Cloud storage integration (Cloudinary)
- MongoDB database for camera and photo management
- Modern responsive UI with dark theme
- Deploy to Vercel + Railway

## Quick Start

### Frontend (Next.js)
```bash
cd livestream
npm install
npm run dev
```

### Backend (FastAPI)
```bash
cd services/backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Documentation
- See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guides
- See [DEVELOPMENT.md](DEVELOPMENT.md) for local development setup
- See [MONGODB_MIGRATION.md](MONGODB_MIGRATION.md) for database migration details