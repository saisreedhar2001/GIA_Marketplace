# Super Admin Dashboard - Network Error Troubleshooting

## Issue
Getting "Network Error" when accessing the Super Admin Dashboard at `/superadmin`
Console shows: `AxiosError` when calling `/admin/analytics/overview`

## Root Causes & Solutions

### 1. API Server Not Running ✓ Most Common
**Symptom:** `Network Error` or `Failed to connect to localhost:8000`

**Solution:**
```bash
# Terminal 1: Start Backend API
cd api
python -m uvicorn main:app --reload

# Terminal 2: Start Frontend (in separate terminal)
cd web
npm run dev
```

Or use the batch script:
```bash
run-dev.bat  # Windows
```

### 2. Wrong API URL Configuration
**Check:** Open browser console and look for the error message

**Solution:** Verify `web/.env.local` has:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

If you're running the API on a different port/host, update this URL.

### 3. CORS Issues
**Symptom:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:** Check `api/config.py` includes your frontend URL in cors_origins:
```python
cors_origins: list = ["http://localhost:3000", "http://localhost:3001"]
```

If frontend is on different port, add it:
```python
cors_origins: list = ["http://localhost:3000", "http://localhost:3000", "http://YOUR_IP:YOUR_PORT"]
```

### 4. Authentication Token Issue
**Symptom:** 401 Unauthorized error

**Solution:**
1. Make sure you're logged in with `cnssreedhar2001@gmail.com`
2. Check browser DevTools → Application → Local Storage for `authToken`
3. Token should be present and valid
4. If missing, logout and login again

### 5. User Not in Firestore
**Symptom:** 404 User not found error

**Solution:**
1. Login with the super user email `cnssreedhar2001@gmail.com`
2. This creates the user document in Firestore
3. Then access the super admin dashboard

## Quick Diagnostic Steps

### Step 1: Check if API is Running
```bash
# Open any terminal and run:
curl http://localhost:8000/health

# You should get:
# {"status":"healthy","service":"GIA API"}
```

### Step 2: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for error messages with details about:
   - Network error
   - API URL being called
   - Status code
   - CORS issues

### Step 3: Check Network Tab
1. Open DevTools → Network tab
2. Refresh the page
3. Look for the `/admin/analytics/overview` request
4. Check:
   - Status code (should be 200)
   - Response (should have data)
   - Request headers (should have Authorization: Bearer token)

### Step 4: Verify Authentication
1. Go to any page that requires login
2. Check if you're logged in
3. Check DevTools → Application → Local Storage for `authToken`
4. Token should exist and not be empty

## Common Error Messages & Solutions

### "Network Error"
- **Cause:** API server not running
- **Fix:** Start API with `python -m uvicorn main:app --reload`

### "Failed to fetch"
- **Cause:** CORS or API unreachable
- **Fix:** 
  1. Check API is running on port 8000
  2. Check CORS origins in api/config.py

### "401 Unauthorized"
- **Cause:** Invalid or missing auth token
- **Fix:**
  1. Logout from navbar
  2. Login again with super user email
  3. Refresh page

### "403 Forbidden"
- **Cause:** Logged in but not super user
- **Fix:** Login with `cnssreedhar2001@gmail.com`

### "404 User not found"
- **Cause:** User doesn't exist in Firestore
- **Fix:**
  1. Make sure you're logged in first
  2. This auto-creates the user record
  3. Then refresh the page

## File Structure for Reference
```
/artroom
  /api
    main.py                 # API server
    config.py              # Configuration
    .env                   # API credentials
  /web
    src/
      app/
        superadmin/
          page.tsx         # Super Admin Dashboard
    .env.local             # Frontend config
```

## Environment Setup Checklist

- [ ] API `.env` file configured with Firebase credentials
- [ ] Web `.env.local` file with `NEXT_PUBLIC_API_URL`
- [ ] API running on port 8000
- [ ] Frontend running on port 3000
- [ ] Logged in with super user email
- [ ] Browser console has no CORS errors
- [ ] Network tab shows 200 status for API calls

## Still Having Issues?

1. **Check API logs:** Look at the terminal where API is running
2. **Check Firebase connection:** Make sure serviceAccount.json is valid
3. **Check network connectivity:** Can you reach http://localhost:8000/health?
4. **Clear browser cache:** Ctrl+Shift+Delete and clear all data
5. **Restart both servers:** Kill both terminal windows and start fresh

## Next Steps

Once API is working:
1. Access `/superadmin`
2. Should load with analytics overview
3. Search for users and grant admin access
4. View all orders and payments
