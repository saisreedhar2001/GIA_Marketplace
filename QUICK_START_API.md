# Quick Start - Running the API

## Prerequisites
- Python 3.8+
- All dependencies installed (from requirements.txt)

## Step 1: Check Your Environment Files

### Frontend Config (web/.env.local)
Should exist and contain Firebase web credentials. Check it has these keys:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDSqvZULvgvjr2TeyubnTxLLun4DxhJMgA
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend Config (api/.env)
The API now has default values, but should ideally have Firebase service account. 

If you see errors about Firebase, you need to add to `api/.env`:
```
FIREBASE_PROJECT_ID=fir-gia-95889
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@fir-gia-95889.iam.gserviceaccount.com
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

## Step 2: Start the API

```bash
cd api
python -m uvicorn main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

## Step 3: Verify API is Running

**In a new terminal:**
```bash
curl http://localhost:8000/health
```

Should return:
```json
{"status":"healthy","service":"GIA API"}
```

Or open in browser: http://localhost:8000/health

## Step 4: View API Documentation

Open in browser: **http://localhost:8000/docs**

You'll see interactive Swagger documentation of all endpoints.

## Step 5: Start Frontend (in another terminal)

```bash
cd web
npm run dev
```

Frontend will be at: http://localhost:3000

## Full Setup (Both Servers)

**Terminal 1 - Backend:**
```bash
cd api
python -m uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd web
npm run dev
```

Then access:
- **Home Page:** http://localhost:3000
- **Login:** http://localhost:3000/auth/login
- **Super Admin Dashboard:** http://localhost:3000/superadmin (with super user email)
- **Artist Dashboard:** http://localhost:3000/artist (with artist/admin user)
- **API Docs:** http://localhost:8000/docs

## Troubleshooting

### Error: "ModuleNotFoundError: No module named 'fastapi'"
Install requirements:
```bash
pip install -r requirements.txt
```

### Error: "ValidationError: firebase_project_id Field required"
Your `api/.env` is missing Firebase credentials. Either:
1. Add them (see Step 1 above)
2. Or check that `serviceAccount.json` exists in api/ folder

### Error: "CORS policy blocked"
Make sure:
- Frontend is running on http://localhost:3000
- Backend is running on http://localhost:8000
- `NEXT_PUBLIC_API_URL=http://localhost:8000` in web/.env.local

### Error: "Port 8000 already in use"
Either:
1. Kill the process using port 8000
2. Or run on different port: `python -m uvicorn main:app --reload --port 8001`

## Common Ports
- **Frontend:** 3000
- **Backend:** 8000
- **Firestore:** Uses Google Cloud
- **Firebase Auth:** Uses Google Cloud

## File Structure
```
artroom/
├── api/
│   ├── main.py              # API entry point
│   ├── config.py            # Configuration
│   ├── firebase_service.py  # Firebase connection
│   ├── auth_service.py      # Authentication
│   ├── .env                 # Environment variables
│   └── requirements.txt      # Python dependencies
├── web/
│   ├── src/
│   ├── .env.local          # Frontend config
│   ├── package.json        # Node dependencies
│   └── ...
```

## Next Steps

1. ✓ Start both servers
2. Create account with email/password or Google
3. Access appropriate dashboard based on role
4. Super user can grant admin access
5. Artists can upload products

## Support

Check these files for more details:
- `ENV_SETUP_GUIDE.md` - Detailed environment setup
- `SUPER_ADMIN_TROUBLESHOOTING.md` - Super admin issues
- `ARTIST_DASHBOARD_SETUP.md` - Artist features
