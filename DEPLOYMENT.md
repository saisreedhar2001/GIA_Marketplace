# GIA Deployment Guide

## Prerequisites

- GitHub account for version control
- Vercel account (for frontend)
- Railway/Render/Heroku account (for backend)
- Firebase project set up
- Razorpay account configured

## Frontend Deployment (Vercel)

### Step 1: Push to GitHub

```bash
cd /path/to/Artroom
git init
git add .
git commit -m "Initial commit: GIA marketplace"
git remote add origin https://github.com/yourusername/gia-marketplace.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Configure:
   - **Root Directory**: `web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. Add Environment Variables:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=xxx
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
   NEXT_PUBLIC_FIREBASE_APP_ID=xxx
   NEXT_PUBLIC_API_URL=https://your-api.railway.app
   NEXT_PUBLIC_RAZORPAY_KEY_ID=xxx
   ```

6. Click Deploy

## Backend Deployment (Railway)

### Step 1: Prepare FastAPI App

Create `api/Procfile`:
```
web: gunicorn main:app
```

Create `api/requirements.txt`:
```bash
cd api
poetry export -f requirements.txt --output requirements.txt --without-hashes
```

### Step 2: Deploy on Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Select your repository
5. Configure:
   - **Root Directory**: `api`
   - **Python Version**: `3.10`

6. Add Environment Variables in Railway Dashboard:
   ```
   FIREBASE_PROJECT_ID=xxx
   FIREBASE_PRIVATE_KEY=xxx
   FIREBASE_CLIENT_EMAIL=xxx
   RAZORPAY_KEY_ID=xxx
   RAZORPAY_KEY_SECRET=xxx
   API_PORT=8000
   ENVIRONMENT=production
   ```

7. Deploy

## Alternative: Render.com

```bash
# Create render.yaml in root
cat > render.yaml << 'EOF'
services:
  - type: web
    name: gia-api
    runtime: python
    startCommand: "cd api && gunicorn main:app"
    envVars:
      - key: FIREBASE_PROJECT_ID
        value: ${FIREBASE_PROJECT_ID}
      - key: FIREBASE_PRIVATE_KEY
        value: ${FIREBASE_PRIVATE_KEY}
      - key: FIREBASE_CLIENT_EMAIL
        value: ${FIREBASE_CLIENT_EMAIL}
      - key: RAZORPAY_KEY_ID
        value: ${RAZORPAY_KEY_ID}
      - key: RAZORPAY_KEY_SECRET
        value: ${RAZORPAY_KEY_SECRET}
      - key: API_PORT
        value: 8000
EOF
```

1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repo
4. Select `api/` directory
5. Add environment variables
6. Deploy

## Database Setup

### Firestore Collections

Create these collections in Firebase Console:

```
/users/{userId}
  - email: string
  - name: string
  - role: string
  - avatar: string
  - createdAt: timestamp
  - updatedAt: timestamp

/products/{productId}
  - title: string
  - price: number
  - category: string
  - artistId: string
  - stock: number
  - createdAt: timestamp
  - featured: boolean

/orders/{orderId}
  - userId: string
  - status: string
  - total: number
  - paymentStatus: string
  - createdAt: timestamp

/blog_posts/{postId}
  - title: string
  - published: boolean
  - authorId: string
  - createdAt: timestamp

/magazines/{magazineId}
  - issue: number
  - title: string
  - releaseDate: timestamp

/work_with_us_applications/{appId}
  - userId: string
  - status: string
  - createdAt: timestamp
```

### Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read, auth write
    match /products/{doc=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                      request.auth.token.role in ['artist', 'admin'];
    }

    // User documents
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }

    // Orders - user can see own
    match /orders/{orderId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }

    // Blog posts
    match /blog_posts/{doc=**} {
      allow read: if resource.data.published == true;
      allow write: if request.auth.token.role in ['artist', 'admin'];
    }

    // Admin only
    match /magazines/{doc=**} {
      allow read: if true;
      allow write: if request.auth.token.role == 'admin';
    }

    // Applications
    match /work_with_us_applications/{appId} {
      allow read: if request.auth.token.role == 'admin' || 
                     request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
  }
}
```

## Domain & SSL

### Using Vercel Domain
- Vercel auto-manages SSL
- Add custom domain in Vercel Dashboard
- Update DNS records

### Using Custom Domain
1. Buy domain from registrar (GoDaddy, Namecheap, etc.)
2. Point nameservers to your platform
3. Configure DNS records for both frontend and backend

## Monitoring & Logs

### Vercel
- Dashboard → Project → Analytics
- Real-time logs available

### Railway/Render
- Dashboard → Deployments → Logs
- Set up error tracking with Sentry

## Backup & Security

### Firebase
- Enable automatic backups
- Set up export schedules

### Environment Variables
- Never commit `.env` files
- Use platform-specific secret management
- Rotate keys regularly

## Performance Optimization

### Frontend
- Enable Vercel Analytics
- Optimize images with Next.js Image
- Use ISR (Incremental Static Regeneration)

### Backend
- Enable CORS for your frontend domain
- Set appropriate rate limits
- Cache responses where possible

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy Frontend
        run: |
          cd web
          npm install
          npm run build
      - name: Deploy Backend
        run: |
          cd api
          pip install -r requirements.txt
          # Deploy commands for your platform
```

## Troubleshooting

### Common Issues

**CORS Error**
- Update backend `cors_origins` in config
- Ensure frontend URL is whitelisted

**Firebase Auth Error**
- Check service account credentials
- Verify Firebase project ID

**Payment Integration Failed**
- Verify Razorpay keys
- Check webhook configuration
- Test in sandbox mode first

**Database Connection Error**
- Check Firestore credentials
- Verify service account permissions

## Scaling Considerations

1. **Database**: Enable Firestore autoscaling
2. **API**: Use connection pooling
3. **Storage**: Use Firebase Storage with CDN
4. **Caching**: Implement Redis (Redis Labs)
5. **Queue**: Add Celery for async tasks
6. **Monitoring**: Set up DataDog/New Relic

## Post-Deployment Checklist

- [ ] Frontend loads and displays correctly
- [ ] Authentication works (signup/login)
- [ ] Products load from Firestore
- [ ] Cart functionality works
- [ ] Payment integration works (test mode)
- [ ] Admin dashboard accessible
- [ ] Email notifications set up
- [ ] Analytics configured
- [ ] Error tracking enabled
- [ ] Backups configured
- [ ] CDN configured for images
- [ ] SSL certificate valid
- [ ] Rate limiting enabled
- [ ] CORS properly configured

## Support & Maintenance

### Regular Tasks
- Monitor error logs
- Check performance metrics
- Update dependencies
- Review security alerts
- Backup databases weekly
- Test disaster recovery

### Update Strategy
- Test in staging first
- Deploy during low-traffic hours
- Keep changelog updated
- Document breaking changes

---

For questions or issues, refer to the main [README.md](./README.md)
