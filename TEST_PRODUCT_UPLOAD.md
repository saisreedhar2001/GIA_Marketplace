# Test Product Upload - Step by Step

## Prerequisites
- ✓ API running on port 8000
- ✓ Frontend running on port 3000
- ✓ Logged in as artist/admin
- ✓ Have valid image URLs

## Test Product 1: Simple Upload

### Step 1: Go to Upload Page
```
URL: http://localhost:3000/products/new
```

### Step 2: Fill Form
```
Title: Sample Artwork
Description: This is a beautiful handcrafted piece
Price: 999
Stock: 5
Category: Handcrafted Decor  (← Important!)
Art Story: Made with love
Cultural Context: Indian traditional craft
Care Instructions: Handle with care
```

### Step 3: Add Image
Use any of these test image URLs:

**Option A (Unsplash):**
```
https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400
```

**Option B (Pexels):**
```
https://images.pexels.com/photos/3408747/pexels-photo-3408747.jpeg?auto=compress&cs=tinysrgb&w=400
```

**Option C (Another test):**
```
https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400
```

### Step 4: Complete Upload
1. Click "Add Image" button
2. Image should appear in grid below
3. Click "Upload Product" button
4. Should see: "Product uploaded successfully!"
5. Redirected to `/artist` page

## Test 2: Verify in Artist Dashboard

### Check Products Tab
1. Go to `/artist`
2. Click "Products" tab
3. **Should see:**
   - Your uploaded product in grid
   - Product title, price, stock visible
   - Edit and Delete buttons available

**If NOT visible:**
- Wait 5 seconds
- Refresh page (F5)
- Check browser console for errors

## Test 3: Verify in Shop

### Check Shop Page
1. Go to `/shop`
2. **Should see:**
   - Your product in the grid
   - Product image displaying
   - Price and category showing

**If NOT visible:**
- Check category filter matches your product category
- Check price is within range slider
- Refresh page (F5)
- Check console for errors

### Filters Test
1. In shop, select category filter
2. Your product should appear/disappear based on category
3. Adjust price range
4. Your product should appear/disappear

## Test 4: Edit Product

### Update Product
1. Go to `/artist` → Products tab
2. Click Edit on your test product
3. Change price: `1299`
4. Click "Save Changes"
5. Should see: "Product updated successfully!"
6. Redirected to `/artist`

### Verify Update
1. Go to `/shop`
2. Find your product
3. Price should now be `1299`

## Test 5: Update Image

### Add Another Image
1. Go to `/artist` → Products tab
2. Click Edit on product
3. Scroll to Images section
4. Paste another image URL:
   ```
   https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400
   ```
5. Click "Add Image"
6. Both images should show
7. Click "Save Changes"

### Verify Images
1. Go to `/shop`
2. Find product
3. Should show first image

## Test 6: Multiple Products

### Upload Second Product
Repeat Test 1 with different details:
```
Title: Another Art Piece
Price: 1500
Stock: 3
Category: Traditional Paintings  (different category!)
Image: https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400
```

### Verify Both Show
1. Go to `/artist` → Products tab
2. Should see 2 products
3. Go to `/shop`
4. Should see both products
5. Use category filter to switch between them

## Expected Results

### ✓ Success Indicators
- Upload notification appears
- Product shows in artist dashboard
- Product appears in shop
- Images display correctly
- Edit works properly
- Filters work correctly
- Multiple products show

### ✗ Failure Indicators
- No success notification
- Product not in artist dashboard
- Product not in shop (after refresh)
- Images don't display (blank)
- Edit button redirects instead of opening form
- Errors in console (F12)

## Troubleshooting Checklist

If something fails:

1. **Check API Terminal**
   - Is API still running?
   - Any error messages?
   - Restart if needed

2. **Check Browser Console**
   - Open DevTools (F12)
   - Go to Console tab
   - Any red error messages?
   - Check Network tab for failed requests

3. **Check Image URL**
   - Copy image URL to new tab
   - Does it display as image?
   - If not, use a different URL

4. **Check Category**
   - Use predefined categories only:
     - Handcrafted Decor
     - Traditional Paintings
     - Tribal Art
     - Modern Indian Art
     - Sustainable Crafts
     - Jewelry & Accessories

5. **Clear Cache**
   - DevTools → Application → Clear Storage
   - Refresh page (Ctrl+F5)
   - Try again

## Valid Test Image URLs

Here are guaranteed-to-work image URLs for testing:

### Art/Craft Images:
```
https://images.unsplash.com/photo-1560838132-92d8da301d1a?w=400
https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=400
https://images.unsplash.com/photo-1577720643272-265efb1a7e2f?w=400
https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=400
```

### Handcraft Images:
```
https://images.pexels.com/photos/3407817/pexels-photo-3407817.jpeg
https://images.pexels.com/photos/3652113/pexels-photo-3652113.jpeg
https://images.pexels.com/photos/159550/pexels-photo-159550.jpeg
```

Just paste any of these into the image URL field!

## Success Criteria

You'll know everything is working when:

✓ Upload product without errors  
✓ See product in artist dashboard  
✓ See product in shop with image  
✓ Can edit product successfully  
✓ Can update images  
✓ Category and price filters work  
✓ Multiple products display together  

## Next Steps

Once tests pass:
1. Upload real products with real images
2. Test checkout process
3. Test order management
4. Check admin panel products page
5. Verify analytics update
