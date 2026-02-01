# GIA - Great India Arts

A full-stack Indian art & crafts marketplace and portfolio platform celebrating heritage, handmade artistry, and storytelling.

## 🎨 Project Vision

Build an aesthetic, culturally-rooted e-commerce platform that:
- Celebrates Indian heritage and handmade artistry
- Provides a smooth marketplace experience
- Tells stories behind every piece
- Supports artists and craftspeople
- Offers content through Art Room and Magazine

## 🏗️ Architecture

```
GIA/
├── web/                 # Next.js frontend (App Router)
│   ├── src/
│   │   ├── app/        # Pages and layouts
│   │   ├── components/ # Reusable components
│   │   ├── lib/        # Firebase, API clients
│   │   ├── store/      # Zustand stores (auth, cart)
│   │   └── types/      # TypeScript types
│   └── package.json
├── api/                # FastAPI backend
│   ├── main.py        # API routes
│   ├── models.py      # Pydantic models
│   ├── firebase_service.py
│   ├── auth_service.py
│   ├── razorpay_service.py
│   └── pyproject.toml
└── README.md
```

## 🛠️ Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS (custom design tokens)
- Zustand (state management)
- Firebase Auth & Firestore

**Backend:**
- FastAPI
- Firebase Admin SDK
- Razorpay API
- Python 3.10+

**Infrastructure:**
- Firebase Authentication
- Firestore Database
- Firebase Storage
- Razorpay Payments

## 🚀 Getting Started

### Quick Start (5 minutes)

**Windows:**
```bash
setup.bat
```

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

Then see [QUICKSTART.md](./QUICKSTART.md) for next steps.

### Prerequisites
- Node.js 18+
- Python 3.10+
- Firebase project setup
- Razorpay account

### Manual Setup

**Frontend:**
```bash
cd web
npm install
cp .env.local.example .env.local
# Add your Firebase credentials
npm run dev
```
Frontend runs on `http://localhost:3000`

**Backend:**
```bash
cd api
pip install -r requirements.txt
cp .env.example .env
# Add your Firebase and Razorpay credentials
python -m uvicorn main:app --reload
```
Backend runs on `http://localhost:8000`

## 🗄️ Firestore Schema

```
users/
  {userId}
    - email: string
    - name: string
    - role: "user" | "artist" | "admin"
    - avatar: string (URL)
    - createdAt: timestamp
    
products/
  {productId}
    - title: string
    - description: string
    - price: number
    - image: string (URL)
    - category: string
    - artistId: string
    - artStory: string
    - careInstructions: string
    - stock: number
    
orders/
  {orderId}
    - userId: string
    - items: array
    - total: number
    - status: "pending" | "confirmed" | "shipped" | "delivered"
    - paymentStatus: "pending" | "completed" | "failed"
    - shippingAddress: object
    
blog_posts/
  {postId}
    - title: string
    - content: string
    - author: string
    - category: string
    - published: boolean
    
magazines/
  {magazineId}
    - issue: number
    - title: string
    - content: string
    - releaseDate: timestamp
```

## 🎨 Design System

### Color Palette
- **Terracotta**: #B85C3C (primary action)
- **Indigo**: #312653 (text, headings)
- **Sand Beige**: #E8DCC4 (backgrounds, accents)
- **Deep Green**: #2D5016 (secondary)
- **Off-white**: #FFFBF7 (main background)
- **Warm Gray**: #9B8B7E (secondary text)

### Typography
- **Headings**: Playfair Display, Libre Baskerville
- **Body**: Inter, Lato

### Spacing & Shadows
- Soft shadows: `0 2px 8px rgba(0, 0, 0, 0.08)`
- Rounded corners: 12px - 16px
- Smooth animations & transitions

## 📄 Pages

### Public
- `/` - Home
- `/shop` - Product listing with filters
- `/shop/[id]` - Product detail
- `/categories` - Category browse
- `/artroom` - Blog/art stories
- `/artroom/[id]` - Story detail
- `/magazine` - Magazine listing
- `/work-with-us` - Artist application

### Authenticated
- `/cart` - Shopping cart
- `/checkout` - Payment processing
- `/orders` - Order history
- `/profile` - User profile
- `/magazine/[id]` - Magazine access (subscribers)

### Admin
- `/admin` - Dashboard
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/users` - User management
- `/admin/applications` - Artist approvals

## 🔐 Authentication

Uses Firebase Authentication with:
- Email/Password signup
- JWT token handling
- Auto token refresh
- Role-based access control

## 💳 Payments

Razorpay integration for:
- Order creation
- Payment verification
- Refunds
- Subscription management

## 🔌 API Endpoints

### Auth
- `POST /auth/signup` - Create account
- `POST /auth/login` - Sign in
- `GET /auth/user` - Get profile

### Products
- `GET /products` - List products
- `GET /products/{id}` - Get product
- `POST /products` - Create (artists)

### Orders
- `POST /orders` - Create order
- `GET /orders` - List user orders
- `POST /orders/{id}/payment` - Verify payment

### Blog
- `GET /blog` - List posts
- `GET /blog/{id}` - Get post
- `POST /blog` - Create post (artists)

### Magazine
- `GET /magazine` - List issues
- `POST /magazine` - Create (admin)

### Work With Us
- `POST /work-with-us` - Submit application

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd web
npm run build
vercel deploy
```

### Backend (Heroku / Railway / Render)
```bash
cd api
pip install gunicorn
gunicorn main:app
```

## 📝 Environment Variables

**Frontend (.env.local)**
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_RAZORPAY_KEY_ID=...
```

**Backend (.env)**
```
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
API_PORT=8000
ENVIRONMENT=development
```

## 📦 Development Commands

### Frontend
```bash
cd web
npm run dev      # Development server
npm run build    # Production build
npm run lint     # Linting
```

### Backend
```bash
cd api
poetry run python -m uvicorn main:app --reload
poetry run pytest  # Run tests
```

## 🎯 Future Enhancements

- [ ] Multi-language support (Hindi, Tamil, etc.)
- [ ] Artist storefronts
- [ ] AR art preview
- [ ] Advanced search & recommendations
- [ ] Offline exhibitions page
- [ ] Artist analytics dashboard
- [ ] Live auctions

## 📄 License

MIT License - See LICENSE file

## 🤝 Contributing

Guidelines for contributing:
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📧 Contact

- Email: hello@greatindiaarts.com
- Website: www.greatindiaarts.com

---

**Made with ❤️ for Indian artisans and art lovers**
