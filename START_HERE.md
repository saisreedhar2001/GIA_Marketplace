# 🎨 GIA - Great India Arts
## Start Here

Welcome to the complete GIA marketplace! This document guides you through getting started.

---

## 📋 What You Have

A **full-stack Indian art marketplace** with:

✅ **Frontend** - Beautiful Next.js site with Indian aesthetic  
✅ **Backend** - FastAPI with Firebase & Razorpay integration  
✅ **Database** - Firestore with pre-designed schema  
✅ **Authentication** - Firebase Auth with roles  
✅ **Payments** - Razorpay integration  
✅ **Admin Dashboard** - Content management system  

---

## 🚀 Quick Start (Choose Your OS)

### Windows
```cmd
cd d:\Artroom
setup.bat
```

### macOS/Linux
```bash
cd /path/to/Artroom
chmod +x setup.sh
./setup.sh
```

This installs all dependencies automatically.

---

## 🔐 Configure Environment (5 minutes)

### Step 1: Firebase Project
1. Go to https://console.firebase.google.com/
2. Create project: "gia-marketplace"
3. Enable: Authentication (Email/Password), Firestore, Storage
4. Get your credentials from Project Settings

### Step 2-4: Configure .env Files

**SEE: [GET_FIREBASE_CREDENTIALS.md](./GET_FIREBASE_CREDENTIALS.md)**

This guide explains:
- Where to get each value
- How to extract from serviceAccount.json
- How to find Firebase web config
- Where to get Razorpay keys

### Quick Template

**web/.env.local:**
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_RAZORPAY_KEY_ID=test_key_id
```

**api/.env:**
```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=paste_from_service_account_json
FIREBASE_CLIENT_EMAIL=your_email@appspot.gserviceaccount.com
RAZORPAY_KEY_ID=test_key_id
RAZORPAY_KEY_SECRET=test_key_secret
API_PORT=8000
ENVIRONMENT=development
```

👉 **Need detailed steps?** → Read [GET_FIREBASE_CREDENTIALS.md](./GET_FIREBASE_CREDENTIALS.md)

---

## ▶️ Run Servers

### Option A: Automatic (Windows)
```cmd
run-dev.bat
```

### Option B: Automatic (macOS/Linux)
```bash
chmod +x run-dev.sh
./run-dev.sh
```

### Option C: Manual (Any OS)

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

---

## 🌐 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **Website** | http://localhost:3000 | User interface |
| **API** | http://localhost:8000 | Backend API |
| **API Docs** | http://localhost:8000/docs | Interactive API documentation |

---

## ⚠️ Important: Both Servers Must Be Running!

**The website needs TWO servers running at the same time:**

1. **Frontend** (Terminal 1) - `cd web && npm run dev`
2. **Backend** (Terminal 2) - `cd api && python -m uvicorn main:app --reload`

If you only run one, you'll get "Network Error" messages.

See **[FIX_NETWORK_ERROR.md](./FIX_NETWORK_ERROR.md)** if you're getting this error.

---

## 🎯 What to Test First

1. ✅ Both servers running (2 terminals)
2. ✅ Homepage loads at http://localhost:3000
3. ✅ Can sign up at `/auth/signup`
4. ✅ Can log in at `/auth/login`
5. ✅ Can view `/shop` (empty until data added)
6. ✅ API docs works at http://localhost:8000/docs

---

## 📊 Add Sample Data

### Via Firebase Console

1. Go to https://console.firebase.google.com/
2. Select your project
3. Open Firestore Database
4. Create collection: `products`
5. Add document:

```json
{
  "title": "Kalamkari Painting",
  "description": "Traditional hand-painted Kalamkari art",
  "price": 5000,
  "image": "https://via.placeholder.com/400x300",
  "category": "Traditional Paintings",
  "artistId": "demo",
  "artStory": "A beautiful piece of traditional art",
  "careInstructions": "Keep away from direct sunlight",
  "culturalContext": "Kalamkari is an ancient art form",
  "stock": 10,
  "featured": true
}
```

Now `/shop` will show your product!

---

## 📁 Key Files & Folders

```
Artroom/
├── web/                          # Frontend (Next.js)
│   ├── src/app/                  # Pages
│   ├── src/components/           # React components
│   ├── src/lib/                  # Firebase, API
│   └── src/store/                # State management
├── api/                          # Backend (FastAPI)
│   ├── main.py                   # API routes
│   ├── models.py                 # Data models
│   └── requirements.txt           # Dependencies
├── QUICKSTART.md                 # 5-minute guide
├── SETUP.md                      # Detailed setup
├── README.md                     # Architecture
└── DEPLOYMENT.md                 # Production guide
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **QUICKSTART.md** | 5-minute setup for impatient people |
| **SETUP.md** | Detailed development setup |
| **README.md** | Architecture, features, schema |
| **DEPLOYMENT.md** | Deploy to production |
| **CHECKLIST.md** | QA checklist before launch |

