# How to Create .env.local File

## ⚠️ IMPORTANT

There are TWO files:
1. **`.env.local.example`** - Template (don't edit this!)
2. **`.env.local`** - Your actual config (CREATE THIS!)

---

## The Problem

You're looking at:
```
web/.env.local.example  ❌ This is just a template
```

You need to create:
```
web/.env.local          ✅ This is what Node.js reads
```

---

## Solution: Create .env.local File

### Option 1: Using Text Editor (Easiest)

1. Open a text editor (Notepad, VS Code, etc.)
2. Create new file with this content:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=fir-gia-95889
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

NEXT_PUBLIC_API_URL=http://localhost:8000

NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
```

3. **Save as:** `web/.env.local` (NOT `.env.local.example`!)
4. Location: `d:\Artroom\web\.env.local`
5. Replace `your_xxx` with actual values from Firebase

---

### Option 2: Copy from Template (Windows Command Line)

```cmd
cd d:\Artroom\web
copy .env.local.example .env.local
```

Then edit `web/.env.local` and fill in your real values.

---

### Option 3: Copy from Template (Mac/Linux)

```bash
cd web
cp .env.local.example .env.local
```

Then edit `web/.env.local` and fill in your real values.

---

## What Goes In Each Value?

| Variable | Where to Find | Example |
|----------|---------------|---------|
| NEXT_PUBLIC_FIREBASE_API_KEY | Firebase Console → Project Settings → Web Config | AIzaSyD... |
| NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN | Firebase Console → Project Settings → Web Config | my-project.firebaseapp.com |
| NEXT_PUBLIC_FIREBASE_PROJECT_ID | Firebase Console → Project Settings | fir-gia-95889 |
| NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET | Firebase Console → Project Settings → Web Config | my-project.appspot.com |
| NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID | Firebase Console → Project Settings → Web Config | 123456789 |
| NEXT_PUBLIC_FIREBASE_APP_ID | Firebase Console → Project Settings → Web Config | 1:123456789:web:abc123def456 |
| NEXT_PUBLIC_API_URL | Keep as is | http://localhost:8000 |
| NEXT_PUBLIC_RAZORPAY_KEY_ID | Razorpay Dashboard → Settings → API Keys | rzp_test_xxx |

---

## File Locations

### Windows
```
d:\Artroom\web\.env.local.example    ← Template (don't touch)
d:\Artroom\web\.env.local            ← CREATE THIS FILE!
```

### Mac/Linux
```
./web/.env.local.example    ← Template (don't touch)
./web/.env.local            ← CREATE THIS FILE!
```

---

## Complete Example

Here's what `web/.env.local` should look like when filled in:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD1234567890abcdefghijklmnopqrstuv
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=fir-gia-95889.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=fir-gia-95889
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=fir-gia-95889.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:1a2b3c4d5e6f7g8h

NEXT_PUBLIC_API_URL=http://localhost:8000

NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_1a2b3c4d5e6f7g
```

---

## Verify File Exists

### Windows Command Prompt
```cmd
dir web\.env.local
```

Should show: `web/.env.local` exists

### Mac/Linux Terminal
```bash
ls -la web/.env.local
```

Should show: `-rw-r--r--  web/.env.local`

---

## Do NOT Edit .env.local.example

The `.env.local.example` file is a **template**. It helps other developers know what variables are needed.

**It's in `.gitignore` so it won't sync, but you still shouldn't edit it.**

Instead:
1. Copy it to `.env.local`
2. Edit `.env.local` with your actual values
3. Keep `.env.local` private (in `.gitignore`)

---

## After Creating .env.local

1. **Clear cache:**
   ```bash
   rm -rf web/.next       # Mac/Linux
   rmdir /s /q web\.next  # Windows
   ```

2. **Restart frontend:**
   ```bash
   cd web
   npm run dev
   ```

3. **Hard refresh:**
   Press: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

4. **Visit:**
   http://localhost:3000

---

## Checklist

Before restarting:

- [ ] File exists: `web/.env.local` (NOT `.example`)
- [ ] Contains 8 values
- [ ] All values filled (no placeholders like `your_xxx`)
- [ ] Values copied from Firebase Console
- [ ] No typos
- [ ] File saved
- [ ] Cache cleared: `rm -rf web/.next`

---

## Still Getting Firebase Error?

After creating `.env.local`:

1. Did you clear cache? `rm -rf web/.next`
2. Did you restart? `npm run dev`
3. Did you hard refresh? `Ctrl+Shift+R`
4. Are all 8 values present?
5. Are values from Firebase Console (not service account)?

If still failing → See [FIX_FIREBASE_ERROR.md](./FIX_FIREBASE_ERROR.md)

---

## IMPORTANT: Don't Commit .env.local

The file `web/.env.local`:
- Contains your API keys (secrets!)
- Should NEVER be committed to git
- Is already in `.gitignore`
- Keep it local only

Only `.env.local.example` should be in git (as template).

---

## Summary

| File | Purpose | Edit? |
|------|---------|-------|
| `.env.local.example` | Template | ❌ NO |
| `.env.local` | Your actual config | ✅ YES |

**You need:** `.env.local` with your real Firebase credentials

---

## Next Steps

1. Create `web/.env.local` file
2. Copy content from `.env.local.example`
3. Replace `your_xxx` with actual Firebase values
4. Save file
5. Run: `rm -rf web/.next && npm run dev`
6. Visit: http://localhost:3000 ✅

**Should work now!** 🎉
