# Fix Firebase Storage Permissions - Complete Guide

## Problem
```
Firebase Storage: User does not have permission to access 'products/...' 
(storage/unauthorized)
```

This means Firebase Security Rules don't allow uploads. Need to fix rules to allow authenticated users to upload.

## Solution: Update Firebase Security Rules

### Step 1: Open Firebase Console

1. Go to: https://console.firebase.google.com
2. Select your project: **fir-gia-95889**
3. Click **Storage** in left menu
4. Click **Rules** tab at the top

### Step 2: Replace Security Rules

Clear everything and paste this:

```
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read access to all images
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
      allow delete: if request.auth != null;
    }

    match /users/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
      allow delete: if request.auth.uid == userId;
    }

    // Deny everything else
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
      allow delete: if request.auth != null;
    }
  }
}
```

### Step 3: Publish Rules

1. Click **"Publish"** button (top right)
2. Wait for confirmation message
3. Should show: "Rules updated successfully"

### Step 4: Test Upload

1. Go back to app
2. Try uploading a product image again
3. Should work now!

## What These Rules Do

### Products Folder
- ✓ **Anyone** can read images (public)
- ✓ **Authenticated users** can upload
- ✓ **Authenticated users** can delete their uploads
- ✓ Perfect for shop products

### Users Folder  
- ✓ **Authenticated users** can see their own files
- ✓ **Only owner** can upload to their folder
- ✓ **Only owner** can delete
- ✓ For user-specific uploads

### Other Folders
- ✓ **Authenticated users** can read/write/delete
- ✓ Default fallback for any other folders

## Full Rule Breakdown

```javascript
rules_version = '2';  // Latest Firebase rules version

service firebase.storage {
  match /b/{bucket}/o {
    // PRODUCTS (shop items)
    match /products/{allPaths=**} {
      allow read: if true;              // Anyone can view product images
      allow write: if request.auth != null;  // Only logged-in users can upload
      allow delete: if request.auth != null; // Only logged-in users can delete
    }

    // USERS (user avatars, etc)
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth != null;              // Only logged-in users can read
      allow write: if request.auth.uid == userId;       // Only owner can upload
      allow delete: if request.auth.uid == userId;      // Only owner can delete
    }

    // EVERYTHING ELSE (fallback)
    match /{allPaths=**} {
      allow read: if request.auth != null;    // Need to be logged in
      allow write: if request.auth != null;   // Need to be logged in
      allow delete: if request.auth != null;  // Need to be logged in
    }
  }
}
```

## Step-by-Step in Firebase Console

### If You're New to This:

1. **Open Firebase Console**
   - URL: https://console.firebase.google.com
   - Sign in with your Google account

2. **Select Your Project**
   - Click on "fir-gia-95889"

3. **Go to Storage**
   - Left sidebar → Build → Storage
   - Click "Storage"

4. **Open Rules Tab**
   - Top of page, next to "Files" tab
   - Click "Rules"

5. **See Current Rules**
   - Shows default Firebase rules
   - Very restrictive (why uploads fail)

6. **Clear and Paste**
   - Select all (Ctrl+A)
   - Delete
   - Paste the rules above

7. **Publish**
   - Blue "Publish" button, top right
   - Confirm if asked

8. **Wait for Confirmation**
   - Should say "Rules updated successfully"
   - Takes 1-2 minutes to apply globally

## Verify It Works

After updating rules:

1. **Refresh the app** (F5)
2. **Try uploading image** to product
3. **Wait for "Images uploaded!"** toast
4. **Check shop page** - product with image should appear

## Rules Explanation by Scenario

### Scenario 1: Anonymous User Browsing Shop
```
✓ Can view all product images (read allowed)
✗ Cannot upload (auth required for write)
```

### Scenario 2: Logged-in Artist Uploading
```
✓ Can upload images to /products/ (auth required + write allowed)
✓ Can see own uploads
✓ Can delete own uploads
```

### Scenario 3: Admin Managing Products
```
✓ All same as artist
✓ Plus can modify other artists' products
```

### Scenario 4: Logged-in User Accessing Shop
```
✓ Can view all product images
✓ Can buy products
✓ Cannot upload products (not artist)
```

## Common Rule Mistakes

### ✗ Too Restrictive (Original)
```
match /{allPaths=**} {
  allow read: false;
  allow write: false;
}
```
**Problem:** Nobody can do anything  
**Result:** Upload fails

