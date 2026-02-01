# Login 401 Error Fix

## Problem
When logging in, users get 401 Unauthorized error when trying to access protected endpoints like Super Admin Dashboard.

Error: `INFO:     127.0.0.1:54360 - "GET /admin/analytics/overview HTTP/1.1" 401 Unauthorized`

## Root Cause
The `get_current_user` dependency in the API was:
1. Verifying the Firebase auth token (✓ works)
2. Trying to fetch user from Firestore database (✗ fails if user doesn't exist there)
3. Returning 401 if user not found in Firestore

**The problem:** Users authenticated via Firebase auth may not have a profile in Firestore yet, causing 401 errors.

## Solution
Updated `get_current_user` function in `api/main.py` to:

1. Verify Firebase auth token
2. Check if user exists in Firestore
3. **If not found:** Create a user profile automatically from Firebase auth data
4. Save the new profile to Firestore for future requests
5. Return the user data (whether found or created)

This way:
- First time users can access protected endpoints
- User profile is created automatically on first request
- Subsequent requests use the cached Firestore profile

## How It Works

### Before (Broken)
```
Login → Firebase Auth ✓ → Get User from Firestore ✗ → 401 Error
```

### After (Fixed)
```
Login → Firebase Auth ✓ → Check Firestore
                              ├─ Found → Return User ✓
                              └─ Not Found → Create Profile → Save to Firestore → Return User ✓
```

## Changes Made

### File: `api/main.py` (Lines 32-79)
- Check if user exists in Firestore
- If not, get Firebase user profile
- Create user document in Firestore
- Fall back to minimal data if Firebase user not found
- Return user data (auto-created if needed)

## Testing

### Step 1: Start API
```bash
cd api
python -m uvicorn main:app --reload
```

### Step 2: Create New Account
- Go to http://localhost:3000/auth/signup
- Sign up with email and password OR Google
- You'll be redirected to home page

### Step 3: Access Protected Endpoints
- Go to http://localhost:3000/superadmin (if super user)
- Go to http://localhost:3000/artist (if artist/admin)
- Should load without 401 errors

### Step 4: Login Again
- Logout from navbar
- Login again with same credentials
- Protected endpoints should work (user now in Firestore)

## What's Happening Behind Scenes

1. **First Login:**
   - Firebase verifies credentials
   - Token is generated
   - API checks Firestore - user not found
   - API gets user from Firebase
   - API creates user profile in Firestore
   - User logged in successfully

2. **Subsequent Logins:**
   - Firebase verifies credentials
   - Token is generated
   - API checks Firestore - user found
   - API returns user profile from Firestore
   - User logged in successfully

## Files Changed
- `api/main.py` - Updated `get_current_user` function

## No User Data Loss
- All previous user data is preserved
- New users get automatic profile creation
- Existing Firestore profiles are not modified

## Benefits
- Seamless login experience
- No manual user creation needed
- Auto-provisioning of user profiles
- Works with Firebase auth and Google sign-in

## Next Steps
1. Restart the API
2. Try logging in again
3. Access super admin or artist dashboard
4. Should work without 401 errors
