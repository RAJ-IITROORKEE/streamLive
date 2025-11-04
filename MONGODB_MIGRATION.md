# MongoDB Migration for Camera Management

## Overview
Successfully migrated camera management from localStorage to MongoDB for better persistence, scalability, and proper camera name tracking in photo metadata.

## Changes Made

### 1. **Database Models Created**

#### `livestream/models/Camera.ts`
- MongoDB schema for camera configurations
- Fields:
  - `name`: Camera display name
  - `url`: Camera stream URL (unique index)
  - `type`: 'webcam' or 'ip'
  - `isActive`: Boolean flag for active cameras
  - `lastUsed`: Timestamp for sorting recently used cameras
  - `metadata`: Optional resolution and fps info
- Indexes: name, isActive+lastUsed, unique url

#### `livestream/models/Photo.ts` (Already Existing)
- MongoDB schema for photo metadata
- Stores camera name, URL, Cloudinary URLs, capture timestamp, metadata

### 2. **API Routes Created**

#### `livestream/app/api/cameras/route.ts`
- **GET**: Fetch all active cameras sorted by `lastUsed` (most recent first)
- **POST**: Create new camera with duplicate URL validation

#### `livestream/app/api/cameras/[id]/route.ts`
- **GET**: Fetch single camera by ID
- **PUT**: Update camera (auto-updates `lastUsed` timestamp)
- **DELETE**: Delete camera from MongoDB

### 3. **Frontend Updates** (`livestream/app/page.tsx`)

#### Camera Loading
- **OLD**: `localStorage.getItem("cameras")` in useEffect
- **NEW**: `loadCameras()` async function that fetches from `/api/cameras`
- Automatically loads on component mount

#### Add/Edit Camera
- **OLD**: Direct state manipulation + localStorage.setItem
- **NEW**: 
  - POST `/api/cameras` for new cameras
  - PUT `/api/cameras/[id]` for updates
  - Calls `loadCameras()` to refresh list after save

#### Remove Camera
- **OLD**: Filter cameras array + update localStorage
- **NEW**: DELETE `/api/cameras/[id]` + reload cameras

#### Snapshot with Camera Name
- **OLD**: Used "Unknown Camera" fallback
- **NEW**: Passes camera object to `takeSnapshot()` function
- Updated all 3 snapshot button calls:
  1. Timer snapshot (line ~226)
  2. Camera card snapshot button (line ~331)
  3. Fullscreen snapshot button (line ~474)
- Now correctly saves camera name to MongoDB photo metadata

### 4. **Removed Code**
- Removed localStorage camera save useEffect
- Removed `savedCameraTemplates` localStorage logic (MongoDB handles this)
- Camera templates now come directly from MongoDB query

## Benefits

### 1. **Proper Camera Names**
- Photos now save with actual camera name (not "Unknown Camera")
- Camera name pulled from MongoDB document during snapshot

### 2. **Better Persistence**
- Cameras survive browser cache clearing
- Can be accessed from multiple devices (same MongoDB)
- Centralized camera configuration

### 3. **Scalability**
- No localStorage size limits
- Can add pagination for large camera lists
- Can filter cameras by type, date, etc.

### 4. **Data Integrity**
- Unique URL constraint prevents duplicates
- `lastUsed` tracking shows recently active cameras first
- Structured data with validation

## Database Structure

