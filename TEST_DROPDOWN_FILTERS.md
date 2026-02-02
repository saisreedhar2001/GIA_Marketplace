# Test Dropdown Filters - Quick Guide

## ⚡ 3-Minute Test

### Step 1: Start Server
```bash
cd web
npm run dev
```

### Step 2: Open Shop
Browser → `http://localhost:3000/shop`

### Step 3: Toggle Mobile
Press: `F12` → `Ctrl+Shift+M`
Select: `iPhone 12`

### Step 4: Test Dropdown
1. See `[Filters ▼]` button
2. Click it
3. See `[Filters ▲]` (arrow rotates up)
4. See categories appear
5. Click a category
6. See dropdown auto-close
7. Products update below

**Done!** ✅

---

## 📱 What to Expect

### Collapsed State
```
┌─────────────────┐
│ [Filters  ▼]    │ ← Tap here
└─────────────────┘
│ Product 1       │
│ Product 2       │
│ Product 3       │
```

### Expanded State
```
┌─────────────────┐
│ [Filters  ▲]    │
├─────────────────┤
│ ✓ All           │
│   Decor         │
│   Paintings     │
│   Tribal        │
│   Modern        │
│   Crafts        │
│   Jewelry       │
├─────────────────┤
│ Price Range     │
│ [▬▬▬▬▬]        │
└─────────────────┘
```

### After Selection
```
┌─────────────────┐
│ [Filters  ▼]    │ ← Auto-closed
└─────────────────┘
│ Product 1       │ ← Updated
│ Product 2       │
```

---

## ✅ Checklist

Mobile (iPhone 12):
- [ ] `[Filters ▼]` button visible
- [ ] Can click it
- [ ] Dropdown opens
- [ ] Arrow rotates up
- [ ] Categories show
- [ ] Price slider visible
- [ ] Can select category
- [ ] Dropdown auto-closes
- [ ] Arrow rotates down
- [ ] Products update
- [ ] Can click again

Desktop (Resize to 1200px):
- [ ] Dropdown gone
- [ ] Sidebar shows
- [ ] Original layout works
- [ ] Filters always visible

---

## 🎯 Test Scenarios

### Scenario 1: Basic Filter
1. Click `[Filters ▼]`
2. Click "Tribal Art"
3. Dropdown closes
4. Products show only Tribal Art

### Scenario 2: Price Filter
1. Click `[Filters ▼]`
2. Drag price slider
3. Dropdown still open (price doesn't auto-close)
4. Click category to close

### Scenario 3: Multiple Filters
1. Select "Traditional Paintings"
2. Click `[Filters ▼]` again
3. Adjust price slider
4. Click "All" to reset
5. Products update

### Scenario 4: Responsive
1. Start at 390px (mobile)
2. Slowly resize to 1024px
3. At 1024px, dropdown should disappear
4. Sidebar should appear
5. Resize back - dropdown returns

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Button not showing | Check mobile mode (F12 + Ctrl+Shift+M) |
| Arrow doesn't rotate | Check browser console for errors |
| Dropdown doesn't open | Refresh page (Ctrl+F5) |
| Products don't update | Check API connection |
| Sidebar shows on mobile | Browser cache - clear it |
| Styles look weird | DevTools → Settings → Disable cache |

---

## 🔧 Debug Tips

**Check Console (F12 → Console)**
```
- No errors should appear
- filtersOpen state should toggle
- Category clicks should work
```

**Check Network (F12 → Network)**
```
- Products API should be called
- No 404 errors
- Response should be fast
```

**Check Mobile Simulation**
```
F12 → Device Toolbar
Shows real mobile layout
Can test at different sizes
```

---

## 📊 Size Tests

Try these widths:
- **375px** (iPhone SE) - Dropdown
- **390px** (iPhone 12) - Dropdown
- **430px** (iPhone 14) - Dropdown
- **768px** (iPad) - Dropdown
- **1024px** (Tablet) - **Switches to Sidebar**
- **1920px** (Desktop) - Sidebar

---

## 🎬 Recording a Test

**If reporting an issue:**

1. Open DevTools (F12)
2. Click the Record button in Performance tab
3. Click `[Filters ▼]`
4. Select a category
5. Stop recording
6. Share the performance graph

Or just describe:
- What device size
- What you clicked
- What happened
- What should happen

---

## 📱 Real Device Test

If you have a phone:

1. Start dev server: `npm run dev`
2. In terminal: `ngrok http 3000`
3. Copy the URL from ngrok
4. Open on phone
5. Tap `[Filters ▼]`
6. Test dropdown
7. Select categories
8. Watch it work!

---

## ✨ Expected Behavior

| Action | Result |
|--------|--------|
| Click button | Dropdown opens, arrow rotates |
| Click category | Products filter, dropdown closes |
| Adjust price | Products filter, dropdown stays open |
| Click category | Dropdown closes (auto) |
| Resize to desktop | Dropdown hides, sidebar shows |
| Resize to mobile | Sidebar hides, dropdown shows |

---

## 🎯 Success Criteria

✅ **Mobile (< 1024px)**
- Dropdown button works
- Categories filter products
- Dropdown auto-closes on selection
- Price slider works
- Full-width products shown

✅ **Desktop (≥ 1024px)**
- Sidebar shows (not dropdown)
- Original behavior preserved
- All filters visible
- Responsive layout works

✅ **No Errors**
- Console clean
- Network calls successful
- No layout shifts
- Smooth animations

---

## 🚀 Final Test

**Run this in DevTools Console:**
```javascript
// Check if shop page loaded
console.log(document.title);

// Check if button exists
console.log(document.querySelector('button:contains("Filters")'));

// Check responsive
console.log(window.innerWidth);
```

---

## 📞 Issues?

**Check these files for details:**
- `SHOP_PAGE_MOBILE_UPDATE.md` - Technical details
- `DROPDOWN_FILTERS_VISUAL.md` - Visual guide
- `SHOP_FILTERS_COMPLETE.md` - Complete docs

**Quick checklist:**
1. `npm run dev` works
2. Page loads
3. Mobile mode active
4. Dropdown visible
5. Can click it

---

## 🎉 You're All Set!

Everything is ready. Just:
1. Run `npm run dev`
2. Open shop page
3. Toggle mobile view
4. Test the dropdown

**That's it!** 📱✨

---

**Happy Testing!**
