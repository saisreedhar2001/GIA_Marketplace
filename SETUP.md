# GIA Development Setup Guide

## Quick Start

### 1. Prerequisites

Install these first:
- **Node.js 18+**: https://nodejs.org/
- **Python 3.10+**: https://www.python.org/
- **Git**: https://git-scm.com/
- **Poetry** (for Python): `pip install poetry`

### 2. Clone & Install Dependencies

```bash
# Clone repository
git clone https://github.com/yourusername/gia-marketplace.git
cd gia-marketplace

# Install frontend dependencies
cd web
npm install
cd ..

# Install backend dependencies - Choose ONE method below:

# METHOD A: Using pip (Recommended for Windows)
cd api
pip install -r requirements.txt
cd ..

# METHOD B: Using Poetry (if installed)
cd api
poetry install
cd ..
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project: "gia-marketplace"
3. Enable these services:
   - Authentication (Email/Password)
   - Firestore Database
   - Storage

4. Get credentials:
   - Go to Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save as `api/serviceAccount.json`

5. Copy web credentials:
   - Go to Project Settings → General
   - Copy Firebase config

### 4. Environment Setup

**Frontend (web/.env.local)**
```
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY
```

**Backend (api/.env)**
```
FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
FIREBASE_PRIVATE_KEY=YOUR_PRIVATE_KEY (from JSON file)
FIREBASE_CLIENT_EMAIL=YOUR_CLIENT_EMAIL
RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_SECRET
API_PORT=8000
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 5. Razorpay Setup

1. Create account at [razorpay.com](https://razorpay.com/)
2. Go to Settings → API Keys
3. Copy Test Key ID and Secret
4. Add to `.env` files above

## Running Locally

### Terminal 1: Frontend

```bash
cd web
npm run dev
```

Access at: http://localhost:3000

### Terminal 2: Backend

Choose the method you used to install dependencies:

**If using pip:**
```bash
cd api
python -m uvicorn main:app --reload
```

**If using Poetry:**
```bash
cd api
poetry run python -m uvicorn main:app --reload
```

Access at: http://localhost:8000

## Database Setup

### Firestore Collections

The API will automatically create these when data is added. Alternatively, create manually:

1. **users** - User accounts
2. **products** - Product listings
3. **orders** - Customer orders
4. **blog_posts** - Art Room stories
5. **magazines** - Digital magazine issues
6. **work_with_us_applications** - Artist applications

### Test Data

Add sample products via API or Firestore:

```json
{
  "title": "Kalamkari Painting",
  "description": "Traditional hand-painted Kalamkari art from Andhra Pradesh",
  "price": 5000,
  "image": "https://example.com/painting.jpg",
  "category": "Traditional Paintings",
  "artistId": "artist_id_here",
  "artStory": "This piece tells the story...",
  "careInstructions": "Keep away from direct sunlight...",
  "culturalContext": "Kalamkari is an ancient art form...",
  "stock": 10,
  "featured": true
}
```

## Development Workflow

### Code Structure

```
web/src/
├── app/              # Pages (Next.js App Router)
├── components/       # Reusable components
├── lib/              # Utilities (Firebase, API)
├── store/            # Zustand state stores
├── types/            # TypeScript types
└── styles/           # CSS/Tailwind

api/
├── main.py           # API routes
├── models.py         # Data models
├── firebase_service.py  # Firebase operations
├── auth_service.py   # Authentication
└── razorpay_service.py  # Payment handling
```

### Common Development Tasks

**Add a new page:**
```bash
# Create in web/src/app/[pagename]/page.tsx
```

**Add a new API endpoint:**
```python
# Add to api/main.py
@app.get("/your-endpoint")
async def your_endpoint():
    pass
```

**Create a new component:**
```bash
# Create in web/src/components/YourComponent.tsx
```

## Testing

### Frontend Testing

```bash
cd web
npm test
```

### Backend Testing

```bash
cd api

# If using pip:
pip install pytest
pytest

# If using Poetry:
poetry run pytest
```

## Linting & Formatting

### Frontend

```bash
cd web
npm run lint
```

### Backend

```bash
cd api
poetry run black .
poetry run flake8
```

## Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill process on port 3000 (frontend)
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 8000 (backend)
lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

**Firebase authentication error**
- Check `.env` variables are correct
- Verify service account JSON path
- Ensure Firebase project exists

**API connection error**
- Verify `NEXT_PUBLIC_API_URL` matches backend URL
- Check backend is running on correct port
- Verify CORS settings in `api/main.py`

**Module not found errors**
- Frontend: `cd web && npm install`
- Backend: `cd api && poetry install`

**Database not connecting**
- Verify Firebase credentials are correct
- Check Firestore is enabled in Firebase Console
- Ensure service account has proper permissions

## Performance Tips

### Frontend
- Use React DevTools for component profiling
- Monitor bundle size with `npm run build`
- Test with Chrome DevTools Lighthouse

### Backend
- Use FastAPI's built-in docs at `/docs`
- Monitor response times
- Test concurrent requests with Apache Bench

## IDE Setup

### VS Code Extensions
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **Python**
- **Pylance**
- **Firebase Explorer**

### VS Code Settings (`.vscode/settings.json`)
```json
{
  "python.defaultInterpreterPath": "${workspaceFolder}/api/.venv/bin/python",
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

## Next Steps

1. **Explore the codebase**: Read through main files
2. **Set up database**: Add sample products
3. **Test authentication**: Sign up and log in
4. **Test shopping flow**: Add to cart and checkout
5. **Review deployment**: See DEPLOYMENT.md

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand State Management](https://github.com/pmndrs/zustand)
- [Razorpay Documentation](https://razorpay.com/docs/)

## Getting Help

- Check existing GitHub issues
- Review API documentation at `/docs` (backend)
- Ask in discussions section
- Email: dev@greatindiaarts.com

---

Happy coding! 🎨
