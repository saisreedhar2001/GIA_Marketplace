# GIA Troubleshooting Guide

## ⚡ QUICK FIXES

### Build Error: Tailwind Plugin

**If you're seeing:**
```
Cannot find module '@tailwindcss/forms'
```

**Run this:**
```bash
clean-build.bat    # Windows
./clean-build.sh   # macOS/Linux
```

See **[FIX_TAILWIND_ERROR.md](./FIX_TAILWIND_ERROR.md)** for details.

### Network Error: Cannot Reach API

**If you're seeing:**
```
AxiosError: Network Error
```

**This means:** Backend API is not running

**Quick Fix:**
```bash
run-dev.bat    # Windows - Opens 2 terminals automatically
./run-dev.sh   # Mac/Linux - Opens 2 terminals automatically
```

**Or manually (if auto doesn't work):**
```bash
# Terminal 1: Frontend
cd web && npm run dev

# Terminal 2: Backend (IMPORTANT - NEW TERMINAL!)
cd api && python -m uvicorn main:app --reload
```

**Verify:**
- Frontend: http://localhost:3000 (should see website)
- Backend: http://localhost:8000/docs (should see API docs)

See **[FIX_NETWORK_ERROR.md](./FIX_NETWORK_ERROR.md)** or **[RUN_BOTH_SERVERS.txt](./RUN_BOTH_SERVERS.txt)** for details.

---

### Firebase Error: Invalid API Key

**If you're seeing:**
```
Firebase: Error (auth/invalid-api-key)
```

**Most likely cause:** You edited `.env.local.example` instead of creating `.env.local`

**⚠️ IMPORTANT:**
- `.env.local.example` = Template file (DON'T EDIT)
- `.env.local` = Your config file (CREATE THIS!)

**Quick Fix:**

1. **CREATE new file:** `web/.env.local` (NOT `.example`)

2. **Copy content from** `web/.env.local.example`

3. **Replace placeholders with real values from Firebase:**
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...      ← From Firebase
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...         ← From Firebase
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...          ← From Firebase
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...      ← From Firebase
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=... ← From Firebase
   NEXT_PUBLIC_FIREBASE_APP_ID=...              ← From Firebase
   NEXT_PUBLIC_API_URL=http://localhost:8000    ← Keep as is
   NEXT_PUBLIC_RAZORPAY_KEY_ID=...              ← From Razorpay
   ```

4. **Save file as:** `web/.env.local`

5. **Restart:**
   ```bash
   cd web
   rm -rf .next
   npm run dev
   ```

6. **Hard refresh:** Ctrl+Shift+R

See **[CREATE_ENV_LOCAL.md](./CREATE_ENV_LOCAL.md)** for step-by-step or **[ENV_LOCAL_VS_EXAMPLE.txt](./ENV_LOCAL_VS_EXAMPLE.txt)** for quick reference.

---

### 404 Pages Not Found

**If you're seeing:**
```
This page could not be found
404
```

On login/signup pages, do this:

```bash
cd web
rm -rf .next      # Clear cache
npm run dev       # Restart
```

Then visit: http://localhost:3000/auth/login

See **[FIX_404_PAGES.md](./FIX_404_PAGES.md)** for details.

---

## Common Issues & Solutions

### 1. Module '@tailwindcss/forms' Not Found

**Error Message:**
```
Cannot find module '@tailwindcss/forms'
```

**Status:** ✅ FIXED

**What Happened:**
- The tailwind.config.js referenced a plugin that wasn't installed
- This is optional and not needed for basic styling

**Solution Applied:**
- Removed `require('@tailwindcss/forms')` from `web/tailwind.config.js`
- Changed `plugins: [require('@tailwindcss/forms')]` to `plugins: []`
- All Tailwind styling still works without this plugin

**What to do:**
- No action needed! File has been fixed.

---

### 2. Package 'python-razorpay==1.3.0' Not Found

**Error Message:**
```
ERROR: No matching distribution found for python-razorpay==1.3.0
```

**Status:** ✅ FIXED

**What Happened:**
- Wrong package name in requirements.txt
- Should be `razorpay` not `python-razorpay`

**Solution Applied:**
- Changed `api/requirements.txt` line 4 from `python-razorpay==1.3.0` to `razorpay==1.4.1`
- Reinstall with: `pip install -r requirements.txt`

---

### 3. 'poetry' Command Not Found

**Error Message:**
```
The term 'poetry' is not recognized as a cmdlet
```

**Status:** ✅ FIXED

**What Happened:**
- Poetry package manager not installed on Windows
- Project was set up to use Poetry

**Solution Applied:**
- Created `api/requirements.txt` with all dependencies
- Updated all setup scripts to use `pip` instead of `poetry`
- Poetry is no longer required!

**What to do:**
```bash
# Just use pip (standard Python package manager)
pip install -r api/requirements.txt
```

---

### 4. Port Already in Use

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**

**Windows:**
```cmd
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with the number shown above)
taskkill /PID <PID> /F

# Or change the port
next dev -p 3001
```

**macOS/Linux:**
```bash
# Find process
lsof -i :3000

# Kill it
kill -9 <PID>

# Or change port
npm run dev -- -p 3001
```

---

### 5. npm install Fails

**Error Message:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solution:**
```bash
cd web

# Clear npm cache
npm cache clean --force

# Try install again
npm install

# If still fails, use legacy dependency resolution
npm install --legacy-peer-deps
```

---

### 6. Python Dependencies Won't Install

**Error Message:**
```
ERROR: Could not find a version that satisfies the requirement...
```

**Solution:**
```bash
cd api

# Upgrade pip first
pip install --upgrade pip

# Clear pip cache
pip cache purge

# Try install again
pip install -r requirements.txt
```

---

### 7. Firebase Credentials Error

**Error Message:**
```
firebase_admin.exceptions.InvalidCredential: Failed to initialize Firestore client
```

**Solution:**

1. **Check web/.env.local exists and has:**
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=xxx
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
   NEXT_PUBLIC_FIREBASE_APP_ID=xxx
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

2. **Check api/.env exists and has:**
   ```
   FIREBASE_PROJECT_ID=xxx
   FIREBASE_PRIVATE_KEY=xxx
   FIREBASE_CLIENT_EMAIL=xxx
   RAZORPAY_KEY_ID=xxx
   RAZORPAY_KEY_SECRET=xxx
   ```

3. **Verify credentials are correct:**
   - Go to https://console.firebase.google.com/
   - Select your project
   - Settings → Service Accounts
   - Copy credentials exactly as shown

---

### 8. API Connection Error

**Error Message:**
```
Failed to fetch from http://localhost:8000
```

**Solution:**

1. **Check backend is running:**
   ```bash
   # Terminal 2: Start the API
   cd api
   python -m uvicorn main:app --reload
   ```

2. **Verify URL is correct:**
   - Check `web/.env.local` has: `NEXT_PUBLIC_API_URL=http://localhost:8000`
   - Make sure it's `http://` not `https://`

3. **Check CORS is enabled:**
   - Backend has CORS configured for `http://localhost:3000`
   - If you changed the frontend port, update backend CORS

4. **Test the API directly:**
   ```bash
   # Visit in browser
   http://localhost:8000/health
   http://localhost:8000/docs
   ```

---

### 9. Next.js Won't Start

**Error Message:**
```
error - Failed to start server
```

**Solution:**

```bash
cd web

# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try again
npm run dev
```

---

### 10. TypeScript Errors

**Error Message:**
```
Type 'string' is not assignable to type 'never'
```

**Solution:**

This is usually a configuration issue. Try:

```bash
cd web

# Rebuild TypeScript
npm run build

# Or just clear cache and restart dev
rm -rf .next
npm run dev
```

---

## Quick Verification

Run this to check your setup:

**Windows:**
```cmd
verify-setup.bat
```

**macOS/Linux:**
```bash
chmod +x verify-setup.sh
./verify-setup.sh
```

This checks:
- ✅ Node.js installed
- ✅ Python installed  
- ✅ npm packages installed
- ✅ Python packages installed
- ✅ .env files exist

---

## Debug Mode

### Frontend
```bash
cd web
npm run dev
# Check console for errors
```

### Backend
```bash
cd api
python -m uvicorn main:app --reload --log-level debug
# Check console for errors
```

### API Documentation
```
http://localhost:8000/docs
```
Interactive API testing tool

---

## Still Stuck?

1. **Check error message carefully** - it usually tells you exactly what's wrong
2. **Read the full traceback** - scroll to the top to see the real error
3. **Google the error message** - chances are someone's solved it
4. **Check your .env files** - most issues are missing/wrong credentials
5. **Verify ports** - 3000 and 8000 must be available
6. **Restart everything** - kill servers and start fresh

---

## Files Recently Fixed

| File | Issue | Fix |
|------|-------|-----|
| `api/requirements.txt` | Wrong package name | Changed `python-razorpay` to `razorpay` |
| `web/tailwind.config.js` | Missing plugin | Removed `@tailwindcss/forms` requirement |
| `setup.bat` | Uses poetry | Changed to use pip |
| `setup.sh` | Uses poetry | Changed to use pip |
| `SETUP.md` | Poetry instructions | Updated to pip instructions |

---

## Next Steps

1. Verify setup: `verify-setup.bat` or `./verify-setup.sh`
2. Run servers: `run-dev.bat` or `./run-dev.sh`
3. Visit: `http://localhost:3000`
4. Check API: `http://localhost:8000/docs`

If you're still seeing errors, please note:
- The exact error message
- When it occurs (during setup/startup/navigation)
- Your operating system
- Python version (`python --version`)
- Node version (`node --version`)

Good luck! 🎨
