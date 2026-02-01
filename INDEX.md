# 📚 GIA - Complete Project Index

## 🎯 Quick Navigation

| Goal | Read This |
|------|-----------|
| **I just want to run it NOW** | [START_HERE.md](./START_HERE.md) |
| **5-minute setup** | [QUICKSTART.md](./QUICKSTART.md) |
| **Detailed setup** | [SETUP.md](./SETUP.md) |
| **Something's broken** | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) |
| **Want to deploy** | [DEPLOYMENT.md](./DEPLOYMENT.md) |
| **QA before launch** | [CHECKLIST.md](./CHECKLIST.md) |
| **Architecture & features** | [README.md](./README.md) |

---

## 📁 Project Structure

### Root Level
```
Artroom/
├── START_HERE.md          ← Begin here!
├── QUICKSTART.md          ← 5-minute setup
├── SETUP.md               ← Detailed instructions
├── README.md              ← Architecture
├── DEPLOYMENT.md          ← Production guide
├── CHECKLIST.md           ← QA checklist
├── INDEX.md               ← This file
│
├── setup.bat              ← Auto setup (Windows)
├── setup.sh               ← Auto setup (macOS/Linux)
├── run-dev.bat            ← Run servers (Windows)
├── run-dev.sh             ← Run servers (macOS/Linux)
├── verify-setup.bat       ← Verify setup (Windows)
├── verify-setup.sh        ← Verify setup (macOS/Linux)
│
├── web/                   ← Frontend (Next.js)
├── api/                   ← Backend (FastAPI)
│
├── package.json           ← Monorepo config
└── .gitignore
```

---

## 🚀 Getting Started (3 Steps)

### Step 1: Run Setup
**Windows:**
```bash
setup.bat
```

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### Step 2: Configure
Create `web/.env.local` and `api/.env` with your Firebase and Razorpay credentials.
(See [QUICKSTART.md](./QUICKSTART.md) for exact format)

### Step 3: Run Servers
**Option A - Automatic:**
```bash
run-dev.bat    # Windows
./run-dev.sh   # macOS/Linux
```

**Option B - Manual:**
```bash
# Terminal 1
cd web && npm run dev

# Terminal 2
cd api && python -m uvicorn main:app --reload
```

Visit: http://localhost:3000 🎉

---

## 📂 Frontend (web/)

### Structure
```
web/src/
├── app/                    # Pages (Next.js App Router)
│   ├── page.tsx           # Home page
│   ├── shop/              # Shop pages
│   ├── cart/              # Cart page
│   ├── checkout/          # Checkout page
│   ├── artroom/           # Art Room (blog)
│   ├── magazine/          # Magazine
│   ├── categories/        # Categories
│   ├── work-with-us/      # Artist application
│   ├── profile/           # User profile
│   ├── admin/             # Admin dashboard
│   ├── auth/              # Login/signup
│   └── layout.tsx         # Root layout
│
├── components/
│   ├── Navbar.tsx         # Navigation bar
│   ├── Footer.tsx         # Footer
│   └── ...other components
│
├── lib/
│   ├── firebase.ts        # Firebase config
│   ├── api.ts             # API client
│   └── ...utilities
│
├── store/
│   ├── auth.ts            # Auth state (Zustand)
│   └── cart.ts            # Cart state (Zustand)
│
├── types/
│   └── index.ts           # TypeScript types
│
└── styles/
    └── globals.css        # Global styles
```

### Key Files
- **Next.js Config**: `web/next.config.js`
- **TypeScript Config**: `web/tsconfig.json`
- **Tailwind Config**: `web/tailwind.config.js`
- **Dependencies**: `web/package.json`

### Pages Built
- ✅ Home `/`
- ✅ Shop `/shop`
- ✅ Product Details `/shop/[id]`
- ✅ Cart `/cart`
- ✅ Checkout `/checkout`
- ✅ Art Room `/artroom`
- ✅ Blog Post `/artroom/[id]`
- ✅ Magazine `/magazine`
- ✅ Work With Us `/work-with-us`
- ✅ User Profile `/profile`
- ✅ Admin `/admin`
- ✅ Login `/auth/login`
- ✅ Signup `/auth/signup`
- ✅ Categories `/categories`

---

## 🔌 Backend (api/)

### Structure
```
api/
├── main.py                # All API routes
├── models.py              # Pydantic data models
├── firebase_service.py    # Firebase operations
├── auth_service.py        # Authentication service
├── razorpay_service.py    # Payment service
├── config.py              # Configuration
├── pyproject.toml         # Poetry config (optional)
├── requirements.txt       # Pip dependencies
└── .env                   # Environment variables
```

### Key Features
- FastAPI framework
- Firebase Authentication integration
- Firestore database operations
- Razorpay payment processing
- CORS enabled
- Automatic API documentation at `/docs`

### API Endpoints
See `api/main.py` for all endpoints. Key ones:

**Auth:**
- `POST /auth/signup` - Register
- `POST /auth/login` - Login
- `GET /auth/user` - Get profile

**Products:**
- `GET /products` - List products
- `GET /products/{id}` - Get product
- `POST /products` - Create product

**Orders:**
- `POST /orders` - Create order
- `GET /orders` - Get user orders
- `POST /orders/{id}/payment` - Verify payment

