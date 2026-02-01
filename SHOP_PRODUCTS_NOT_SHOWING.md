# Shop Products Not Displaying - Complete Fix

## Why Products Weren't Showing

### Root Cause Analysis

The products were uploading successfully but not displaying in shop because:

1. **Image URL Issues**
   - Products need a valid `image` field
   - Without image URL, product won't display
   - Empty/invalid URLs cause display failure

2. **Category Mismatch**
   - Shop filters by predefined categories
   - Custom categories don't match filter options
   - Product hidden if category doesn't match

3. **Firestore Sync Delay**
   - Data takes 1-2 seconds to sync
   - Immediate refresh shows nothing
   - Need to wait or refresh page

4. **Data Structure Issues**
   - DateTime objects not serializable to JSON
   - Missing required fields
   - Now fixed with proper serialization

## What's Fixed Now

### ✓ DateTime Serialization
- **Before:** `datetime` object → JSON error
- **After:** `.isoformat()` string → Valid JSON

### ✓ Product Response Structure
- **Before:** Incomplete JSON response
- **After:** Full product object with all fields

### ✓ Image Upload Support
- **Before:** Only URL input
- **After:** Local file upload to Firebase Storage

### ✓ Error Logging
- Added console logging for debugging
- Better error messages

## How to Display Products in Shop

### Step 1: Upload Product Correctly

```
Title:       ✓ Required
Description: ✓ Required
Price:       ✓ > 0
Stock:       ✓ > 0
Category:    ✓ Use dropdown (important!)
Image:       ✓ Upload file OR paste valid URL
```

### Step 2: Use Correct Category

**Must use one of these:**
- Handcrafted Decor
- Traditional Paintings
- Tribal Art
- Modern Indian Art
- Sustainable Crafts
- Jewelry & Accessories

❌ **Don't use custom categories**

### Step 3: Verify Upload

1. Go to `/artist` → "Products" tab
2. **Should see:** Your product in grid
3. **Should have:** Title, price, image
4. If not there, check console (F12) for errors

### Step 4: Check Shop Page

1. Go to `/shop`
2. **Should see:** Your product in grid
3. If not:
   - Wait 5 seconds
   - Refresh page (F5)
   - Clear cache (Ctrl+Shift+Delete)

### Step 5: Verify Filters Work

1. Click category filter
2. Your product should appear/disappear
3. Adjust price range
4. Your product should appear/disappear

## Testing Checklist

- [ ] Upload product with valid title, price, category
- [ ] Add at least one image (file or URL)
- [ ] See product in `/artist` dashboard
- [ ] Product has image displayed
- [ ] Go to `/shop`
- [ ] Product appears in grid with image
- [ ] Click product to open details
- [ ] Image displays on detail page
- [ ] Edit product successfully
- [ ] Update image successfully
- [ ] Category filter shows/hides product
- [ ] Price filter shows/hides product

## Complete Upload Workflow

### For New Product

```
1. Go to /products/new

2. Fill Details:
   - Title: "Beautiful Handmade Art"
   - Description: "This is..."
   - Price: 999
   - Stock: 5
   - Category: "Handcrafted Decor" ← Use dropdown!
   - Art Story: "..."
   - Cultural Context: "..."
   - Care Instructions: "..."

3. Add Image:
   Method A (Local File):
   - Click file upload
   - Select image from computer
   - Wait for "Images uploaded!"
   
   Method B (URL):
   - Paste image URL
   - Click "Add URL"
   - Image appears in preview

4. Submit:
   - Click "Upload Product"
   - Wait for success message
   - Redirected to /artist

5. Verify:
   - See product in /artist dashboard
   - See product in /shop
```

### For Existing Product

```
1. Go to /artist → Products tab

2. Click "Edit" on product

3. Update details as needed

4. Add/Update Images:
   - Upload new files OR
   - Paste new URLs
   - Remove old images

5. Save:
   - Click "Save Changes"
   - Wait for success
   - Redirect to /artist

6. Verify:
   - Check /shop for updates
   - Refresh if needed
```

## Database Structure

### Product Document

