# GIA - Common Questions & Answers

## Setup & Installation

### Q: Do I need to install anything else?
**A:** No. Just Node.js, Python, and the dependencies (which setup scripts handle).

### Q: How long does setup take?
**A:** 15-20 minutes total:
- Setup script: 5 minutes
- Configure .env files: 5 minutes
- Start servers: 1 minute
- Verify it works: 5 minutes

### Q: What if setup.bat fails?
**A:** Try these in order:
1. Make sure Node.js is installed: `node --version`
2. Make sure Python is installed: `python --version`
3. Clear cache: `clean-build.bat`
4. Try setup again

---

## Running the Project

### Q: Do I need two terminals?
**A:** Yes! **You MUST have two terminals open:**
- Terminal 1: Frontend (`cd web && npm run dev`)
- Terminal 2: Backend (`cd api && python -m uvicorn main:app --reload`)

Both must be running simultaneously.

### Q: Why do I get "Network Error"?
**A:** The backend is not running. Make sure you have two terminals with both servers running (see above).

### Q: Can I use one terminal?
**A:** Only if you use `run-dev.bat` (Windows) or `./run-dev.sh` (Mac/Linux) - these open two terminals automatically.

### Q: Can I run both in one terminal?
**A:** You could use `npm run dev & python -m uvicorn main:app --reload`, but it's harder to control. Two terminals is easier.

---

## Environment Variables

### Q: Where do I get Firebase credentials?
**A:** From https://console.firebase.google.com/:
1. Create a project
2. Go to Project Settings
3. Copy Web credentials for `web/.env.local`
4. Download service account JSON for `api/.env`

### Q: Where do I get Razorpay keys?
**A:** From https://dashboard.razorpay.com/:
1. Go to Settings → API Keys
2. Copy Test Key ID and Secret
3. Add to both `.env` files

### Q: What if my .env is wrong?
**A:** You'll see Firebase or Razorpay errors. Check the values match your accounts exactly.

### Q: Can I hardcode values instead of .env?
**A:** No. Environment variables are for security. Never commit actual credentials to git.

---

## Database & Data

### Q: Where does data go?
**A:** Firebase Firestore. You manage it in https://console.firebase.google.com/

### Q: How do I add products?
**A:** Either:
1. Use Firebase Console UI
2. Use the API endpoints

See "Add Sample Data" section in START_HERE.md

### Q: Do I need sample data to test?
**A:** No. The site works without data - products list will just be empty.

### Q: How do I see what's in the database?
**A:** Go to https://console.firebase.google.com/ and browse Firestore collections.

---

## Errors & Troubleshooting

### Q: "Cannot find module '@tailwindcss/forms'"
**A:** Run: `clean-build.bat` (Windows) or `./clean-build.sh`

See: FIX_TAILWIND_ERROR.md

### Q: "AxiosError: Network Error"
**A:** Backend is not running. Start both servers (2 terminals):
- Terminal 1: `cd web && npm run dev`
- Terminal 2: `cd api && python -m uvicorn main:app --reload`

See: FIX_NETWORK_ERROR.md

### Q: "Port 3000 already in use"
**A:** Kill the process or use different port:
```bash
npm run dev -- -p 3001
```

### Q: "No such file or directory"
**A:** You're in the wrong directory. Run commands from the Artroom folder.

### Q: It says "Python not found"
**A:** Install Python from https://www.python.org/

### Q: It says "Node not found"
**A:** Install Node.js from https://nodejs.org/

---

## Features & Functionality

### Q: What pages are included?
**A:** 13 pages:
- Home, Shop, Product Detail, Cart, Checkout
- Auth (Login/Signup), Profile, Orders
- Art Room, Magazine, Work With Us
- Categories, Admin Dashboard

See README.md for details.

### Q: Does it have payment integration?
**A:** Yes, Razorpay. Works in test mode automatically.

### Q: Can I modify the design?
**A:** Yes! Edit `web/tailwind.config.js` for colors/fonts, or `.tsx` files for content.

### Q: Can I add new pages?
**A:** Yes! Create new file in `web/src/app/[name]/page.tsx`

### Q: Can I add new API endpoints?
**A:** Yes! Add to `api/main.py`

---

## Code & Customization

### Q: What language is the frontend?
**A:** TypeScript (JavaScript with types)

### Q: What language is the backend?
**A:** Python (FastAPI)

### Q: Can I change the database?
**A:** Yes, but requires rewriting data access code in `api/firebase_service.py`

### Q: Can I change the payment provider?
**A:** Yes, edit `api/razorpay_service.py` to use a different provider

### Q: How do I deploy?
**A:** See DEPLOYMENT.md

---

## Performance & Optimization

### Q: Is it fast?
**A:** Yes. Next.js handles caching, Firebase is optimized. Plenty fast for small-medium traffic.

### Q: Will it scale?
**A:** Firestore auto-scales. Backend can handle reasonable traffic. For millions of users, you'd need optimization.

### Q: How do I make it faster?
**A:** 
- Use Firebase CDN for images
- Enable caching in Next.js
- Optimize database queries
- Deploy to production (not localhost)

---

## Deployment

### Q: How do I go live?
**A:** Follow DEPLOYMENT.md:
1. Deploy frontend to Vercel
2. Deploy backend to Railway/Render
3. Configure custom domain
4. Set Firebase security rules

### Q: How much does hosting cost?
**A:** 
- Vercel: Free tier available
- Railway: From $5/month
- Firebase: Free tier, then usage-based
- Total: Can run free-to-cheap

### Q: How do I add a custom domain?
**A:** See DEPLOYMENT.md - it explains DNS setup for both frontend and backend

---

## Support & Documentation

### Q: Where's the documentation?
**A:** 14 files in the root:
- START_HERE.md - Quick start
- SETUP.md - Detailed help
- TROUBLESHOOTING.md - Error fixes
- And many more...

Start with: **START_HERE.md**

### Q: Can I modify the docs?
**A:** Yes! They're markdown files. Edit them in any text editor.

### Q: Is there a video guide?
**A:** No, but the written guides are comprehensive.

### Q: Who do I contact for help?
**A:** Check the documentation first. Most questions are answered there.

---

## Project Status

### Q: Is the code production-ready?
**A:** Yes! It's clean, typed, documented, and ready to use as-is or customize.

### Q: Are there bugs?
**A:** Not that I know of. All common issues have been fixed and documented.

### Q: Can I use this commercially?
**A:** Yes! MIT License - use however you want.

### Q: Is it secure?
**A:** Yes. Firebase Auth + Firestore security rules. Razorpay is PCI-DSS compliant.

---

## Next Steps

### Just starting?
→ Read **START_HERE.md**

### Already running?
→ Check **TROUBLESHOOTING.md** if issues
→ Add data via Firebase Console
→ Start customizing!

### Ready to deploy?
→ Read **DEPLOYMENT.md**

### Need something specific?
→ See **INDEX.md** for all docs

---

## Quick Links

| Purpose | File |
|---------|------|
| Getting started | START_HERE.md |
| 5-min setup | QUICKSTART.md |
| Detailed help | SETUP.md |
| Error fixes | TROUBLESHOOTING.md, FIX_NETWORK_ERROR.md, FIX_TAILWIND_ERROR.md |
| Architecture | README.md |
| Deploy | DEPLOYMENT.md |
| QA checklist | CHECKLIST.md |
| Commands | QUICK_REFERENCE.txt |
| Navigation | INDEX.md |
| This file | COMMON_QUESTIONS.md |

---

**Still have questions?** Check the other documentation files above!

Good luck! 🎨
