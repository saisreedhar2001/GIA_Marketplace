# GIA Development Checklist

## ✅ Installation

- [ ] Node.js 18+ installed
- [ ] Python 3.10+ installed
- [ ] Repository cloned
- [ ] `setup.bat` (Windows) or `setup.sh` (macOS/Linux) executed successfully
- [ ] All dependencies installed without errors

## 🔐 Configuration

### Firebase Setup
- [ ] Firebase project created
- [ ] Authentication (Email/Password) enabled
- [ ] Firestore Database created
- [ ] Storage bucket created
- [ ] Service account JSON downloaded
- [ ] Web credentials obtained

### Environment Files
- [ ] `web/.env.local` created with Firebase credentials
- [ ] `api/.env` created with Firebase credentials
- [ ] `api/.env` has valid Razorpay test keys
- [ ] All required environment variables filled

### Razorpay Setup
- [ ] Razorpay account created
- [ ] Test API keys obtained
- [ ] Keys added to `.env` files

## 🚀 Development Servers

### Frontend (Next.js)
- [ ] Started with `npm run dev` in `web/` directory
- [ ] Accessible at `http://localhost:3000`
- [ ] Home page loads without errors
- [ ] Navigation works
- [ ] Responsive on mobile view

### Backend (FastAPI)
- [ ] Started with `python -m uvicorn main:app --reload` in `api/` directory
- [ ] Running on `http://localhost:8000`
- [ ] API docs accessible at `http://localhost:8000/docs`
- [ ] Health check works: `GET /health`

## 🧪 Feature Testing

### Authentication
- [ ] Sign up page accessible at `/auth/signup`
- [ ] Login page accessible at `/auth/login`
- [ ] Can create new account with email/password
- [ ] Can log in with created account
- [ ] Logout works
- [ ] Protected pages redirect to login

### Home Page
- [ ] Hero section displays correctly
- [ ] Featured products section visible
- [ ] Categories section visible
- [ ] Art Room preview visible
- [ ] Magazine CTA visible
- [ ] "Work With Us" CTA visible

### Shopping
- [ ] Shop page loads at `/shop`
- [ ] Products can be filtered by category
- [ ] Product detail pages accessible
- [ ] Product images display (once data added)
- [ ] Add to cart works
- [ ] Cart page updates correctly
- [ ] Cart count in navbar updates

### Art Room
- [ ] Art Room page accessible at `/artroom`
- [ ] Can filter by category
- [ ] Blog posts display (once data added)

### Magazine
- [ ] Magazine page accessible at `/magazine`
- [ ] Subscribe button functional
- [ ] Magazine list displays (once data added)

### Artist Application
- [ ] Work With Us page accessible at `/work-with-us`
- [ ] Form fields all present
- [ ] Can add portfolio links
- [ ] Form submits successfully (once logged in)

### Admin
- [ ] Admin dashboard accessible at `/admin` (when user role is admin)
- [ ] Stats display correctly
- [ ] Menu items link to correct sections
- [ ] Admin-only access enforced

## 📊 Database

### Firestore Collections
- [ ] `users` collection ready
- [ ] `products` collection ready
- [ ] `orders` collection ready
- [ ] `blog_posts` collection ready
- [ ] `magazines` collection ready
- [ ] `work_with_us_applications` collection ready

### Sample Data
- [ ] At least one product added for testing
- [ ] At least one blog post added
- [ ] User document created after signup

## 🎨 UI/UX

### Design System
- [ ] Color palette applied correctly
- [ ] Typography displays as intended
- [ ] Spacing consistent
- [ ] Shadows and borders present
- [ ] Animations smooth (no jank)

### Responsive Design
- [ ] Desktop layout works (1920px+)
- [ ] Tablet layout works (768px)
- [ ] Mobile layout works (375px)
- [ ] Navigation works on all sizes
- [ ] Images scale appropriately

## 🔗 API Integration

### Frontend-Backend Communication
- [ ] API requests include proper headers
- [ ] Auth token properly sent in requests
- [ ] Error handling works
- [ ] Loading states display
- [ ] Success/failure messages show

### API Endpoints
- [ ] `GET /products` returns products
- [ ] `GET /products/{id}` returns product details
- [ ] `POST /auth/signup` creates user
- [ ] `GET /auth/user` returns user profile
- [ ] `GET /orders` returns user orders
- [ ] `GET /blog` returns blog posts

## 🚨 Error Handling

- [ ] Network errors handled gracefully
- [ ] 404 errors show proper message
- [ ] 401 unauthorized redirects to login
- [ ] Form validation errors display
- [ ] Toast notifications work
- [ ] Console has no critical errors

## 📝 Code Quality

### Frontend
- [ ] No TypeScript errors
- [ ] Proper component structure
- [ ] State management working
- [ ] No console warnings
- [ ] CSS applies correctly

### Backend
- [ ] All imports work
- [ ] No Python errors on startup
- [ ] Proper error handling
- [ ] Route parameters validated
- [ ] CORS properly configured

## 🔄 State Management

### Zustand Stores
- [ ] Auth store initializes correctly
- [ ] Cart store persists items
- [ ] User data persists after refresh
- [ ] Logout clears auth state

## 🌐 Deployment Readiness

- [ ] All environment variables documented
- [ ] No sensitive data in codebase
- [ ] Build process works (`npm run build`)
- [ ] No broken links
- [ ] 404 pages configured
- [ ] Meta tags present

## 📚 Documentation

- [ ] README.md complete and accurate
- [ ] SETUP.md has complete instructions
- [ ] QUICKSTART.md is beginner-friendly
- [ ] Code comments present where needed
- [ ] API endpoints documented in FastAPI `/docs`

## 🎯 Next Steps After Checklist

1. **Data Entry**
   - Add sample products via Firebase Console
   - Add sample blog posts
   - Upload images to Firebase Storage

2. **Testing**
   - Test complete shopping flow
   - Test payment with Razorpay test mode
   - Test admin functions

3. **Customization**
   - Update branding/colors
   - Add your own content
   - Configure domain and email

4. **Deployment**
   - Deploy frontend to Vercel
   - Deploy backend to Railway/Render
   - Configure custom domain
   - Enable production security rules

---

**Status**: ☐ Not Started | ☑ In Progress | ✅ Complete

Last Updated: [Current Date]
