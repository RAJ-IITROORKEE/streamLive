# 🚀 Quick Vercel Deployment - TL;DR

## ⚡ Super Fast Guide (5 Minutes)

### Step 1: Deploy Backend to Railway (2 mins)
1. Go to https://railway.app → Sign in with GitHub
2. **New Project** → **Deploy from GitHub repo** → Select `Photo-click-LAN`
3. Set **Root Directory**: `/services/backend`
4. **Generate Domain** in Settings → Networking
5. **Copy the URL** (e.g., `https://xxx.railway.app`) ← You need this!

### Step 2: Deploy Frontend to Vercel (2 mins)
1. Go to https://vercel.com → Sign in with GitHub
2. **Add New Project** → Import `Photo-click-LAN`
3. Set **Root Directory**: `livestream`
4. Add **Environment Variable**:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://xxx.railway.app` (your Railway URL from Step 1)
5. Click **Deploy**

### Step 3: Update Backend CORS (1 min)
1. Go to GitHub → Edit `services/backend/main.py`
2. Find `origins = [...]` (around line 11)
3. Add: `"https://your-app.vercel.app"` (your Vercel URL)
4. Commit → Railway auto-deploys

### ✅ Done! Your app is live!

---

## 📋 Checklist

- [ ] Backend deployed to Railway ✓
- [ ] Railway URL copied ✓
- [ ] Frontend deployed to Vercel ✓
- [ ] Environment variable set in Vercel ✓
- [ ] CORS updated in backend ✓
- [ ] App tested and working ✓

---

## 🎯 URLs You Need

| Service | URL | Where to Find |
|---------|-----|---------------|
| **Backend** | `https://xxx.railway.app` | Railway → Settings → Networking |
| **Frontend** | `https://xxx.vercel.app` | Vercel → Project Dashboard |

---

## 💡 Troubleshooting

**CORS Error?** → Add Vercel URL to backend `origins` list  
**API Not Working?** → Check `NEXT_PUBLIC_API_URL` in Vercel  
**Backend Down?** → Check Railway logs  
**Frontend 404?** → Verify Root Directory is `livestream`

---

## 🔗 Useful Commands

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy from terminal
cd livestream
vercel                  # Preview deployment
vercel --prod          # Production deployment

# Or use the PowerShell script
.\deploy-vercel.ps1
```

---

## 📚 Full Guides

- **Detailed Guide**: See `VERCEL_DEPLOYMENT_GUIDE.md`
- **Alternative Options**: See `DEPLOYMENT.md`

---

**That's it! 🎉 Your LiveStream app is now on the internet!**
