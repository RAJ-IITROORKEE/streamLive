from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import cv2
import os
import time
from typing import Optional

app = FastAPI(title="Photo Click Backend")

# Enable CORS for frontend dev server and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:3001",
        "https://*.vercel.app",  # Allow all Vercel deployments
        "https://streamlive.vercel.app",  # Your production URL (update this)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Save images to Next.js public/images folder so they're accessible in the frontend
IMAGES_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'livestream', 'public', 'images')
IMAGES_DIR = os.path.abspath(IMAGES_DIR)
os.makedirs(IMAGES_DIR, exist_ok=True)

# Serve images statically at /images (for API access)
app.mount("/images", StaticFiles(directory=IMAGES_DIR), name="images")


class SnapshotRequest(BaseModel):
    camera_url: Optional[str] = None
    camera_index: Optional[int] = 0


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/network-info")
async def network_info():
    """
    Get local and public IP addresses
    """
    import socket
    import urllib.request
    
    # Get local IP
    local_ip = "unknown"
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
    except Exception:
        pass
    
    # Get public IP
    public_ip = "unknown"
    try:
        public_ip = urllib.request.urlopen('https://api.ipify.org', timeout=2).read().decode('utf8')
    except Exception:
        pass
    
    return {"local_ip": local_ip, "public_ip": public_ip}


@app.post("/snapshot")
async def snapshot(req: SnapshotRequest):
    """
    Take a single-frame snapshot from the specified camera (URL or index).
    Saves into the repository `images/` folder and returns filename + URL.
    """
    source = None
    if req.camera_url:
        source = req.camera_url
    else:
        source = int(req.camera_index or 0)

    cap = cv2.VideoCapture(source)
    if not cap.isOpened():
        # try again with int index if camera_url was numeric
        cap.release()
        raise HTTPException(status_code=400, detail="Could not open camera source")

    ret, frame = cap.read()
    cap.release()
    if not ret or frame is None:
        raise HTTPException(status_code=500, detail="Failed to read frame from camera")

    # optional resize for reasonable file sizes
    try:
        frame = cv2.resize(frame, (1280, 720))
    except Exception:
        pass

    timestamp = int(time.time())
    filename = f"snapshot_{timestamp}.jpg"
    out_path = os.path.join(IMAGES_DIR, filename)
    # cv2.imwrite returns bool
    ok = cv2.imwrite(out_path, frame)
    if not ok:
        raise HTTPException(status_code=500, detail="Failed to write image to disk")

    # Return relative URL that Next.js can serve from public/images
    return JSONResponse({"filename": filename, "url": f"/images/{filename}", "timestamp": timestamp, "success": True})


@app.get("/photos")
async def list_photos():
    files = [f for f in os.listdir(IMAGES_DIR) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    files.sort(reverse=True)
    results = []
    for f in files:
        results.append({"filename": f, "url": f"/images/{f}"})
    return results
