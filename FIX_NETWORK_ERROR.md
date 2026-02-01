# Fix: Network Error - Cannot Reach API

## The Problem

You're seeing:
```
AxiosError: Network Error
```

This means the **backend API is not running**.

## The Solution

You need **TWO servers running**:

1. **Frontend** - Port 3000 (Next.js)
2. **Backend** - Port 8000 (FastAPI)

---

## How to Start Both Servers

### Option 1: Automatic (Easiest)

**Windows:**
```cmd
run-dev.bat
```

**macOS/Linux:**
```bash
chmod +x run-dev.sh
./run-dev.sh
```

This opens two terminal windows automatically.

---

### Option 2: Manual (More Control)

**Terminal 1 - Frontend:**
```bash
cd web
npm run dev
```
This starts at: http://localhost:3000

**Terminal 2 - Backend (in a NEW terminal):**
```bash
cd api
python -m uvicorn main:app --reload
```
This starts at: http://localhost:8000

---

## Verify Both Are Running

### Check Frontend
Visit: http://localhost:3000

Should see the home page

### Check Backend
Visit: http://localhost:8000/docs

Should see interactive API documentation

---

## Common Mistakes

### ❌ Only Frontend Running
Result: Network errors when loading data
Fix: Start backend too (Terminal 2)

### ❌ Only Backend Running
Result: Cannot access website
Fix: Start frontend too (Terminal 1)

### ❌ Using Wrong Port
Result: Cannot connect
Fix: Make sure frontend is 3000, backend is 8000

### ❌ Stopped Backend Without Restarting
Result: Intermittent network errors
Fix: Restart the backend server

---

## What Each Server Does

### Frontend (Port 3000)
- Displays the website
- Shows pages and buttons
- Handles user interactions
- Makes requests to API

### Backend (Port 8000)
- Handles API requests
- Connects to Firebase
- Processes payments
- Manages data
- Provides API documentation

---

## If Both Are Running But Still Getting Error

1. **Check console logs:**
   - Frontend: Any error messages?
   - Backend: Any error messages?

2. **Check environment variables:**
   - Is `NEXT_PUBLIC_API_URL=http://localhost:8000` set?
   - Are .env files correct?

3. **Verify connectivity:**
   ```bash
   # From another terminal, test API
   curl http://localhost:8000/health
   ```
   Should return: `{"status":"healthy","service":"GIA API"}`

4. **Check Firebase credentials:**
   - Are .env files filled with correct values?
   - Do credentials work? (Try in Firebase Console)

---

## Restart Both Servers

If you're not sure if they're still running:

1. Press **Ctrl+C** in both terminals to stop them
2. Wait 2 seconds
3. Start them again:
   - Terminal 1: `cd web && npm run dev`
   - Terminal 2: `cd api && python -m uvicorn main:app --reload`

---

## What Should Happen

When both servers are running:

1. ✅ http://localhost:3000 loads the website
2. ✅ http://localhost:8000/docs shows API docs
3. ✅ Home page loads featured products
4. ✅ No "Network Error" messages
5. ✅ You can navigate and interact

---

## Typical Setup Flow

```
Terminal 1                          Terminal 2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cd web                              cd api
npm run dev                         python -m uvicorn main:app --reload
                ↓                                    ↓
        Frontend Ready                      Backend Ready
        http://localhost:3000               http://localhost:8000
                                           
        User opens browser
        Website loads ✓
        Clicks "Shop"
        Frontend requests data from API ✓
        Backend returns data ✓
        Website shows products ✓
```

---

## Remember

- **Frontend alone** = Blank pages or "Network Error"
- **Backend alone** = Cannot access website
- **Both running** = Everything works! ✅

---

## Need Help?

- **Still getting errors?** Check TROUBLESHOOTING.md
- **Can't start servers?** Check SETUP.md
- **Want to verify setup?** Run `verify-setup.bat` or `./verify-setup.sh`

---

## Next Steps

1. ✅ Make sure both servers are running
2. ✅ Visit http://localhost:3000
3. ✅ Check for errors in console
4. ✅ If errors persist, check TROUBLESHOOTING.md

**Solution: Two terminals, two commands, everything works!** 🎉
