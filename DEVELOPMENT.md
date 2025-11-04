# Development Scripts Setup

## 🚀 Quick Start - Run Both Servers Together

Now you can run both the Next.js frontend and FastAPI backend with a single command!

### Start Development Servers

```bash
cd livestream
npm run dev
```

This will start:
- ✅ **Next.js frontend** on `http://localhost:3000` (cyan colored logs)
- ✅ **FastAPI backend** on `http://localhost:8000` (yellow colored logs)

Both servers will run in parallel with hot-reload enabled!

---

## 📋 Available Scripts

### In the `livestream` directory:

```bash
# Run both frontend and backend together (RECOMMENDED)
npm run dev

# Run only Next.js frontend
npm run dev:frontend
# or
npm run dev:next

# Run only FastAPI backend
npm run dev:backend

# Build for production
npm run build

# Start production server (frontend only)
npm run start

# Run linter
npm run lint
```

---

## 🛠️ Script Details

### `npm run dev` (Main Development Command)
- Uses `concurrently` to run multiple processes
- Color-coded output:
  - **Cyan**: Next.js frontend logs
  - **Yellow**: FastAPI backend logs
- Both servers auto-reload on file changes

### `npm run dev:next` or `npm run dev:frontend`
- Starts only the Next.js development server
- Useful if backend is already running separately

### `npm run dev:backend`
- Starts only the FastAPI backend with uvicorn
- Runs from `services/backend` directory
- Hot-reload enabled with `--reload` flag

---

## 🔧 Requirements

Make sure you have:
- ✅ Node.js 18+ installed
- ✅ Python 3.9+ installed
- ✅ Python packages installed: `cd services/backend && pip install -r requirements.txt`
- ✅ Node packages installed: `cd livestream && npm install`

---

## 🐛 Troubleshooting

### Issue: "Python not found" or "uvicorn not found"

**Windows (PowerShell):**
```powershell
# Check Python installation
python --version

# If not found, try py instead
py --version

# Install backend dependencies
cd services/backend
pip install -r requirements.txt
```

**Mac/Linux:**
```bash
# Check Python installation
python3 --version

# Install backend dependencies
cd services/backend
pip3 install -r requirements.txt
```

### Issue: Backend fails to start

**Solution 1**: Run backend manually first to check for errors
```bash
cd services/backend
python -m uvicorn main:app --reload
```

**Solution 2**: Check if port 8000 is already in use
```bash
# Windows
netstat -ano | findstr :8000

# Mac/Linux
lsof -i :8000
```

### Issue: Frontend fails to start

**Solution**: Check if port 3000 is already in use
```bash
# Windows
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :3000
```

---

## 💡 Tips

1. **Stop all servers**: Press `Ctrl+C` once to stop both servers
2. **View logs**: Both server logs appear in the same terminal with color coding
3. **Separate terminals**: If you prefer separate terminals, use `dev:frontend` and `dev:backend` in different terminal windows
4. **Production**: For production deployment, see `DEPLOYMENT.md` or `QUICKSTART.md`

---

## 🎯 Next Steps

1. Start servers: `npm run dev`
2. Open browser: `http://localhost:3000`
3. Add a camera and start streaming!
4. Backend API docs available at: `http://localhost:8000/docs`

---

**Happy coding! 🎉**
