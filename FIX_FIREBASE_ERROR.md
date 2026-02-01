# Fix: Firebase Error - Invalid API Key

## Problem
You're seeing:
```
Firebase: Error (auth/invalid-api-key)
```

## Reason
The `NEXT_PUBLIC_FIREBASE_API_KEY` in `web/.env.local` is either:
- ❌ Missing
- ❌ Wrong value
- ❌ Not loaded

---

## Solution - Check Your Credentials

### Step 1: Verify web/.env.local Exists

File location: `d:\Artroom\web\.env.local`

It should exist and contain:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx
```

✅ All 8 values must be present!

---

### Step 2: Get Fresh Firebase Credentials

1. Go to: https://console.firebase.google.com/
2. Select your project
3. Click ⚙️ **Project Settings** (gear icon, top left)
4. Go to **PROJECT SETTINGS** tab
5. Scroll down to **Your apps** section
6. Find your web app (or create one)
7. Copy the entire config:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",                    ← COPY THIS
  authDomain: "your-project.firebaseapp.com",  ← COPY THIS
  projectId: "your-project-id",                ← COPY THIS
  storageBucket: "your-project.appspot.com",   ← COPY THIS
  messagingSenderId: "123456789",              ← COPY THIS
  appId: "1:123456789:web:abc123def456"        ← COPY THIS
};
```

---

### Step 3: Update web/.env.local

Open `web/.env.local` and make sure ALL values match:

| .env.local Key | Firebase Config Key | Example |
|---|---|---|
| NEXT_PUBLIC_FIREBASE_API_KEY | apiKey | AIzaSyDxxx... |
| NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN | authDomain | project.firebaseapp.com |
| NEXT_PUBLIC_FIREBASE_PROJECT_ID | projectId | my-project-id |
| NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET | storageBucket | my-project.appspot.com |
| NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID | messagingSenderId | 123456789 |
| NEXT_PUBLIC_FIREBASE_APP_ID | appId | 1:123456789:web:abc123 |

**Make sure values match EXACTLY!**

---

### Step 4: Restart Frontend

```bash
cd web

# Clear cache
rm -rf .next          # Mac/Linux
rmdir /s /q .next     # Windows

# Restart
npm run dev
```

---

### Step 5: Verify

Visit: http://localhost:3000

Should load without Firebase errors! ✅

---

## Common Mistakes

❌ **Copied wrong credentials**
- Make sure you copied from "Web app config"
- NOT from "Service Account" (that's for backend)

❌ **Missing values**
- All 6 Firebase values must be present
- Plus API_URL and RAZORPAY_KEY_ID

❌ **Typos in values**
- Copy-paste exactly, watch for spaces
- Don't manually type

❌ **Didn't restart**
- Must restart `npm run dev` after changing .env
- Environment variables only load at startup

❌ **Wrong file edited**
- Make sure you edited: `web/.env.local`
- NOT: `web/.env.local.example`

---

## Quick Checklist

- [ ] File exists: `web/.env.local`
- [ ] Contains 8 values (6 Firebase + API_URL + Razorpay)
- [ ] All values copied from Firebase Console
- [ ] No missing or blank values
- [ ] No typos or extra spaces
- [ ] Ran: `rm -rf .next` (Mac/Linux) or `rmdir /s /q .next` (Windows)
- [ ] Restarted: `npm run dev`
- [ ] Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

## Still Not Working?

### Check 1: What's in your file?

Open `web/.env.local` and verify:
```bash
cat web/.env.local    # Mac/Linux
type web\.env.local   # Windows
```

Should show 8 lines with actual values (not "your_xxx" placeholders).

### Check 2: Verify Firebase Project

1. Go to https://console.firebase.google.com/
2. Check: Is your project showing?
3. Check: Do you have a Web app created?
4. Check: Are credentials visible?

### Check 3: Check Browser Console

Press F12 → Console tab

Look for:
- **Detailed error message** (might tell you which value is wrong)
- Check Network tab → Look for any 401/403 errors

### Check 4: Try a Different Browser

Clear all cookies and cache:
- Open in Incognito/Private window
- Visit http://localhost:3000

---

## Need Help Getting Credentials?

See: **[GET_FIREBASE_CREDENTIALS.md](./GET_FIREBASE_CREDENTIALS.md)**

It has detailed step-by-step with screenshots showing:
- Where to find Firebase Console
- How to locate Your apps section
- How to copy web config
- Where each value goes

---

## File Locations

| File | Location | Purpose |
|------|----------|---------|
| web/.env.local | `d:\Artroom\web\.env.local` | Frontend config (CREATE THIS!) |
| web/.env.local.example | `d:\Artroom\web\.env.local.example` | Template (don't edit) |
| api/.env | `d:\Artroom\api\.env` | Backend config (different file!) |

**Important:** Editing `.env.local.example` won't work! Must create actual `.env.local` file!

---

## Next Steps

1. Go to Firebase Console
2. Copy fresh web app credentials
3. Update `web/.env.local` with correct values
4. Run: `rm -rf .next && npm run dev`
5. Visit: http://localhost:3000
6. Error should be gone! ✅

---

## Still Stuck?

Try this diagnostic:

1. **Verify file exists:**
   ```bash
   ls -la web/.env.local     # Mac/Linux
   dir web\.env.local        # Windows
   ```
   Should show the file exists

2. **Verify values:**
   ```bash
   cat web/.env.local        # Mac/Linux
   type web\.env.local       # Windows
   ```
   Should show actual values, not placeholders

3. **Verify no spaces:**
   - No spaces around `=`
   - No trailing spaces after values
   - Example: `KEY=value` (not `KEY = value`)

4. **Verify Firebase project:**
   - Can you log in to Firebase Console?
   - Can you see your project?
   - Can you see the web app?

If all above checked and still failing → Check browser console (F12) for exact error message, then search for that specific error.

---

**Once fixed, auth/signup/shop will all work!** 🎉
