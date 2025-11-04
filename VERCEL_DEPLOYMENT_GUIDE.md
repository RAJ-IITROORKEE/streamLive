# Vercel Deployment Guide for LiveStream

This is a **step-by-step guide** to deploy your LiveStream application to Vercel.

---

## 📋 Prerequisites

1. ✅ GitHub account
2. ✅ Vercel account (sign up at https://vercel.com with your GitHub)
3. ✅ Your code pushed to GitHub repository

---

## 🎯 Step-by-Step Deployment

### Part 1: Deploy Backend (FastAPI) First

Since Vercel is primarily for frontend, we'll deploy the backend to **Railway** (free tier).

#### Railway Deployment:

1. **Go to Railway**: https://railway.app
2. **Sign in with GitHub**
3. **Create New Project** → **Deploy from GitHub repo**
4. **Select your repository**: `Photo-click-LAN`
5. **Configure service**:
   - Click on the service that was created
   - Go to **Settings** → **Service Name**: `photo-click-backend`
   - Go to **Settings** → **Root Directory**: `/services/backend`
   - Railway will auto-detect Python and install dependencies
6. **Get your backend URL**:
   - Go to **Settings** → **Networking** → **Generate Domain**
   - Copy the URL (e.g., `https://photo-click-backend.up.railway.app`)
   - **Save this URL** - you'll need it for Vercel!

7. **Update CORS** (Important!):
   - You'll need to update the backend CORS settings after deploying frontend
   - We'll come back to this in Step 7

---

### Part 2: Deploy Frontend (Next.js) to Vercel

#### Method 1: Using Vercel Website (Recommended - Easiest)

1. **Go to Vercel**: https://vercel.com
2. **Sign in** with GitHub
3. **Click "Add New..."** → **Project**
4. **Import Git Repository**:
   - Select your repository: `Photo-click-LAN`
   - Click **Import**

5. **Configure Project**:
   ```
   Project Name: livestream-app (or any name you like)
   Framework Preset: Next.js
   Root Directory: livestream
   Build Command: npm run build
   Output Directory: .next (leave default)
   Install Command: npm install
   ```

6. **Add Environment Variables**:
   Click **Environment Variables** section and add:
   ```
   Name: NEXT_PUBLIC_API_URL
   Value: https://your-railway-backend-url.railway.app
   ```
   (Use the Railway URL you copied earlier)

7. **Click "Deploy"** 🚀

8. **Wait for deployment** (usually 2-3 minutes)

9. **Get your Vercel URL**:
   - After deployment completes, you'll see your URL
   - Example: `https://livestream-app.vercel.app`

---

### Part 3: Update Backend CORS Settings

Now that you have your Vercel URL, update the backend to allow requests from it:

1. **Go to your repository** on GitHub
2. **Edit file**: `services/backend/main.py`
3. **Find the CORS section** (around line 11-15):
   ```python
   origins = [
       "http://localhost:3000",
       "http://localhost:3001",
   ]
   ```

4. **Add your Vercel URL**:
   ```python
   origins = [
       "http://localhost:3000",
       "http://localhost:3001",
       "https://livestream-app.vercel.app",  # Your actual Vercel URL
       "https://*.vercel.app",  # Allow all Vercel preview deployments
   ]
   ```

5. **Commit and push** the changes
6. **Railway will auto-deploy** the updated backend

---

## ✅ Verification Steps

1. **Visit your Vercel URL**: `https://your-app.vercel.app`
2. **Check if the page loads** with the dashboard
3. **Test adding a camera**:
   - Use IP Webcam app or any IP camera
   - Try to add the camera URL
4. **Test snapshot feature** (if you have a camera connected)
5. **Check Assets page** to see if it loads
6. **Check About page**

---

## 🐛 Troubleshooting

### Issue 1: "Failed to fetch network info" or CORS errors

**Solution**: 
- Make sure you added your Vercel URL to backend CORS settings
- Wait 2-3 minutes after pushing the CORS update for Railway to redeploy
- Check Railway deployment logs

### Issue 2: Environment variable not working

**Solution**:
1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Verify `NEXT_PUBLIC_API_URL` is set correctly
3. Redeploy: Deployments → Click ⋯ → Redeploy

### Issue 3: 404 errors on Vercel

**Solution**:
- Make sure Root Directory is set to `livestream`
- Check Build Logs in Vercel dashboard

### Issue 4: Backend not responding

**Solution**:
1. Check Railway dashboard → Your project → Deployments
2. Click on latest deployment → View Logs
3. Make sure there are no Python errors

---

## 🔄 Making Updates After Deployment

### Update Frontend:
1. Push changes to GitHub
2. Vercel auto-deploys (if enabled in settings)
3. Or manually redeploy from Vercel dashboard

### Update Backend:
1. Push changes to GitHub
2. Railway auto-deploys automatically
3. Or manually redeploy from Railway dashboard

---

## 💰 Cost Breakdown

| Service | Free Tier | Usage |
|---------|-----------|-------|
| **Vercel** | ✅ Yes | Unlimited for personal projects |
| **Railway** | ✅ $5 free credits/month | ~500 hours/month for small apps |

Both are **free to start**! 🎉

---

## 📱 Sharing Your App

Once deployed, share your app:
- **Live URL**: `https://your-app.vercel.app`
- Works on mobile, tablet, and desktop
- No installation needed - just share the link!

---

## 🎉 Success Checklist

- [ ] Backend deployed to Railway
- [ ] Backend URL copied
- [ ] Frontend deployed to Vercel
- [ ] Environment variable `NEXT_PUBLIC_API_URL` set in Vercel
- [ ] CORS updated in backend with Vercel URL
- [ ] App loads successfully on Vercel URL
- [ ] Can add cameras (if available)
- [ ] All pages work (Home, About, Assets)

---

## 📞 Need Help?

If you encounter any issues:
1. Check Vercel build logs: Dashboard → Deployments → Build Logs
2. Check Railway logs: Dashboard → Deployments → View Logs
3. Check browser console: F12 → Console tab for errors

---

## 🌟 Optional: Add Custom Domain

### On Vercel:
1. Go to Project Settings → Domains
2. Add your domain (e.g., `livestream.yourdomain.com`)
3. Update DNS records as instructed

### On Railway:
1. Go to Service Settings → Networking → Custom Domain
2. Add your domain
3. Update DNS records

---

**That's it! Your app is now live! 🎊**
