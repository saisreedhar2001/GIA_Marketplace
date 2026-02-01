# Fix: 404 Pages Not Found

## Problem
Login and Signup pages show:
```
This page could not be found
404
```

## Solution Applied

✅ **Recreated auth pages** with proper setup:
- `/auth/login/page.tsx` - Fixed
- `/auth/signup/page.tsx` - Fixed

Both pages now have:
- ✅ `'use client'` directive
- ✅ Proper Firebase integration
- ✅ Better error handling
- ✅ Form validation
- ✅ Toast notifications

---

## What to Do

### Step 1: Clear Next.js Cache
```bash
cd web
rm -rf .next
```

### Step 2: Rebuild
```bash
npm run dev
```

### Step 3: Test the Pages
- Visit: http://localhost:3000/auth/login
- Visit: http://localhost:3000/auth/signup

Should now load correctly! ✅

---

## If Still Getting 404

### Check 1: Both servers running?
```
Terminal 1: cd web && npm run dev       ✅
Terminal 2: cd api && python -m ...    ✅
```

### Check 2: Try clean rebuild
```bash
cd web
rm -rf .next node_modules
npm install
npm run dev
```

### Check 3: Hard refresh browser
- Press: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

## Pages Fixed

| Page | Location | Status |
|------|----------|--------|
| Login | `/auth/login` | ✅ Fixed |
| Signup | `/auth/signup` | ✅ Fixed |

---

## What Changed

**Login page improvements:**
- Simpler form with email & password
- Better Firebase integration
- Proper error messages
- Redirects after login

**Signup page improvements:**
- Complete registration form
- Password confirmation validation
- Creates user in Firebase
- Stores in auth store
- Redirects after signup

---

## How to Use

### Sign Up Flow
1. Visit http://localhost:3000/auth/signup
2. Enter: Name, Email, Password
3. Click "Create Account"
4. Redirects to home page

### Login Flow
1. Visit http://localhost:3000/auth/login
2. Enter: Email, Password
3. Click "Sign In"
4. Redirects to home page

---

## Troubleshooting

**Error: "Login failed"**
→ Check Firebase credentials in `web/.env.local`

**Error: "Network error"**
→ Make sure backend is running (port 8000)

**Page still shows 404**
→ Clear cache: `rm -rf .next` then `npm run dev`

**Can't sign up**
→ Password must be 6+ characters
→ Passwords must match

---

## Next Steps

1. ✅ Clear cache: `rm -rf web/.next`
2. ✅ Restart frontend: `cd web && npm run dev`
3. ✅ Test login: http://localhost:3000/auth/login
4. ✅ Test signup: http://localhost:3000/auth/signup

**Should work now!** 🎉