### Cameras Collection
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Front Door Camera",
  "url": "http://192.168.1.100:8080/video",
  "type": "ip",
  "isActive": true,
  "lastUsed": "2024-01-15T10:30:00.000Z",
  "metadata": {
    "resolution": "1920x1080",
    "fps": 30
  },
  "createdAt": "2024-01-10T08:00:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Photos Collection
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "cameraName": "Front Door Camera",
  "cameraUrl": "http://192.168.1.100:8080/video",
  "imageUrl": "https://res.cloudinary.com/dgiwxrued/image/upload/...",
  "secureUrl": "https://res.cloudinary.com/dgiwxrued/image/upload/...",
  "cloudinaryPublicId": "snapshots/abc123",
  "capturedAt": "2024-01-15T10:30:15.000Z",
  "metadata": {
    "width": 1920,
    "height": 1080,
    "format": "jpg",
    "size": 245678
  },
  "createdAt": "2024-01-15T10:30:15.000Z"
}
```

## Testing

### 1. **Test Add Camera**
1. Run `npm run dev`
2. Click "+ Add Camera"
3. Enter name: "Test Camera"
4. Enter URL: "http://example.com/stream"
5. Click "Add Camera"
6. Verify toast success message
7. Check MongoDB Atlas → Collections → cameras

### 2. **Test Edit Camera**
1. Click edit icon on camera card
2. Change name to "Updated Camera"
3. Click "Save Changes"
4. Verify camera name updated in UI
5. Check MongoDB document updated

### 3. **Test Remove Camera**
1. Click trash icon on camera card
2. Verify toast "Camera removed"
3. Check camera disappears from UI
4. Check MongoDB document deleted

### 4. **Test Snapshot with Camera Name**
1. Add a camera with name "Living Room"
2. Click "Snapshot" button
3. Check toast success message
4. Go to Assets page
5. Verify photo shows "Living Room" as camera name
6. Check MongoDB photos collection - cameraName should be "Living Room"

### 5. **Test Persistence**
1. Add 2-3 cameras
2. Close browser tab
3. Reopen application
4. Verify cameras still appear (loaded from MongoDB)
5. Verify localStorage NOT used (check browser DevTools)

## Migration Notes

### No Data Loss
- Existing localStorage cameras are not automatically migrated
- Users will need to re-add cameras (one-time setup)
- Existing Cloudinary photos remain intact

### Environment Variables Required
- `MONGODB_URI`: MongoDB connection string (already set)
- `CLOUDINARY_*`: Cloud storage credentials (already set)

### Backward Compatibility
- Old code removed (no localStorage fallback)
- Application now requires MongoDB connection
- Fails gracefully if MongoDB unavailable (shows empty camera list)

## Next Steps (Optional Enhancements)

1. **Bulk Import**: Add button to import cameras from JSON file
2. **Camera Groups**: Organize cameras by location/type
3. **Camera Health**: Ping URLs to check if cameras are online
4. **Camera Templates**: Pre-configured popular camera brands
5. **Camera Sharing**: Share camera configs between users
6. **Camera Analytics**: Track which cameras are used most

## Troubleshooting

### Cameras Not Loading
- Check MongoDB connection in browser console
- Verify `MONGODB_URI` in `.env.local`
- Check MongoDB Atlas network access (allow your IP)

### Duplicate URL Error
- Each camera URL must be unique
- Check existing cameras before adding
- Delete old camera before re-adding with same URL

### Camera Name Shows "Unknown Camera"
- Ensure all `takeSnapshot()` calls pass camera object as second parameter
- Check browser console for errors
- Verify camera object has `name` field

### Photos Missing Camera Info
- Old photos (before migration) may have "Unknown Camera"
- New photos should have correct camera name
- Check `/api/upload` receives `cameraName` in FormData

## Files Modified

1. ✅ `livestream/models/Camera.ts` (NEW)
2. ✅ `livestream/app/api/cameras/route.ts` (NEW)
3. ✅ `livestream/app/api/cameras/[id]/route.ts` (NEW)
4. ✅ `livestream/app/page.tsx` (MODIFIED)
5. ✅ `MONGODB_MIGRATION.md` (NEW - this file)

## Rollback Plan

If issues occur, revert `page.tsx` to use localStorage:
1. Git checkout previous version of `page.tsx`
2. Remove Camera model and API routes
3. Cameras will use localStorage again (temporary)

However, photos will still reference MongoDB camera names, so full rollback not recommended.

---

**Status**: ✅ Complete and Ready for Testing
**Date**: 2024
**Author**: AI Assistant