---

## 🛠️ Common Tasks

### Run Tests
```bash
cd web && npm test
cd api && pip install pytest && pytest
```

### Format Code
```bash
cd web && npm run lint
```

### Build for Production
```bash
cd web && npm run build
cd api && gunicorn main:app
```

### View API Documentation
Visit: http://localhost:8000/docs

### View Firestore
Visit: https://console.firebase.google.com/

---

## ⚡ Troubleshooting

### "npm: command not found"
→ Install Node.js from https://nodejs.org/

### "python: command not found"
→ Install Python from https://www.python.org/

### "poetry is not recognized"
→ Not needed! We use `pip` instead. See instructions above.

### "Port 3000 already in use"
**Windows:**
```cmd
netstat -ano | findstr :3000
taskkill /PID <number> /F
```

**Mac/Linux:**
```bash
lsof -i :3000
kill -9 <number>
```

### API connection error
→ Check backend is running on http://localhost:8000  
→ Verify `NEXT_PUBLIC_API_URL=http://localhost:8000` in web/.env.local

### Firebase auth error
→ Check credentials in `.env` files are correct  
→ Verify Firebase project exists

---

## 🎨 Project Features

### 📄 Pages Built
- Home with hero and featured items
- Shop with filtering
- Product details with art story
- Shopping cart
- Checkout with Razorpay
- Art Room (blog)
- Magazine
- Artist application form
- User profile
- Admin dashboard
- Authentication (signup/login)

### 🔧 Integrations
- Firebase Authentication
- Firestore Database
- Firebase Storage
- Razorpay Payments
- Zustand State Management
- Tailwind CSS

### 🎯 Design
- Indian cultural aesthetic
- Warm color palette
- Elegant typography
- Responsive design
- Smooth animations

---

## 🚀 Next Steps

1. **Immediate**: Run servers (see above)
2. **Today**: Add sample data to Firestore
3. **This Week**: Test shopping flow
4. **Before Launch**: Review CHECKLIST.md
5. **Production**: Follow DEPLOYMENT.md

---

## 📞 Need Help?

1. **Setup issues** → Read SETUP.md
2. **Stuck somewhere** → Check QUICKSTART.md or TROUBLESHOOTING.md
3. **Common errors** → See TROUBLESHOOTING.md
4. **Architecture questions** → See README.md
5. **Ready to deploy** → Follow DEPLOYMENT.md
6. **Before launching** → Complete CHECKLIST.md

---

## ✅ Verify Everything

After setup, you should see:

```
✓ Frontend loads at http://localhost:3000
✓ Backend API docs at http://localhost:8000/docs
✓ Can create account (sign up works)
✓ Can log in (login works)
✓ No errors in console
✓ Firestore is accessible
```

If all ✓, you're ready to go! 🎉

---

**Questions?** Check the docs listed above.  
**Ready to build?** Start with QUICKSTART.md or the setup scripts.  
**Want details?** Read README.md for full architecture.

Happy coding! 🎨

---

*GIA - Great India Arts - Celebrating Indian Heritage Through Code*