**Blog:**
- `GET /blog` - List posts
- `GET /blog/{id}` - Get post
- `POST /blog` - Create post

**More:**
- `GET /magazine` - Get magazines
- `POST /work-with-us` - Apply
- `GET /health` - Health check

---

## 🗄️ Database (Firestore)

### Collections
- `users` - User accounts
- `products` - Product listings
- `orders` - Customer orders
- `blog_posts` - Art Room stories
- `magazines` - Digital magazines
- `work_with_us_applications` - Artist apps

See [README.md](./README.md) for detailed schema.

---

## 🎨 Design System

### Colors
- **Terracotta**: #B85C3C (primary)
- **Indigo**: #312653 (text)
- **Sand Beige**: #E8DCC4 (accents)
- **Deep Green**: #2D5016 (secondary)
- **Off-White**: #FFFBF7 (background)

### Typography
- **Headings**: Playfair Display
- **Body**: Inter

See `web/tailwind.config.js` for full configuration.

---

## 🔐 Authentication & Security

- Firebase Authentication (email/password)
- JWT tokens for API
- Role-based access (user, artist, admin)
- Protected routes
- Secure credential handling

---

## 💳 Payments

- Razorpay integration
- Test mode available
- Order creation & verification
- Refund support

---

## 📊 Admin Features

- Dashboard with stats
- Product management
- Order management
- User management
- Artist application review
- Content moderation

---

## 🚀 Deployment

### Frontend: Vercel
Deploy Next.js app to Vercel (free tier available).
See [DEPLOYMENT.md](./DEPLOYMENT.md)

### Backend: Railway/Render
Deploy FastAPI to Railway or Render.
See [DEPLOYMENT.md](./DEPLOYMENT.md)

### Database: Firebase
Automatic with Firestore.

---

## 🧪 Testing & Verification

### Verify Setup
```bash
# Windows
verify-setup.bat

# macOS/Linux
chmod +x verify-setup.sh
./verify-setup.sh
```

### Check Servers Running
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## 📝 Documentation Files

| File | Purpose |
|------|---------|
| **START_HERE.md** | Quick start guide |
| **QUICKSTART.md** | 5-minute setup |
| **SETUP.md** | Detailed setup instructions |
| **README.md** | Project architecture |
| **DEPLOYMENT.md** | Production deployment |
| **CHECKLIST.md** | Pre-launch QA checklist |
| **INDEX.md** | This file (navigation) |

---

## 🎯 Common Tasks

### View API Documentation
→ http://localhost:8000/docs

### Edit a Page
→ `web/src/app/[pagename]/page.tsx`

### Add API Endpoint
→ Edit `api/main.py`

### Modify Styling
→ Update `web/tailwind.config.js` or `.css` files

### Add Database Field
→ Firestore console or update models.py

### Deploy Frontend
→ See DEPLOYMENT.md

### Deploy Backend
→ See DEPLOYMENT.md

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| npm/node not found | Install from https://nodejs.org/ |
| Python not found | Install from https://www.python.org/ |
| Port 3000/8000 in use | Kill process or change port |
| Firebase auth error | Check .env credentials |
| API connection error | Verify backend is running |
| npm install fails | Try `npm cache clean --force` |
| poetry not found | Use `pip` instead (no poetry needed) |

See [SETUP.md](./SETUP.md) for more troubleshooting.

---

## 🎯 Typical Workflow

1. **Day 1**: Run setup scripts, configure .env
2. **Day 2**: Add sample data to Firestore
3. **Day 3**: Test user flows (signup → shop → checkout)
4. **Day 4**: Test admin features
5. **Day 5**: Review CHECKLIST.md
6. **Day 6+**: Custom customizations
7. **Week 2**: Deploy to production

---

## 🔗 External Links

- [Firebase Console](https://console.firebase.google.com/)
- [Razorpay Dashboard](https://dashboard.razorpay.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 💡 Key Technologies

| Component | Technology |
|-----------|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS, custom design tokens |
| **State** | Zustand |
| **Backend** | FastAPI, Python 3.10+ |
| **Database** | Firebase Firestore |
| **Auth** | Firebase Authentication |
| **Payments** | Razorpay |
| **Deployment** | Vercel (frontend), Railway/Render (backend) |

---

## 📞 Support

1. Check [START_HERE.md](./START_HERE.md)
2. Read [QUICKSTART.md](./QUICKSTART.md)
3. Review [SETUP.md](./SETUP.md)
4. Check [README.md](./README.md) for architecture
5. See [DEPLOYMENT.md](./DEPLOYMENT.md) for production

---

## ✅ Pre-Launch Checklist

Before going live:
1. Complete [CHECKLIST.md](./CHECKLIST.md)
2. Test all features
3. Add sample products
4. Configure domain
5. Review security rules
6. Set up monitoring
7. Plan maintenance

---

## 🎉 You're All Set!

Everything is ready to go. Start with [START_HERE.md](./START_HERE.md).

**Questions?** Check the documentation.  
**Stuck?** Review the relevant guide above.  
**Ready to code?** Start with the setup scripts.

Happy building! 🎨

---

*Last Updated: 2026*  
*GIA - Great India Arts*
