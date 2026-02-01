# Environment Setup Guide

## Overview
This project has two separate `.env` files:
1. **`web/.env.local`** - Frontend (Next.js) configuration
2. **`api/.env`** - Backend (FastAPI) configuration

## Web Frontend Configuration

### File: `web/.env.local`

This file contains Firebase web app credentials and API URL. Create it with:

```env
# Firebase Web Configuration (from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDSqvZULvgvjr2TeyubnTxLLun4DxhJMgA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=fir-gia-95889.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=fir-gia-95889
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=fir-gia-95889.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=347358254710
NEXT_PUBLIC_FIREBASE_APP_ID=1:347358254710:web:4cb6025bbf8869ffe97157

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Razorpay (Public Key for frontend)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Backend API Configuration

### File: `api/.env`

The backend uses Firebase service account for authentication. You need:

```env
# Firebase Service Account (from Firebase Console - Service Account)
FIREBASE_PROJECT_ID=fir-gia-95889
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@fir-gia-95889.iam.gserviceaccount.com

# Razorpay Secret (Keep this secret!)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key

# Server Configuration
API_PORT=8000
ENVIRONMENT=development
```

## How to Get Firebase Service Account

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **fir-gia-95889**
3. Click Settings (gear icon) → Project Settings
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. A JSON file will download
7. Copy the following values to `api/.env`:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the quotes and newlines)
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

### Important: Formatting Private Key

The private key needs special formatting. In the JSON file it looks like:
```
"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"
```

Copy it exactly as shown (with `\n` newlines, not actual line breaks) to your `.env`:
```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"
```

## How to Get Razorpay Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Click Settings → API Keys
3. Copy:
   - **Key ID** → `RAZORPAY_KEY_ID` (in web/.env.local as `NEXT_PUBLIC_RAZORPAY_KEY_ID`)
   - **Key Secret** → `RAZORPAY_KEY_SECRET` (only in api/.env, keep secret!)

## Directory Structure

```
artroom/
├── web/
│   ├── .env.local          # Frontend config (CREATE THIS)
│   ├── .env.local.example  # Template reference
│   └── ...
├── api/
│   ├── .env                # Backend config (CREATE THIS)
│   ├── .env.example        # Template reference
│   ├── config.py           # Reads .env file
│   └── ...
```

## Quick Setup Checklist

### Step 1: Frontend Configuration
- [ ] Copy `web/.env.local.example` → `web/.env.local`
- [ ] Fill in Firebase web credentials
- [ ] Set `NEXT_PUBLIC_API_URL=http://localhost:8000`

### Step 2: Backend Configuration
- [ ] Create `api/.env` file
- [ ] Add Firebase service account credentials
- [ ] Add Razorpay test keys
- [ ] Add API configuration

### Step 3: Start Servers
```bash
# Terminal 1 - Frontend
cd web
npm run dev

# Terminal 2 - Backend
cd api
python -m uvicorn main:app --reload
```

### Step 4: Verify
- Frontend: http://localhost:3000 (should load)
- API Health: http://localhost:8000/health (should return JSON)
- API Docs: http://localhost:8000/docs (Swagger documentation)

## Environment Variables Reference

### web/.env.local (Public - Safe to expose)
| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web auth | From Firebase Console |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase domain | fir-gia-95889.firebaseapp.com |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project | fir-gia-95889 |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage | fir-gia-95889.firebasestorage.app |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging | 347358254710 |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | 1:347358254710:web:... |
| `NEXT_PUBLIC_API_URL` | Backend API URL | http://localhost:8000 |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay public key | rzp_test_... |

### api/.env (Secret - Never commit to git)
| Variable | Purpose | Example |
|----------|---------|---------|
| `FIREBASE_PROJECT_ID` | Firebase project ID | fir-gia-95889 |
| `FIREBASE_PRIVATE_KEY` | Firebase service account key | -----BEGIN PRIVATE KEY----- |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email | firebase-adminsdk-xxx@iam... |
| `RAZORPAY_KEY_ID` | Razorpay test key ID | rzp_test_... |
| `RAZORPAY_KEY_SECRET` | Razorpay secret (KEEP SAFE!) | secret_... |
| `API_PORT` | Port for API server | 8000 |
| `ENVIRONMENT` | Environment (dev/prod) | development |

## Troubleshooting

### Error: "ValidationError: firebase_project_id Field required"
**Cause:** Missing Firebase credentials in `api/.env`
**Fix:** Add Firebase service account to `api/.env`

### Error: "FIREBASE_PRIVATE_KEY must be valid"
**Cause:** Private key formatting incorrect
**Fix:** Ensure newlines are `\n` not actual line breaks, and it's wrapped in quotes

### Error: "CORS policy blocked"
**Cause:** Frontend and API not configured correctly
**Fix:** 
1. Check `NEXT_PUBLIC_API_URL` in web/.env.local
2. Check `cors_origins` in api/config.py

### Error: "Razorpay authentication failed"
**Cause:** Wrong Razorpay keys
**Fix:**
1. Use TEST keys (start with `rzp_test_`), not LIVE keys
2. Verify keys match in both files
3. Never use secret key in frontend

## Security Best Practices

1. **Never commit .env files** - Add to `.gitignore` (already done)
2. **Never share private keys** - Keep `FIREBASE_PRIVATE_KEY` and `RAZORPAY_KEY_SECRET` secret
3. **Use test credentials** for development
4. **Rotate keys** periodically in production
5. **Keep `.env.example`** files as templates without real values

## Notes

- The frontend runs on **port 3000**
- The backend API runs on **port 8000**
- Both must be running for full functionality
- Environment files are already in `.gitignore` to prevent accidental commits
