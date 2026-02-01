# How to Get Firebase Credentials

## You Have: serviceAccount.json ✅

Great! That's the **backend credentials**. You also need the **web credentials**.

---

## Step 1: Extract Backend Credentials from serviceAccount.json

Open your `serviceAccount.json` file. It looks like this:

```json
{
  "type": "service_account",
  "project_id": "fir-gia-95889",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "firebase-adminsdk-abc@fir-gia-95889.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/certificates/..."
}
```

From this file, extract these 3 values for `api/.env`:

```
FIREBASE_PROJECT_ID=fir-gia-95889                    (from "project_id")
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n... (from "private_key" - include quotes and \n)
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc@...      (from "client_email")
```

---

## Step 2: Get Web Credentials (NEW - You're missing these!)

Web credentials are **different** from service account credentials. You need to get them from Firebase Console:

### Go to Firebase Console
1. Visit: https://console.firebase.google.com/
2. Select your project: **fir-gia-95889**
3. Click **⚙️ Settings** (gear icon) → **Project settings**

### Find Your Web App Config

4. Look for **Your apps** section
5. If you don't see a web app listed, click **Add app** → **Web**
6. A box will appear with your Firebase config (copy this!)

It looks like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxxx...",
  authDomain: "fir-gia-95889.firebaseapp.com",
  projectId: "fir-gia-95889",
  storageBucket: "fir-gia-95889.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

---

## Step 3: Fill web/.env.local

Create file: `web/.env.local`

Copy the values from the Firebase config above:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDxxx...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=fir-gia-95889.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=fir-gia-95889
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=fir-gia-95889.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456

NEXT_PUBLIC_API_URL=http://localhost:8000

NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_test_key
```

---

## Step 4: Fill api/.env

Create file: `api/.env`

Use values from serviceAccount.json:

```env
FIREBASE_PROJECT_ID=fir-gia-95889
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkq...==\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc@fir-gia-95889.iam.gserviceaccount.com

RAZORPAY_KEY_ID=your_razorpay_test_key
RAZORPAY_KEY_SECRET=your_razorpay_test_secret

API_PORT=8000
ENVIRONMENT=development
```

**IMPORTANT:** For `FIREBASE_PRIVATE_KEY`, copy the ENTIRE key including the `-----BEGIN...` and `-----END...` lines. Keep the `\n` characters as-is.

---

## Step 5: Get Razorpay Keys

Visit: https://dashboard.razorpay.com/

1. Go to **Settings** → **API Keys**
2. Copy **Key ID** and **Key Secret** (test mode)
3. Add to both `.env` files:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_abc123...
```

(in web/.env.local)

```env
RAZORPAY_KEY_ID=rzp_test_abc123...
RAZORPAY_KEY_SECRET=xyz789...
```

(in api/.env)

---

## Quick Checklist

### web/.env.local Needs:
- [ ] NEXT_PUBLIC_FIREBASE_API_KEY
- [ ] NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- [ ] NEXT_PUBLIC_FIREBASE_PROJECT_ID
- [ ] NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- [ ] NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- [ ] NEXT_PUBLIC_FIREBASE_APP_ID
- [ ] NEXT_PUBLIC_API_URL (keep as is: http://localhost:8000)
- [ ] NEXT_PUBLIC_RAZORPAY_KEY_ID

### api/.env Needs:
- [ ] FIREBASE_PROJECT_ID
- [ ] FIREBASE_PRIVATE_KEY
- [ ] FIREBASE_CLIENT_EMAIL
- [ ] RAZORPAY_KEY_ID
- [ ] RAZORPAY_KEY_SECRET
- [ ] API_PORT (keep as is: 8000)
- [ ] ENVIRONMENT (keep as is: development)

---

## Where to Find Each Value

| Value | Found In | Location |
|-------|----------|----------|
| FIREBASE_PROJECT_ID | Both | serviceAccount.json `project_id` OR Firebase Console |
| FIREBASE_PRIVATE_KEY | serviceAccount.json | `private_key` field |
| FIREBASE_CLIENT_EMAIL | serviceAccount.json | `client_email` field |
| FIREBASE_API_KEY | Firebase Console | Project Settings → Web App Config |
| FIREBASE_AUTH_DOMAIN | Firebase Console | Project Settings → Web App Config |
| FIREBASE_STORAGE_BUCKET | Firebase Console | Project Settings → Web App Config |
| FIREBASE_MESSAGING_SENDER_ID | Firebase Console | Project Settings → Web App Config |
| FIREBASE_APP_ID | Firebase Console | Project Settings → Web App Config |
| RAZORPAY_KEY_ID | Razorpay Dashboard | Settings → API Keys |
| RAZORPAY_KEY_SECRET | Razorpay Dashboard | Settings → API Keys |

---

## If You Can't Find Your Web App Config

1. Go to: https://console.firebase.google.com/
2. Select project: **fir-gia-95889**
3. Click **⚙️ Project Settings**
4. Scroll down to **Your apps**
5. You should see a section like:

```
Web apps
🌐 gia-marketplace (or similar name)
```

6. Click on it to see the config
7. If no web app exists, click **Add app** → **Web** → Create a new one

---

## Testing Your Credentials

Once you've filled both .env files:

1. Start both servers:
   ```bash
   # Terminal 1
   cd web && npm run dev
   
   # Terminal 2
   cd api && python -m uvicorn main:app --reload
   ```

2. Visit: http://localhost:3000

3. Try signing up - if it works, credentials are correct!

---

## Common Mistakes

❌ **Don't:**
- Put `\n` as two characters - it should be a real newline
- Forget quotes around PRIVATE_KEY
- Mix up project IDs
- Use production keys for testing
- Commit .env files to git

✅ **Do:**
- Copy values exactly as shown
- Include `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Use test keys for Razorpay
- Keep .env files local (not in git)
- Check values match your Firebase project

---

## Still Need Help?

See: **QUICKSTART.md** - Has simpler version with example format

Or check: **FIX_NETWORK_ERROR.md** - If you get connection errors

Good luck! 🎨
