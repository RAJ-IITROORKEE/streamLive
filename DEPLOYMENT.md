# Deployment Guide for LiveStream Application

This guide will help you deploy your LiveStream application to production.

## Architecture

- **Frontend**: Next.js 15 → Deployed on Vercel
- **Backend**: Python FastAPI → Deployed on Railway/Render/Heroku

---

## 🚀 Quick Deployment Steps

### Step 1: Deploy Backend (FastAPI) to Railway

Railway is recommended for Python backends with free tier.

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Deploy Backend**
   ```bash
   # Install Railway CLI (optional)
   npm i -g @railway/cli
   
   # Or use the web interface:
   # 1. Click "New Project" → "Deploy from GitHub repo"
   # 2. Select your repository
   # 3. Choose the `services/backend` directory as root
   ```

3. **Configure Environment**
   - Railway will auto-detect Python and install dependencies
   - Set port to 8000 (Railway does this automatically)
   - Get your deployed URL (e.g., `https://your-app.railway.app`)

4. **Update CORS Settings**
   - Once you know your Vercel frontend URL, update `services/backend/main.py`:
   ```python
   origins = [
       "http://localhost:3000",
       "http://localhost:3001",
       "https://your-vercel-app.vercel.app",  # Add your Vercel URL
   ]
   ```

---

### Step 2: Deploy Frontend (Next.js) to Vercel

1. **Install Vercel CLI** (Optional - you can also use web interface)
   ```bash
   npm i -g vercel
   ```

2. **Option A: Deploy via Vercel Website (Easiest)**
   
   a. Go to https://vercel.com and sign up with GitHub
   
   b. Click **"Add New Project"**
   
   c. Import your GitHub repository
   
   d. Configure project:
      - **Framework Preset**: Next.js
      - **Root Directory**: `livestream`
      - **Build Command**: `npm run build`
      - **Output Directory**: `.next`
   
   e. **Add Environment Variable**:
      - Name: `NEXT_PUBLIC_API_URL`
      - Value: Your Railway backend URL (e.g., `https://your-backend.railway.app`)
   
   f. Click **"Deploy"**

3. **Option B: Deploy via CLI**
   ```bash
   cd livestream
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy: Y
   - Which scope: Your account
   - Link to existing project: N
   - Project name: livestream (or your choice)
   - Directory: ./
   - Override settings: N
   
   Then set environment variable:
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   # Enter your Railway backend URL when prompted
   ```

---

## 🔧 Configuration Steps

### 1. Update API Endpoint in Frontend

Create a `.env.local` file in the `livestream` directory:

```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

### 2. Update Backend CORS

Edit `services/backend/main.py` to include your Vercel domain:

```python
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://your-app.vercel.app",
    "https://*.vercel.app",  # Allow all Vercel preview deployments
]
```

### 3. Create API Helper (Optional but Recommended)

Create `livestream/lib/api.ts`:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = {
  snapshot: `${API_URL}/snapshot`,
  photos: `${API_URL}/photos`,
  networkInfo: `${API_URL}/network-info`,
  images: `${API_URL}/images`,
  health: `${API_URL}/health`,
}
```

---

## 🌐 Alternative Backend Hosting Options

### Option 1: Render.com (Free Tier Available)
1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repo
4. Set root directory: `services/backend`
5. Build command: `pip install -r requirements.txt`
6. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Option 2: Heroku
1. Install Heroku CLI
2. Create `Procfile` in `services/backend`:
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
3. Deploy:
   ```bash
   heroku create your-app-name
   git subtree push --prefix services/backend heroku main
   ```

### Option 3: DigitalOcean App Platform
1. Go to https://www.digitalocean.com/products/app-platform
2. Create new app from GitHub
3. Select `services/backend` directory
4. Auto-detects Python and deploys

---

## 📝 Post-Deployment Checklist

- [ ] Backend is deployed and accessible
- [ ] Frontend environment variable `NEXT_PUBLIC_API_URL` is set
- [ ] CORS is configured with your Vercel domain
- [ ] Test snapshot capture from deployed frontend
- [ ] Test network info endpoint
- [ ] Test Assets page (image viewing/download)
- [ ] Verify localStorage persistence works
- [ ] Test all camera management features (add/edit/remove)

---

## 🐛 Troubleshooting

### Issue: CORS errors after deployment
**Solution**: Make sure your Vercel URL is in the backend's CORS `origins` list

### Issue: API calls failing
**Solution**: 
1. Check `NEXT_PUBLIC_API_URL` environment variable in Vercel
2. Verify backend is running (check Railway/Render logs)
3. Test backend health endpoint directly: `https://your-backend.railway.app/health`

### Issue: Images not saving
**Solution**: 
- Backend needs persistent storage
- On Railway: Add a volume mount
- Or use cloud storage (AWS S3, Cloudinary, etc.)

### Issue: Build fails on Vercel
**Solution**:
1. Check Node.js version compatibility
2. Verify all dependencies are in package.json
3. Check Vercel build logs for specific errors

---

## 🔄 Updates & Redeployment

### Update Frontend
- Push changes to GitHub
- Vercel auto-deploys on push (if enabled)
- Or run `vercel --prod`

### Update Backend
- Push changes to GitHub
- Railway/Render auto-deploys
- Or redeploy manually from dashboard

---

## 💡 Pro Tips

1. **Use Vercel Preview Deployments**: Every branch gets a preview URL
2. **Set up CI/CD**: Configure automatic deployments on push
3. **Monitor Performance**: Use Vercel Analytics and Railway metrics
4. **Add Custom Domain**: Both Vercel and Railway support custom domains
5. **Enable HTTPS**: Both platforms provide free SSL certificates

---

## 📚 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)

---

## 🎉 Success!

Once deployed, your app will be live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.railway.app`

Share your LiveStream application with the world! 🚀