### ✓ Correct Balance
```
match /products/{allPaths=**} {
  allow read: if true;
  allow write: if request.auth != null;
}
```
**Problem:** None, this is correct!  
**Result:** Public read, authenticated write

### ✗ Too Permissive
```
match /{allPaths=**} {
  allow read: true;
  allow write: true;
  allow delete: true;
}
```
**Problem:** Anyone can do anything (security risk!)  
**Result:** Works but unsafe

## Troubleshooting

### "Publish" Button Grayed Out
**Solution:**
1. Make sure you made changes
2. Don't copy extra spaces/lines
3. Check syntax (paste our rules exactly)

### "Rules Contain an Error"
**Solution:**
1. Check for typos
2. Make sure braces match `{` and `}`
3. Paste the exact rules provided above
4. Try again

### Upload Still Fails After Publishing
**Solution:**
1. Wait 2-3 minutes for global propagation
2. Hard refresh browser (Ctrl+Shift+F5)
3. Try uploading again
4. Check browser console (F12) for exact error

### Need to Revert
**Solution:**
1. Go back to Rules tab
2. Click "Revert" to restore previous version
3. Or paste rules again

## Security Considerations

### What's Protected
- ✓ Only authenticated users can upload
- ✓ Only authenticated users can delete
- ✓ Files are encrypted in transit (HTTPS)
- ✓ Files stored securely on Google servers

### What's Public
- Product images (intentional - for shop)
- Anyone can view these via URL
- This is the whole point (sell products!)

### What's Private
- User files (if you add them)
- Only owner can access

## Production Recommendations

### For Development (Current)
✓ Use rules provided above  
✓ Simple and sufficient  
✓ Allow testing and uploads  

### For Production (Future)
Consider stricter rules:
```javascript
match /products/{allPaths=**} {
  allow read: if true;
  allow write: if request.auth != null && 
               request.auth.token.email_verified == true;
  allow delete: if request.auth != null &&
                request.auth.token.email_verified == true;
}
```
**Requires:** Email verified for uploads

## Testing the Rules

### Test Read Access
1. Go to `/shop`
2. Browse products
3. ✓ Images should load

### Test Write Access
1. Go to `/products/new`
2. Upload image
3. ✓ Should upload successfully

### Test Delete Access
1. Go to `/artist` → Edit product
2. Click "Remove" on image
3. ✓ Should be removed

### Test Auth Required
1. Open DevTools Network tab
2. Upload image
3. Check Request Headers
4. Should have: `Authorization: Bearer ...`

## Monitor Storage Usage

1. **Firebase Console** → Storage
2. **See usage:**
   - Data stored (MB/GB)
   - Downloads (bandwidth)
   - Upload requests
   - Delete requests

3. **Current limits (free):**
   - 5GB storage
   - 1GB/day downloads
   - Sufficient for testing

## Backup Plan

If Firebase Storage fails:

### Fallback to URLs
Users can still:
1. Upload to another service (Imgur, etc.)
2. Get image URL
3. Paste URL in product form
4. Works exactly the same!

### Services for Image URLs:
- **ImgBB:** https://imgbb.com (free)
- **Imgur:** https://imgur.com (free)
- **Cloudinary:** https://cloudinary.com (free tier)
- **Any CDN with public images**

## Next Steps

1. ✓ Open Firebase Console
2. ✓ Go to Storage → Rules
3. ✓ Paste rules provided above
4. ✓ Click Publish
5. ✓ Wait 2 minutes
6. ✓ Refresh app (F5)
7. ✓ Try uploading image
8. ✓ Should work now!

## Still Having Issues?

### Check These:
1. ✓ Pasted rules exactly?
2. ✓ Clicked Publish?
3. ✓ Waited 2+ minutes?
4. ✓ Refreshed browser?
5. ✓ Logged in with Firebase?
6. ✓ No errors in console (F12)?

### If still failing:
1. Check Firebase Console → Storage → Files
2. Should see your uploaded files (even if permission denied)
3. Share error from console with support

## Success Indicators

You'll know it's fixed when:

✓ Upload image → No permission error  
✓ See "Images uploaded!" toast  
✓ Image appears in preview  
✓ Save product → Success  
✓ See in shop with image  

## Files & Documentation

- This guide: `FIX_FIREBASE_STORAGE_PERMISSIONS.md`
- Related: `LOCAL_FILE_UPLOAD.md` - File upload guide
- Related: `SHOP_PRODUCTS_NOT_SHOWING.md` - Shop troubleshooting

Done! Your Firebase Storage should be ready for uploads! 🚀
