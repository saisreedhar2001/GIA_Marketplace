# Local File Upload - Complete Guide

## What's New

✓ **Upload images from your computer** directly  
✓ **Firebase Storage integration** - files stored securely  
✓ **Automatic URL generation** - no manual copying needed  
✓ **Multiple file support** - upload several at once  
✓ **File validation** - auto-rejects invalid files  

## How to Use

### Upload from Computer

#### Step 1: Go to Product Upload
- Click **"Upload Product"** button in artist dashboard
- Or go to `/products/new`

#### Step 2: Select Images
1. Scroll to **"Product Images"** section
2. Click **"Upload from Computer"** area
3. Select one or more image files from your computer
4. **Wait** for "Images uploaded!" notification
5. Images will appear in the preview grid below

#### Step 3: Alternative - Add by URL
Still want to paste URLs? You can!
1. In the **"Or paste image URL:"** section
2. Paste your image URL
3. Click **"Add URL"**
4. URL will be added to images list

### Edit Product Images

#### Step 1: Go to Edit Product
1. Go to `/artist` dashboard
2. Click **"Edit"** on any product
3. Scroll to **"Product Images"** section

#### Step 2: Upload More Images
1. Click file upload area
2. Select new image files
3. Wait for upload to complete
4. New images added to existing ones

#### Step 3: Remove Images
1. Hover over any image preview
2. Click **"Remove"** button
3. Image removed from list

## File Requirements

### Supported Formats
✓ JPG / JPEG  
✓ PNG  
✓ GIF  
✓ WebP  
✓ BMP  
✓ SVG  

### File Limits
- **Max size:** 5MB per image
- **Max files at once:** Unlimited (but recommended: 1-5 at a time)
- **Recommended resolution:** 800x600 or higher
- **Aspect ratio:** Any (will auto-crop in display)

### File Names
- Keep file names simple (no special characters)
- Examples: `artwork.jpg`, `product-photo.png`
- Avoid: `my photo (1).jpg`, `art@final!.png`

## Workflow Examples

### Example 1: Upload Product with Local Images

```
1. Go to /products/new
2. Fill in product details (title, price, etc.)
3. Scroll to "Product Images"
4. Click file upload → Select image.jpg from computer
5. Wait for "Images uploaded!" message
6. See image preview appear
7. Click "Upload Product"
8. Done!
```

### Example 2: Update Product with New Images

```
1. Go to /artist → Products tab
2. Click Edit on product
3. Scroll to "Product Images"
4. Click file upload → Select photo1.jpg, photo2.jpg
5. Wait for upload
6. See both images in preview
7. Click "Save Changes"
8. Done!
```

### Example 3: Mix Local & URL Images

```
1. Upload from Computer → Select local-image.jpg
2. Wait for upload
3. Add by URL → Paste https://example.com/photo.jpg
4. Click "Add URL"
5. Both images in preview
6. Save product
```

## Behind the Scenes

### What Happens When You Upload

1. **File Selected** → Your computer opens file picker
2. **File Validated** → Checks format and size
3. **Upload Starts** → Shows "Uploading images..." toast
4. **Firebase Storage** → File uploaded securely
5. **URL Generated** → Image gets permanent URL
6. **Preview Shows** → Image appears in grid
7. **Success** → Shows "Images uploaded!" toast

### Where Files Are Stored

- **Location:** Firebase Cloud Storage
- **Folder:** `/products/` 
- **URL Format:** `https://firebasestorage.googleapis.com/...`
- **Access:** Public (can be viewed by anyone)
- **Duration:** Permanent (until deleted)

### File Name Pattern

Uploaded files are renamed for uniqueness:
```
Original: photo.jpg
Stored as: 1705341234-a1b2c3-photo.jpg
          ↑         ↑      ↑
       timestamp  random  original name
```

This prevents filename conflicts!

## Troubleshooting

### Problem: "File must be an image"
**Solution:** You selected a non-image file  
- Select: `.jpg`, `.png`, `.gif`, `.webp`
- Don't select: `.pdf`, `.txt`, `.doc`

