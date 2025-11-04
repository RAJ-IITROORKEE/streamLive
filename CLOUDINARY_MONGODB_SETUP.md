# MongoDB & Cloudinary Setup Guide

This guide will help you set up MongoDB and Cloudinary for your LiveStream application.

---

## 📦 What's New?

Your app now uses:
- **Cloudinary** - Cloud storage for images (instead of local public/images folder)
- **MongoDB** - Database to store image metadata and URLs
- **Next.js API Routes** - Handle uploads and database operations

---

## 🔧 Setup Steps

### 1. Get MongoDB URI (Free!)

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com
2. **Sign up / Login** with Google or Email
3. **Create a FREE cluster**:
   - Click "Build a Database"
   - Choose **M0 FREE** tier
   - Select a cloud provider & region (close to you)
   - Click "Create Cluster"

4. **Create Database User**:
   - Go to **Database Access** (left sidebar)
   - Click "Add New Database User"
   - Username: `livestream_user` (or any name)
   - Password: Click "Autogenerate Secure Password" and **SAVE IT**
   - User Privileges: "Read and write to any database"
   - Click "Add User"

5. **Add IP Whitelist**:
   - Go to **Network Access** (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (or add your IP)
   - Click "Confirm"

6. **Get Connection String**:
   - Go to **Database** → Click "Connect"
   - Choose "Connect your application"
   - Select "Node.js" driver
   - Copy the connection string:
   ```
   mongodb+srv://livestream_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password
   - Add database name after `.net/`:
   ```
   mongodb+srv://livestream_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/livestream?retryWrites=true&w=majority
   ```

### 2. Update .env.local

Add your MongoDB URI to `.env.local`:

```env
MONGODB_URI=mongodb+srv://livestream_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/livestream?retryWrites=true&w=majority
```

Your Cloudinary config is already set from your attachment ✅

---

## 🌐 For Vercel Deployment

Add these environment variables in Vercel:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

2. Add:
   ```
   MONGODB_URI=mongodb+srv://...your_full_uri...
   CLOUDINARY_CLOUD_NAME=dgiwxrued
   CLOUDINARY_API_KEY=413879467782371
   CLOUDINARY_API_SECRET=zDY3HnvXAdAVF-NpOSWJ2hzb_78
   ```

3. **Redeploy** your app

---

## 🎯 How It Works Now

### Old Flow (Local Storage):
```
Camera → Backend → Save to public/images → Display from public/images
```

### New Flow (Cloud Storage):
```
Camera → Backend → Get Image 
    ↓
Next.js API (/api/upload)
    ↓
Upload to Cloudinary (gets URL)
    ↓
Save URL + metadata to MongoDB
    ↓
Display from Cloudinary CDN
```

---

## 📋 New API Routes

### POST `/api/upload`
Upload image to Cloudinary and save to MongoDB

**Body (FormData)**:
- `image`: File (JPEG/PNG)
- `cameraName`: string
- `cameraUrl`: string

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "imageUrl": "https://res.cloudinary.com/...",
    "cameraName": "Front Door",
    "capturedAt": "2025-11-05T..."
  }
}
```

### GET `/api/upload`
Fetch all photos from MongoDB

**Query Params**:
- `limit`: number (default: 50)
- `skip`: number (default: 0)
- `cameraName`: string (optional filter)

**Response**:
```json
{
  "success": true,
  "data": [...photos],
  "pagination": {
    "total": 100,
    "limit": 50,
    "skip": 0,
    "hasMore": true
  }
}
```

### DELETE `/api/photos/[id]`
Delete photo from Cloudinary and MongoDB

**Response**:
```json
{
  "success": true,
  "message": "Photo deleted successfully"
}
```

---

## 🧪 Testing

### Test Local Development:

1. Start servers:
   ```bash
   cd livestream
   npm run dev
   ```

2. Add a camera with IP Webcam

3. Take a snapshot - it should:
   - ✅ Upload to Cloudinary
   - ✅ Save metadata to MongoDB
   - ✅ Show in Assets page

4. Go to Assets page:
   - ✅ See all photos from MongoDB
   - ✅ Download works
   - ✅ Delete works (removes from both Cloudinary and MongoDB)

### Verify in MongoDB:

1. Go to MongoDB Atlas Dashboard
2. Click "Browse Collections"
3. Select `livestream` database → `photos` collection
4. You should see your photo documents!

---

## 🎨 Benefits

✅ **No more local storage limits**  
✅ **Automatic CDN for fast image loading**  
✅ **Image optimization by Cloudinary**  
✅ **Searchable metadata in MongoDB**  
✅ **Scalable to millions of images**  
✅ **Automatic backups via MongoDB Atlas**  

---

## 🐛 Troubleshooting

### Issue: "Please define the MONGODB_URI environment variable"
**Solution**: Make sure `MONGODB_URI` is in your `.env.local` file

### Issue: "Upload failed" or Cloudinary errors
**Solution**: 
1. Verify Cloudinary credentials in `.env.local`
2. Check if cloud name, API key, and secret are correct
3. Go to https://console.cloudinary.com to verify

### Issue: "Failed to connect to MongoDB"
**Solution**:
1. Check if IP is whitelisted (use "Allow from anywhere" for testing)
2. Verify password in connection string (no special characters issues)
3. Make sure database name is added to the URI

### Issue: Images not showing in Assets
**Solution**:
1. Check browser console for errors
2. Verify MongoDB connection is working
3. Check if `photos` collection has documents

---

## 📚 Database Schema

### Photo Model:
```typescript
{
  cameraName: string          // "Front Door Camera"
  cameraUrl: string           // Camera stream URL
  imageUrl: string            // Cloudinary URL
  secureUrl: string           // Cloudinary HTTPS URL
  cloudinaryPublicId: string  // For deletion
  capturedAt: Date            // When captured
  metadata: {
    width: number
    height: number
    format: string            // "jpg", "png"
    size: number              // bytes
  }
  tags: string[]              // Optional tags
  createdAt: Date            // Auto-generated
  updatedAt: Date            // Auto-generated
}
```

---

**You're all set! 🚀 Your images are now stored in the cloud!**
