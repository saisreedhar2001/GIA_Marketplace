# Fix: Cannot find module '@tailwindcss/forms'

## Quick Solution

The error has been **FIXED** in the code. You just need to clear the cache.

### Option 1: Automatic (Easiest)

**Windows:**
```cmd
clean-build.bat
```

**macOS/Linux:**
```bash
chmod +x clean-build.sh
./clean-build.sh
```

This will:
✅ Remove .next cache
✅ Clear npm cache
✅ Reinstall dependencies
✅ Clean Python cache

---

### Option 2: Manual Steps

**Windows:**
```cmd
cd web

REM Delete cache
rmdir /s /q .next

REM Clear npm cache
npm cache clean --force

REM Reinstall
npm install

cd ..
```

**macOS/Linux:**
```bash
cd web

# Delete cache
rm -rf .next

# Clear npm cache
npm cache clean --force

# Reinstall
npm install

cd ..
```

---

## What Was Wrong

The `web/tailwind.config.js` file had:
```javascript
plugins: [
  require('@tailwindcss/forms'),  // ❌ This plugin wasn't installed
]
```

## What Was Fixed

Changed to:
```javascript
plugins: []  // ✅ No plugins needed for basic styling
```

**File already updated:** `web/tailwind.config.js` ✅

---

## After Cleaning Cache

You can safely run:

**Terminal 1:**
```bash
cd web
npm run dev
```

**Terminal 2:**
```bash
cd api
python -m uvicorn main:app --reload
```

Then visit: **http://localhost:3000** ✅

---

## Still Getting the Error?

If you still see the error after cleaning:

1. **Make sure you stopped the dev server** (Ctrl+C)
2. **Run the clean script again**
3. **Make sure Node.js is up to date:**
   ```bash
   node --version  # Should be 18+
   npm --version   # Should be 8+
   ```
4. **Try in a fresh terminal window**

---

## What Happened?

- ✅ Code was fixed (tailwind.config.js)
- ✅ But Node.js cached the old version
- ✅ Clearing cache fixes the issue
- ✅ Now it can build successfully

---

## Next Steps

1. Run `clean-build.bat` or `./clean-build.sh`
2. Wait for it to finish
3. Start your dev servers
4. Visit http://localhost:3000

**Done!** 🎉