### Problem: "File size must be less than 5MB"
**Solution:** Your image is too large  
- Compress image before uploading
- Use online tool: tinypng.com
- Or resize in image editor

### Problem: "Failed to upload images"
**Cause:** Network or Firebase issue  
**Solutions:**
1. Check internet connection
2. Try again in 5 seconds
3. Check browser console (F12) for errors
4. Try different file

### Problem: Image Shows Blank
**Cause:** URL generation failed  
**Solution:**
1. Delete the image
2. Re-upload the file
3. Try different image format

### Problem: Upload Seems Stuck
**Solution:**
1. Wait 10 seconds (don't close)
2. Check internet connection
3. Refresh page if needed
4. Try smaller file

## Tips & Best Practices

### ✓ Do This
- Use high-quality images (at least 400x400px)
- Upload JPG for smaller file sizes
- Use PNG for transparency
- Give images clear names: `artwork-1.jpg`
- Upload 2-3 images per product

### ✗ Don't Do This
- Don't use very large files (>5MB)
- Don't mix screenshot with actual photos
- Don't use very low resolution images
- Don't upload copyrighted images
- Don't rely on single image

## Performance

### Upload Speed
- **Typical:** 2-5 seconds per image
- **Depends on:** Image size, internet speed
- **Wifi faster than:** Mobile data
- **Multiple files:** Upload in parallel (faster)

### Image Display
- **Display time:** Instant (after upload)
- **Shop page load:** May cache for 10 seconds
- **Edit product:** Shows immediately

## Limits & Quotas

### Storage Limits
- **Free tier:** 5GB total
- **What counts:** Only uploaded images
- **How much:** ~500-1000 images at typical sizes

### Upload Limits
- **Rate limit:** No official limit for free tier
- **Practical limit:** 5-10 files at once recommended
- **Too many at once:** May timeout

## Privacy & Security

### Are Images Private?
- **By default:** Images are PUBLIC
- **Anyone can view:** Yes, anyone with URL
- **Authentication needed:** No
- **Secure:** Yes, HTTPS encrypted

### Image Retention
- **How long:** Permanent (until deleted)
- **Backup:** Automatically backed up
- **Recovery:** Can be deleted anytime

## Mobile Upload

### Works on Mobile?
✓ Yes! Upload from phone camera roll  
✓ Select multiple photos at once  
✓ Same process as desktop  

### Tips for Mobile
1. Take clear photo with good lighting
2. Open shop upload on phone
3. Select "Upload from Computer"
4. Choose photos from gallery
5. Wait for upload to complete
6. Verify images look good

## Switching from URL to File Upload

### Old Way (Still Works)
```
1. Find image online
2. Copy image URL
3. Paste into "Add by URL"
4. Click "Add URL"
```

### New Way (Recommended)
```
1. Download image to computer
2. Go to product page
3. Click file upload
4. Select image file
5. Done - no copying URLs!
```

## Common Questions

### Q: Can I upload more than 5 images?
**A:** Yes! Upload as many as you want. Most helpful: 3-5 images.

### Q: What if image is too big (>5MB)?
**A:** Compress it first using online tools or image editor.

### Q: Can I delete uploaded images?
**A:** Yes, click "Remove" button on preview. File stays in storage but won't be used.

### Q: Are images backed up?
**A:** Yes, automatically in Firebase.

### Q: Can I download uploaded images?
**A:** No, but you can share the Firebase URL with anyone.

### Q: What happens if Firebase goes down?
**A:** Very rare. Images are backed up. You can use URL-based images as backup.

## Next Steps

1. **Test Upload:** Try uploading a simple image
2. **Verify Display:** Check image appears in shop
3. **Add Multiple:** Upload 2-3 images to same product
4. **Edit Product:** Add more images later
5. **Mix Methods:** Use both file upload and URLs

## Support

Need help? Check these docs:
- `PRODUCT_UPLOAD_FIX.md` - General troubleshooting
- `ARTIST_DASHBOARD_SETUP.md` - Dashboard features
- Browser console (F12) - Error messages
