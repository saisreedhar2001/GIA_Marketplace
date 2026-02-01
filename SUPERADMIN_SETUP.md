# Super Admin Dashboard Setup

## Overview
This document explains the Super Admin dashboard setup for managing users, analytics, and permissions.

## Super User Details
**Email:** `cnssreedhar2001@gmail.com`

This user has exclusive access to:
- Super Admin Dashboard
- Grant/Revoke admin access to any user
- View comprehensive analytics
- Upload magazines (exclusive privilege)

## Features

### 1. **Overview Tab**
- Total users, orders, products count
- Revenue analytics
- Order completion status
- Average order value
- Payment analytics (completed, pending, failed)
- User distribution breakdown

### 2. **Users Management Tab**
- **Search Bar**: Search users by email or name
- **Grant Admin Button**: Convert any user to admin
- **Revoke Admin Button**: Remove admin access from any user
- Shows user role, creation date

### 3. **Orders Tab**
- View all orders in the system
- Payment status tracking
- Order amount and items count
- Order status monitoring

### 4. **Analytics Tab**
- **Payment Summary**: Total transactions, total revenue
- **User Statistics**: 
  - Total users
  - Admin count
  - Artist count
  - Regular users count

## Backend Endpoints (Protected - Super User Only)

### Analytics Endpoints
```
GET /admin/analytics/overview
- Returns: totalUsers, totalOrders, completedOrders, pendingOrders, 
          totalRevenue, totalProducts, averageOrderValue

GET /admin/analytics/users
- Returns: User distribution (admin, artist, regular users)

GET /admin/analytics/payments
- Returns: Payment metrics (completed, pending, failed, success rate)
```

### User Management Endpoints
```
GET /admin/users/search?query=...
- Returns: Filtered list of users by email or name

POST /admin/users/{user_id}/grant-admin
- Grants admin role to a user

POST /admin/users/{user_id}/revoke-admin
- Removes admin role from a user
```

### Orders Endpoint
```
GET /admin/orders/all
- Returns: All orders in the system
```

## Access Control

The Super Admin dashboard is protected by email verification:
- Only `cnssreedhar2001@gmail.com` can access the Super Admin dashboard
- All protected endpoints check this email and return 403 Forbidden for others

## Magazine Upload Restriction

Magazine upload endpoint now checks for super user email:
```python
if current_user.get("email") != "cnssreedhar2001@gmail.com":
    raise HTTPException(detail="Only super user can upload magazine")
```

## UI Access

1. **Navigation**: After login with super user account, "Super Admin" link appears in navbar
2. **URL**: `/superadmin` (protected route)
3. **Permission Check**: Automatically redirects to home if non-super-user tries to access

## Workflow Example

### Granting Admin Access to a User
1. Login with `cnssreedhar2001@gmail.com`
2. Go to Super Admin → Users tab
3. Search for the user by email or name
4. Click "Grant Admin" button
5. User's role is updated to "admin"
6. Admin link appears in their navbar

### Revoking Admin Access
1. Same process, but click "Revoke Admin" button
2. User's role reverts to "user"

## Data Displayed

### Stats Shown
- **totalUsers**: Count of all users
- **totalOrders**: All orders placed
- **completedOrders**: Successfully paid orders
- **pendingOrders**: Awaiting payment
- **totalRevenue**: From completed payments
- **totalProducts**: Listed products
- **averageOrderValue**: Avg of completed orders

### Payment Breakdown
- Completed payments with revenue
- Pending payments awaiting completion
- Failed payment tracking
- Success rate percentage

### User Categories
- Admin users (can manage content)
- Artist users (can sell products)
- Regular users (buyers)
- Total users with orders

## Security Notes
- All endpoints verify super user email
- Session-based: Requires valid Firebase token
- Read-only operations with full visibility
- Write operations (grant/revoke) are restricted to super user

## Future Enhancements
- Add date range filtering for analytics
- Export reports as CSV
- Advanced user search with filters
- Payment method breakdown
- Category-wise sales analytics
