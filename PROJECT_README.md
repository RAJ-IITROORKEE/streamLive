# Photo Click LAN — Live Camera Dashboard

A complete web application for live camera streaming, snapshot capture, and network device monitoring. Built with Next.js 15 (frontend) and FastAPI (backend).

## Features

✅ **Browser Webcam Access** — View your local webcam directly in the browser using WebRTC  
✅ **IP Camera Support** — Add and view MJPEG/HTTP video streams from IP cameras  
✅ **Snapshot Capture** — Take snapshots from any camera source and save them  
✅ **Network Info Display** — Shows your local IP and public IP addresses  
✅ **Photo Gallery** — View all saved snapshots with thumbnails  
✅ **Multi-Camera Support** — View multiple camera streams simultaneously  

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Python FastAPI, OpenCV, Uvicorn
- **Deployment Ready**: Vercel (frontend) + Render/Railway/Cloud Run (backend)

## Project Structure

```
Photo-click-Main/
├── livestream/              # Next.js frontend
│   ├── app/
│   │   └── page.tsx        # Main dashboard page
│   ├── public/
│   │   └── images/         # Saved snapshots (served by Next.js)
│   ├── package.json
│   └── next.config.js
│
├── services/
│   └── backend/            # FastAPI backend
│       ├── main.py         # API endpoints
│       ├── requirements.txt
│       ├── Dockerfile
│       └── README.md
│
├── images/                 # Legacy folder (now unused)
└── photo_click.py         # Original CLI script
```

## Quick Start (Local Development)

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### 1. Start the Backend (FastAPI)

```powershell
cd services/backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: http://localhost:8000

### 2. Start the Frontend (Next.js)

Open a new terminal:

```powershell
cd livestream
npm install
npm run dev
```

Frontend will be available at: http://localhost:3000

### 3. Access the Dashboard

Open your browser to http://localhost:3000

- Grant webcam permissions when prompted
- Add IP camera URLs if you have any (e.g., `http://192.168.1.100:8080/video`)
- Take snapshots from any camera source
- View saved photos in the gallery

## API Endpoints

### Backend (FastAPI) — Port 8000

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/network-info` | Get local and public IP addresses |
| POST | `/snapshot` | Take snapshot from camera (body: `{camera_url?, camera_index?}`) |
| GET | `/photos` | List all saved photos |
| GET | `/images/{filename}` | Serve saved image files |

## Features Explained

### 1. Network Information
The dashboard automatically displays:
- **Local IP**: Your device's IP on the local network
- **Public IP**: Your internet-facing IP address

This helps you identify what network you're connected to and helps with configuring IP cameras.

### 2. Browser Webcam
Uses `getUserMedia` API to access your local webcam directly in the browser. No backend processing needed.

### 3. IP Camera Streaming
Enter your IP camera's video stream URL (common formats):
- HTTP MJPEG: `http://192.168.1.100:8080/video`
- RTSP (requires backend conversion): `rtsp://192.168.1.100:554/stream`

### 4. Snapshot Capture
Click "Snapshot" on any camera source to:
1. Capture a single frame
2. Save it to `livestream/public/images/`
3. Display it in the photo gallery
4. Make it accessible via the web server

## Configuration

### Environment Variables

Create `.env.local` in the `livestream/` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production, update this to your deployed backend URL.

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Set the root directory to `livestream`
4. Add environment variable: `NEXT_PUBLIC_API_URL` → your backend URL
5. Deploy

### Backend (Render/Railway/Cloud Run)

**Using Render:**
1. Create a new Web Service
2. Connect your GitHub repo
3. Set root directory to `services/backend`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Deploy

**Using Docker:**
```powershell
cd services/backend
docker build -t photo-click-backend .
docker run -p 8000:8000 photo-click-backend
```

### CORS Configuration
Update `allow_origins` in `services/backend/main.py` to include your production frontend domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-app.vercel.app"],
    ...
)
```

## Storage Considerations

**Development**: Images are saved to `livestream/public/images/` and served by Next.js.

**Production**: Consider migrating to object storage:
- AWS S3
- DigitalOean Spaces
- Cloudflare R2
- MinIO (self-hosted)

Update `services/backend/main.py` to save to S3 instead of local filesystem.

## Known Limitations

1. **Local Camera Access**: Backend can only access cameras on the same machine/network. For remote deployment, use IP cameras or browser webcam.
2. **LAN Device Discovery**: Currently shows network IPs. Full device scanning requires a local agent or browser-based discovery (limited by CORS).
3. **Storage**: Local filesystem storage is not suitable for multi-instance deployments. Use S3 for production.
4. **RTSP Streams**: Need ffmpeg conversion to MJPEG or WebRTC for browser viewing (not yet implemented).

## Future Enhancements

- [ ] WebRTC SFU integration for low-latency streaming
- [ ] RTSP to WebRTC gateway using mediasoup/Janus
- [ ] Device discovery using ARP/ping sweep
- [ ] Local agent for on-premises camera access
- [ ] S3 storage integration
- [ ] User authentication (NextAuth.js)
- [ ] Subscription/billing (Stripe)
- [ ] Recording and playback
- [ ] Motion detection alerts
- [ ] Multi-user support with RBAC

## Troubleshooting

### CORS Errors
Make sure the backend CORS middleware includes your frontend origin.

### Camera Not Opening
- Check camera URL/index is correct
- Verify camera is accessible from the backend server
- For RTSP cameras, ensure network firewall allows the connection

### Images Not Displaying
- Check that `livestream/public/images/` directory exists
- Verify backend is saving files successfully (check backend logs)
- Ensure Next.js dev server restarted after creating the directory

### Webcam Permission Denied
- Check browser permissions for camera access
- Use HTTPS in production (required for getUserMedia)

## Support

For issues and feature requests, create an issue on GitHub.

## License

MIT License — See LICENSE file for details.
