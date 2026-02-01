# Product Upload & Display - Troubleshooting Guide

## Issues Fixed

### 1. **Product Upload Issues**
- ✓ Fixed datetime serialization (now uses `.isoformat()`)
- ✓ Fixed product response structure
- ✓ Added error logging for debugging

### 2. **Product Update Issues**
- ✓ Fixed datetime serialization
- ✓ Preserved createdAt timestamp
- ✓ Fixed image update handling

## Why Products Might Not Display in Shop

### Reason 1: Missing Image URL
**Problem:** Product uploaded without image URL won't display
**Solution:** Always add at least one image URL when uploading

### Reason 2: Product Still Processing
**Problem:** Just uploaded, Firestore hasn't synced yet
**Solution:** Wait a few seconds and refresh the page

### Reason 3: Wrong Category
**Problem:** Uploaded with custom category, shop filters by predefined categories
**Solution:** Use one of these categories:
- Handcrafted Decor
- Traditional Paintings
- Tribal Art
- Modern Indian Art
- Sustainable Crafts
- Jewelry & Accessories

## How to Upload Products Correctly

### Step 1: Get Image URLs
You need image URLs (not local files). Use any of these:
- **Pexels:** https://pexels.com
- **Unsplash:** https://unsplash.com
- **Firebase Storage:** Upload to Firebase
- **Any public image URL**

Example URLs:
```
https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400
https://images.pexels.com/photos/3408747/pexels-photo-3408747.jpeg
```

### Step 2: Upload Product via Dashboard
1. Go to `/artist` → Click "Upload Product"
2. Fill in:
   - **Title:** Your product name
   - **Description:** What it is
   - **Price:** In rupees (₹)
   - **Stock:** How many available
   - **Category:** Pick from dropdown (very important!)
   - **Art Story:** Background/inspiration
   - **Cultural Context:** Tradition info
   - **Care Instructions:** How to care for it
3. Add images:
   - Paste image URL in "Paste image URL"
   - Click "Add Image"
   - Repeat for multiple images
4. Click "Upload Product"
5. You'll be redirected to artist dashboard

### Step 3: Check Shop Page
1. Go to `/shop`
2. Products should appear in the grid
3. If not, wait a few seconds and refresh (F5)

## Troubleshooting

### Problem: "No Products Found" in Shop

**Step 1: Check if product was saved**
1. Go to `/artist` → Click "Dashboard" tab
2. Under "Products" tab
3. Do you see your product listed?

**No?**
- Check browser console (F12)
- Look for error messages
- Check API logs for errors

**Yes?**
- Continue to Step 2

**Step 2: Check product details**
1. Click "Edit" on your product
2. Verify:
   - Title is filled
   - Image URL is there (and valid)
   - Category is selected
   - Price > 0
   - Stock > 0
3. If any are missing, fill them and Save

**Step 3: Check shop page filter**
1. Go to `/shop`
2. Check selected category (should show "All Categories" or matching category)
3. Change category filter to see if product appears

**Step 4: Check price range**
1. Go to `/shop`
2. Check price range slider
3. Make sure product price is within range

### Problem: Image Not Displaying

**The image URL might be invalid:**
```javascript
// Test if image URL works:
// Open in new tab: https://your-image-url.com/image.jpg
// Should show the image
```

**Solutions:**
1. Try a different image URL
2. Use images from Unsplash/Pexels
3. Upload to Firebase Storage and use that URL

**Valid URLs:**
✓ https://images.unsplash.com/...
✓ https://images.pexels.com/...
✓ https://cdn.example.com/image.jpg
✗ file:///C:/Users/image.jpg (local files don't work)
✗ ./images/photo.jpg (relative paths don't work)

### Problem: Product Update Image Not Working

**The image field might not be updating properly:**

**Solutions:**
1. Try uploading product again instead of editing
2. Clear browser cache (Ctrl+Shift+Delete)
3. Check console for errors
4. Ensure image URL is valid before saving

## Data Structure

### Product Document (in Firestore)
```json
{
  "id": "auto-generated",
  "title": "Product Name",
  "description": "Description",
  "price": 1500,
  "stock": 10,
  "category": "Handcrafted Decor",
  "image": "https://...",
  "images": ["https://...", "https://..."],
  "artStory": "Story",
  "careInstructions": "Instructions",
  "culturalContext": "Context",
  "artistId": "user-id",
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

## Quick Checklist

- [ ] You're logged in as artist/admin
- [ ] You have valid image URLs (not local files)
- [ ] Product has title, price, stock > 0
- [ ] Product has valid category from dropdown
- [ ] Product has at least one image URL
- [ ] Clicked "Upload Product" button
- [ ] Got success notification
- [ ] See product in `/artist` dashboard
- [ ] Product shows in `/shop`

## Testing

### Test 1: Upload a Test Product
1. Go to `/products/new`
2. Fill in:
   - Title: "Test Artwork"
   - Description: "Test product"
   - Price: 500
   - Stock: 5
   - Category: "Handcrafted Decor"
   - Image: Use this URL: 
     `https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400`
3. Click Upload
4. Go to `/shop`
5. Should see product in grid

### Test 2: Update Image
1. Go to `/artist`
2. Click Edit on a product
3. Add new image URL:
   `https://images.pexels.com/photos/3408747/pexels-photo-3408747.jpeg`
4. Click Save
5. Reload page
6. Image should be updated

### Test 3: Search and Filter
1. Go to `/shop`
2. Use category filter
3. Use price range
4. Products should filter correctly

## API Endpoints Used

### Create Product
```
POST /products
Body: {
  title, description, price, stock, category,
  image, images, artStory, careInstructions, 
  culturalContext
}
Response: { id, ...product_data }
```

### Update Product
```
PUT /products/{product_id}
Body: { title, description, price, stock, ... }
Response: { id, ...product_data }
```

### Get Products
```
GET /products
GET /products?category=...&limit=100
Response: { items: [...products], total: ... }
```

## Database Notes

- Products stored in Firestore `products` collection
- Each product gets auto-generated ID
- Images are URLs stored as strings
- Dates stored in ISO format (e.g., "2024-01-15T10:30:00")
- artistId links to user who uploaded

## Files Changed
- `api/main.py` - Fixed product creation/update endpoints

## Common Error Messages

### "Please fill all required fields"
**Solution:** Fill in: title, price, category

### "Failed to upload product: 403"
**Solution:** Make sure you're logged in as artist/admin

### "Product not found" (when editing)
**Solution:** Go back and reload `/artist` page

## Support

Check these docs:
- `ARTIST_DASHBOARD_SETUP.md` - Dashboard features
- `ADMIN_PAGES_FIXED.md` - Admin product management
- This document - Product upload troubleshooting