```json
{
  "id": "auto-generated-id",
  "title": "Product Name",
  "description": "Description text",
  "price": 999,
  "stock": 5,
  "category": "Handcrafted Decor",
  "image": "https://firebasestorage.../image.jpg",
  "images": [
    "https://firebasestorage.../image1.jpg",
    "https://firebasestorage.../image2.jpg"
  ],
  "artStory": "Story text",
  "careInstructions": "Instructions",
  "culturalContext": "Context",
  "artistId": "user-id",
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

### Shop Display Requirements

For product to show in shop:
- ✓ `image` must be valid URL
- ✓ `category` must match shop category
- ✓ `title` must be present
- ✓ `price` must be > 0
- ✓ Product must not be deleted

## Debugging

### Check API Response

1. Open DevTools (F12)
2. Go to Network tab
3. Upload product
4. Find `/products` POST request
5. Check Response tab
6. Should see:
   ```json
   {
     "id": "...",
     "title": "...",
     "image": "https://..."
   }
   ```

### Check Firestore

1. Go to Firebase Console
2. Select your project
3. Go to Firestore Database
4. Open `products` collection
5. Click on your product
6. Check fields:
   - `title` filled
   - `image` has URL
   - `category` correct
   - `price` > 0
   - `stock` > 0

### Check Browser Console

1. Press F12
2. Go to Console tab
3. Look for red errors
4. Note any error messages
5. Share in support request

## Common Problems & Solutions

### "Products Upload but Don't Show in Shop"

**Checklist:**
1. ✓ Image field has valid URL?
2. ✓ Category from dropdown list?
3. ✓ Wait 5+ seconds for sync?
4. ✓ Refresh page (F5)?
5. ✓ Check browser console?

**If still not showing:**
- Go to Firebase Console
- Check product document
- Verify all fields present
- Check for typos in category

### "Image Not Displaying"

**Cause:** Invalid image URL  
**Solutions:**
1. Check URL works in browser
2. Try different image
3. Upload local file instead
4. Use Firebase Storage URL

### "Category Not Matching"

**Cause:** Used custom category name  
**Solution:**
1. Edit product
2. Change category to one from dropdown:
   - Handcrafted Decor
   - Traditional Paintings
   - Tribal Art
   - Modern Indian Art
   - Sustainable Crafts
   - Jewelry & Accessories
3. Save

### "File Upload Not Working"

**Causes & Solutions:**
1. File too large (>5MB)
   - Compress image first
2. Wrong file type (not image)
   - Select JPG, PNG, GIF, WebP
3. Network issue
   - Check internet connection
   - Try again
4. Firebase not initialized
   - Restart browser/app

## Performance Notes

### Upload Time
- Typical: 2-5 seconds per image
- Depends on: File size, internet speed
- Larger files: Take longer

### Shop Load Time
- First load: May take 3-5 seconds
- Subsequent: Much faster (cached)
- Number of products: Doesn't matter much

### Firestore Sync
- Write: ~1-2 seconds
- Read: Instant to 2 seconds
- If taking longer: Check internet

## Next Steps

1. **Test Upload**
   - Go to `/products/new`
   - Fill in product
   - Upload image
   - Check shop

2. **Upload Multiple Products**
   - Try different categories
   - Test filters work
   - Verify all display

3. **Test Edit**
   - Go to `/artist`
   - Edit existing product
   - Change image
   - Save and verify

4. **Test Shop Features**
   - Use category filter
   - Use price range
   - Search products
   - Click to view details

## Success Indicators

You'll know it's working when:

✓ Upload product → See in `/artist` dashboard  
✓ See in `/shop` with image  
✓ Filters work correctly  
✓ Can edit and update  
✓ New products show immediately  
✓ Images display correctly  
✓ No errors in console  

## Files Changed

- `web/src/lib/storage.ts` - NEW - Firebase Storage upload
- `web/src/app/products/new/page.tsx` - Updated with file upload
- `web/src/app/products/[id]/edit/page.tsx` - Updated with file upload
- `api/main.py` - Fixed datetime serialization

## Related Documentation

- `LOCAL_FILE_UPLOAD.md` - File upload guide
- `PRODUCT_UPLOAD_FIX.md` - Upload troubleshooting
- `ARTIST_DASHBOARD_SETUP.md` - Dashboard features
- `TEST_PRODUCT_UPLOAD.md` - Testing procedures
