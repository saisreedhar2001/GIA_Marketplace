# Artist Dashboard & Google Sign In Setup

## Overview
This document explains the new Artist Dashboard for admins/artists and Google Sign In authentication.

## Features Implemented

### 1. Google Sign In
**Location:** `/auth/login` and `/auth/signup`

**Features:**
- Click "Sign in with Google" button on login page
- Click "Sign up with Google" button on signup page
- Automatic profile creation on first sign in
- Works for both existing and new users

**Implementation:**
- Uses Firebase Google Authentication
- Stores user profile in backend
- Sets authToken automatically
- Redirects to home after successful authentication

### 2. Artist Dashboard
**Access:** `/artist`
**Who Can Access:** Users with role `admin` or `artist`

**Features:**

#### Overview Tab
- Total Products count
- Total Orders count
- Completed Orders count
- Pending Orders count
- Total Sales (Revenue)
- Total Items Sold
- Average Order Value
- Sales Summary cards

#### Products Tab
- View all uploaded products in grid format
- Shows: Title, Category, Price, Stock
- Edit button - Goes to product edit page
- Delete button - Remove product (if implemented)
- "Upload Product" button when no products

#### Orders Tab
- View all orders for your products
- Shows: Order ID, Amount, Payment Status, Item Count
- Order date
- Payment status indicator (Paid/Pending)

### 3. Product Upload Page
**Location:** `/products/new`
**Access:** Admins and Artists only

**Fields:**
- Product Title *
- Description *
- Price (₹) *
- Stock Quantity *
- Category * (Dropdown: Paintings, Textiles, Pottery, Jewelry, Woodcraft, Metalwork, Other)
- Art Story & Inspiration
- Cultural Context
- Care Instructions
- Product Images (Multiple images support)

**Features:**
- Add multiple product images via URL
- Remove images before upload
- Form validation
- Success/error notifications
- Redirects to artist dashboard after upload

### 4. Product Edit Page
**Location:** `/products/[id]/edit`
**Access:** Product owner or admins

**Features:**
- Load existing product data
- Edit all fields
- Manage images (add/remove)
- Save changes
- Error handling

### 5. Navbar Updates
**New Links for Admins/Artists:**
- "Dashboard" link (→ `/artist`) - appears for admin and artist users
- "Manage" link (→ `/admin`) - appears for admin users only

**Super User Links:**
- "Super Admin" link (→ `/superadmin`) - bold, only for super user

## Backend API Endpoints

### Artist Dashboard Endpoints

#### Get Artist Products
```
GET /artist/products
Returns: {items: [...products], total: count}
```

#### Get Artist Orders
```
GET /artist/orders
Returns: {items: [...orders], total: count}
```

#### Get Artist Analytics
```
GET /artist/analytics
Returns: {
  totalProducts,
  totalOrders,
  completedOrders,
  pendingOrders,
  totalSales,
  totalItemsSold,
  averageOrderValue
}
```

### Product Management Endpoints

#### Create Product
```
POST /products
Requires: ProductCreate object
Returns: {id, ...productData}
```

#### Update Product
```
PUT /products/{product_id}
Requires: ProductCreate object
Returns: {id, ...updatedData}
Access: Product owner or admin only
```

## Authentication Flow

### Google Sign In Flow
1. User clicks "Sign in with Google" button
2. Firebase Google popup opens
3. User authenticates with Google
4. Firebase returns user credential
5. ID token is generated and stored locally
6. Backend profile is created (if new user)
7. User is redirected to home page

### Email/Password Alternative
- Still available on both login and signup pages
- Works alongside Google Sign In
- Users can use either method

## User Roles & Access Control

### Super User (cnssreedhar2001@gmail.com)
- Access to Super Admin Dashboard
- Can grant/revoke admin access
- Can upload magazines
- View all user analytics
- See "Super Admin" link in navbar

### Admin Users
- Access to Artist Dashboard
- Can upload/edit/delete products
- View their product analytics
- See "Dashboard" and "Manage" links in navbar

### Artist Users
- Access to Artist Dashboard
- Can upload/edit their products
- View their sales analytics
- See "Dashboard" link in navbar

### Regular Users
- Can view products and shop
- No dashboard access
- Normal checkout and profile pages

## Data Model

### Product Fields
```
{
  id: string,
  title: string,
  description: string,
  price: number,
  stock: number,
  category: string,
  artStory: string,
  careInstructions: string,
  culturalContext: string,
  image: string (primary image URL),
  images: string[] (all image URLs),
  artistId: string,
  createdAt: datetime,
  updatedAt: datetime
}
```

### Order Fields
```
{
  id: string,
  userId: string,
  items: [{
    productId: string,
    title: string,
    quantity: number,
    price: number
  }],
  total: number,
  paymentStatus: "pending" | "completed" | "failed",
  status: "pending" | "confirmed",
  shippingAddress: {...},
  createdAt: datetime,
  updatedAt: datetime
}
```

## Workflow Examples

### Upload a Product as Artist
1. Login with artist account
2. Click "Dashboard" in navbar
3. Click "Upload Product" button (top right)
4. Fill product details
5. Add images via URL
6. Click "Upload Product"
7. Redirected to artist dashboard

### Edit Your Product
1. Go to Artist Dashboard
2. Switch to "Products" tab
3. Click "Edit" on any product
4. Modify details
5. Click "Save Changes"
6. Redirected back to dashboard

### View Your Sales
1. Go to Artist Dashboard
2. "Overview" tab shows summary stats
3. "Orders" tab shows individual orders
4. Can track payment status (Paid/Pending)

### Grant Admin Access (Super User Only)
1. Login with cnssreedhar2001@gmail.com
2. Click "Super Admin" in navbar
3. Go to "Users" tab
4. Search for user email
5. Click "Grant Admin" button
6. User now has artist dashboard access

## Security Notes
- All artist endpoints verify user role (artist or admin)
- Product edit requires ownership or admin role
- Google authentication uses Firebase secure flow
- Auth token stored in localStorage
- API requires valid Bearer token in Authorization header

## Future Enhancements
- Product deletion endpoint
- Bulk product upload
- Advanced product filters in dashboard
- Sales reports and export
- Inventory management
- Commission tracking
- Payment analytics for artists
- Product review management
