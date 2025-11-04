# Photo Click — Backend

This is a minimal FastAPI service used by the Photo Click project. It exposes simple endpoints for:

- GET /health — health check
- POST /snapshot — take a single-frame snapshot from a camera (by index or URL)
- GET /photos — list saved photos
- Static files served from /images

Run locally (recommended in a virtual environment):

```powershell
cd services/backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Notes:
- The snapshot endpoint uses OpenCV to open the camera source and save a JPEG into the repository `images/` folder. In production you should use object storage (S3) and put size/retention limits on stored photos.
