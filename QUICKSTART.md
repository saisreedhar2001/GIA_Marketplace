# GIA Quick Start Guide

## 🚀 Fastest Way to Get Running (5 minutes)

### Windows Users

```cmd
# 1. Open Command Prompt in the Artroom directory
cd d:\Artroom

# 2. Run the setup script
setup.bat

# 3. Configure environment variables (see next section)

# 4. In Terminal 1, run frontend:
cd web
npm run dev

# 5. In Terminal 2, run backend:
cd api
python -m uvicorn main:app --reload
```

### macOS/Linux Users

```bash
# 1. Make script executable
chmod +x setup.sh

# 2. Run the setup script
./setup.sh

# 3. Configure environment variables (see next section)

# 4. In Terminal 1, run frontend:
cd web
npm run dev

# 5. In Terminal 2, run backend:
cd api
python -m uvicorn main:app --reload
```

## 🔧 Environment Variables Setup

### Step 1: Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project called "gia-marketplace"
3. Enable: Authentication (Email/Password), Firestore, Storage
4. Go to Project Settings → Service Accounts
5. Click "Generate new private key"
6. Copy the JSON content

### Step 2: Set Up Frontend (.env.local)

Create `web/.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=get_from_project_settings
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=get_from_project_settings
NEXT_PUBLIC_FIREBASE_APP_ID=get_from_project_settings
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_RAZORPAY_KEY_ID=test_key_id
```

### Step 3: Set Up Backend (.env)

Create `api/.env`:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=paste_private_key_from_json
FIREBASE_CLIENT_EMAIL=your-client-email@appspot.gserviceaccount.com
RAZORPAY_KEY_ID=test_key_id
RAZORPAY_KEY_SECRET=test_key_secret
API_PORT=8000
ENVIRONMENT=development
```

## ✅ Verify Everything Works

1. **Frontend loads**: Visit http://localhost:3000
   - You should see the home page

2. **Backend running**: Visit http://localhost:8000/docs
   - You should see API documentation

3. **Try signing up**: 
   - Click "Sign Up" on home page
   - Use any email and password
   - Should redirect to home after signup

## 🎯 Quick Feature Tests

### Test Shopping Flow
1. Go to `/shop`
2. (Products won't show without data in Firestore - see next section)

### Test Art Room
1. Go to `/artroom`
2. (No posts yet without data)

### Test Admin (if you set role)
1. Go to `/admin`
2. Set your Firebase user role to "admin"

## 📊 Add Sample Data

### Via Firestore Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Go to Firestore Database
3. Create collection: `products`
4. Add document with:

```json
{
  "title": "Kalamkari Painting",
  "description": "Traditional hand-painted Kalamkari",
  "price": 5000,
  "image": "https://via.placeholder.com/400",
  "category": "Traditional Paintings",
  "artistId": "demo_artist",
  "artStory": "This beautiful piece...",
  "careInstructions": "Keep away from direct sunlight",
  "culturalContext": "Kalamkari is an ancient art form",
  "stock": 10,
  "featured": true,
  "createdAt": {"seconds": 1700000000},
  "updatedAt": {"seconds": 1700000000}
}
```

## 🔑 Get Razorpay Test Keys

1. Sign up at [razorpay.com](https://razorpay.com/)
2. Go to Settings → API Keys
3. Copy Test Key ID and Secret
4. Add to both `.env.local` and `.env`

## 🐛 Troubleshooting

### "poetry is not recognized"
→ Already fixed! Just use `pip` instead. We've provided `requirements.txt`

### "npm command not found"
→ Install [Node.js](https://nodejs.org/) (includes npm)

### "python command not found"
→ Install [Python 3](https://www.python.org/)

### "Port 3000/8000 already in use"
**Windows:**
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -i :3000
kill -9 <PID>
```

### "Firebase authentication error"
→ Check your `.env` files have correct credentials
→ Verify Firebase project exists and services are enabled

### "API connection error"
→ Ensure backend is running on port 8000
→ Check `NEXT_PUBLIC_API_URL=http://localhost:8000`

## 📚 Learn More

- Full setup: See [SETUP.md](./SETUP.md)
- Deployment: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- Code structure: See [README.md](./README.md)

## 🎉 You're Ready!

Visit http://localhost:3000 and start exploring GIA!

---

**Need help?**
- Check SETUP.md for detailed instructions
- Review the main README.md for architecture
- Check individual component documentation

Happy building! 🎨
