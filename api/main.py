from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from datetime import datetime
import uuid

from config import settings
from firebase_service import firebase_service
from auth_service import auth_service
from razorpay_service import razorpay_service
from models import (
    User, UserCreate, Product, ProductCreate, Order, OrderCreate,
    BlogPost, BlogPostCreate, Magazine, WorkWithUsApplication, WorkWithUsCreate
)

app = FastAPI(
    title="GIA API",
    description="Great India Arts - Marketplace API",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency to get current user
async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header"
        )
    
    try:
        token = authorization.replace("Bearer ", "")
        decoded = auth_service.verify_token(token)
        
        # Try to get user from Firestore
        user_data = firebase_service.get_document("users", decoded["uid"])
        
        # If user doesn't exist in Firestore, create basic profile from Firebase
        if not user_data:
            try:
                firebase_user = auth_service.get_user(decoded["uid"])
                user_data = {
                    "id": decoded["uid"],
                    "email": firebase_user.get("email", ""),
                    "name": firebase_user.get("display_name", "User"),
                    "role": "user",
                    "createdAt": datetime.now(),
                    "updatedAt": datetime.now()
                }
                # Save to Firestore for future use with specific document ID
                firebase_service.db.collection("users").document(decoded["uid"]).set(user_data)
            except Exception as e:
                # If we can't get Firebase user either, return minimal data
                user_data = {
                    "id": decoded["uid"],
                    "email": decoded.get("email", ""),
                    "name": decoded.get("name", "User"),
                    "role": "user",
                    "createdAt": datetime.now(),
                    "updatedAt": datetime.now()
                }
        
        return user_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )


# ==================== AUTH ENDPOINTS ====================
@app.post("/auth/signup")
async def signup(user: UserCreate):
    """Create new user account"""
    try:
        # Create Firebase auth user
        firebase_user = auth_service.create_user(user.email, user.password, user.name)
        
        # Create user document in Firestore
        user_data = {
            "email": user.email,
            "name": user.name,
            "phone": user.phone,
            "avatar": None,
            "role": "user",
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        }
        firebase_service.add_document("users", user_data)
        
        return {"message": "User created successfully", "uid": firebase_user["uid"]}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@app.get("/auth/user")
async def get_user(current_user: dict = Depends(get_current_user)):
    """Get current user profile"""
    return current_user


# ==================== PRODUCTS ENDPOINTS ====================
@app.get("/products")
async def get_products(
    skip: int = 0,
    limit: int = 20,
    featured: Optional[bool] = None,
    category: Optional[str] = None
):
    """Get all products with filters"""
    try:
        products = firebase_service.get_collection("products", limit=limit, offset=skip)
        
        if category:
            products = [p for p in products if p.get("category") == category]
        if featured:
            products = [p for p in products if p.get("featured", False)]
        
        return {"items": products, "total": len(products)}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@app.get("/products/{product_id}")
async def get_product(product_id: str):
    """Get single product"""
    try:
        product = firebase_service.get_document("products", product_id)
        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        return product
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@app.post("/products")
async def create_product(
    product: ProductCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create new product (artists and admins only)"""
    try:
        if current_user.get("role") not in ["artist", "admin"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only artists can create products"
            )
        
        product_data = product.dict()
        product_data["artistId"] = current_user["id"]
        product_data["createdAt"] = datetime.now().isoformat()
        product_data["updatedAt"] = datetime.now().isoformat()
        
        doc_id = firebase_service.add_document("products", product_data)
        return {
            "id": doc_id, 
            "title": product_data.get("title"),
            "description": product_data.get("description"),
            "price": product_data.get("price"),
            "stock": product_data.get("stock"),
            "category": product_data.get("category"),
            "image": product_data.get("image"),
            "images": product_data.get("images", []),
            "artStory": product_data.get("artStory"),
            "careInstructions": product_data.get("careInstructions"),
            "culturalContext": product_data.get("culturalContext"),
            "artistId": current_user["id"],
            "createdAt": product_data.get("createdAt"),
            "updatedAt": product_data.get("updatedAt")
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating product: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@app.put("/products/{product_id}")
async def update_product(
    product_id: str,
    product: ProductCreate,
    current_user: dict = Depends(get_current_user)
):
    """Update product (artist owner or admin only)"""
    try:
        existing = firebase_service.get_document("products", product_id)
        if not existing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Product not found"
            )
        
        if existing.get("artistId") != current_user["id"] and current_user.get("role") != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only modify your own products"
            )
        
        product_data = product.dict()
        product_data["updatedAt"] = datetime.now().isoformat()
        # Preserve createdAt if it exists
        if "createdAt" in existing:
            product_data["createdAt"] = existing["createdAt"]
        
        firebase_service.update_document("products", product_id, product_data)
        return {
            "id": product_id,
            "title": product_data.get("title"),
            "description": product_data.get("description"),
            "price": product_data.get("price"),
            "stock": product_data.get("stock"),
            "category": product_data.get("category"),
            "image": product_data.get("image"),
            "images": product_data.get("images", []),
            "artStory": product_data.get("artStory"),
            "careInstructions": product_data.get("careInstructions"),
            "culturalContext": product_data.get("culturalContext"),
            "artistId": existing.get("artistId"),
            "createdAt": product_data.get("createdAt"),
            "updatedAt": product_data.get("updatedAt")
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating product: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


# ==================== ORDERS ENDPOINTS ====================
@app.post("/orders")
async def create_order(
    order: OrderCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create new order"""
    try:
        # Create Razorpay order
        razorpay_order = razorpay_service.create_order(
            amount=order.total,
            receipt=f"order_{uuid.uuid4().hex[:8]}",
            notes={"userId": current_user["id"]}
        )
        
        # Create order document
        order_data = {
            "userId": current_user["id"],
            "items": [item.dict() for item in order.items],
            "total": order.total,
            "status": "pending",
            "paymentStatus": "pending",
            "paymentId": razorpay_order["id"],
            "shippingAddress": order.shippingAddress.dict(),
            "createdAt": datetime.now(),
            "updatedAt": datetime.now()
        }
        
        doc_id = firebase_service.add_document("orders", order_data)
        
        return {
            "id": doc_id,
            "razorpayOrderId": razorpay_order["id"],
            "razorpayKeyId": settings.razorpay_key_id,
            **order_data
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@app.get("/orders")
async def get_orders(current_user: dict = Depends(get_current_user)):
    """Get user's orders"""
    try:
        orders = firebase_service.query_collection(
            "orders",
            "userId",
            "==",
            current_user["id"]
        )
        return {"items": orders}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@app.post("/orders/{order_id}/payment")
async def verify_payment(
    order_id: str,
    razorpay_order_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str,
    current_user: dict = Depends(get_current_user)
):
    """Verify payment and update order"""
    try:
        # Verify payment
        razorpay_service.verify_payment(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        )
        
        # Update order status
        firebase_service.update_document(
            "orders",
            order_id,
            {
                "status": "confirmed",
                "paymentStatus": "completed",
                "updatedAt": datetime.now()
            }
        )
        
        return {"message": "Payment verified successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


# ==================== BLOG/ARTROOM ENDPOINTS ====================
@app.get("/blog")
async def get_blog_posts(skip: int = 0, limit: int = 20):
    """Get all blog posts"""
    try:
        posts = firebase_service.get_collection("blog_posts", limit=limit, offset=skip)
        posts = [p for p in posts if p.get("published", False)]
        return {"items": posts}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@app.get("/blog/{post_id}")
async def get_blog_post(post_id: str):
    """Get single blog post"""
    try:
        post = firebase_service.get_document("blog_posts", post_id)
        if not post or not post.get("published"):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found"
            )
        return post
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@app.post("/blog")
async def create_blog_post(
    post: BlogPostCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create blog post (admin/artists only)"""
    try:
        if current_user.get("role") not in ["artist", "admin"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permission denied"
            )
        
        post_data = post.dict()
        post_data["authorId"] = current_user["id"]
        post_data["author"] = current_user.get("name", "Anonymous")
        post_data["createdAt"] = datetime.now()
        post_data["updatedAt"] = datetime.now()
        
        doc_id = firebase_service.add_document("blog_posts", post_data)
        return {"id": doc_id, **post_data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


# ==================== MAGAZINE ENDPOINTS ====================
@app.get("/magazine")
async def get_magazines(skip: int = 0, limit: int = 10):
    """Get all magazines"""
    try:
        magazines = firebase_service.get_collection("magazines", limit=limit, offset=skip)
        return {"items": magazines}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@app.post("/magazine")
async def create_magazine(
    magazine: Magazine,
    current_user: dict = Depends(get_current_user)
):
    """Create magazine (super user only)"""
    try:
        if current_user.get("email") != "cnssreedhar2001@gmail.com":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only super user can upload magazine"
            )
        
        magazine_data = magazine.dict()
        magazine_data["createdAt"] = datetime.now()
        
        doc_id = firebase_service.add_document("magazines", magazine_data)
        return {"id": doc_id, **magazine_data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


# ==================== WORK WITH US ENDPOINTS ====================
@app.post("/work-with-us")
async def apply_work_with_us(
    application: WorkWithUsCreate,
    current_user: dict = Depends(get_current_user)
):
    """Submit artist application"""
    try:
        app_data = application.dict()
        app_data["userId"] = current_user["id"]
        app_data["status"] = "pending"
        app_data["createdAt"] = datetime.now()
        app_data["updatedAt"] = datetime.now()
        
        doc_id = firebase_service.add_document("work_with_us_applications", app_data)
        return {"id": doc_id, **app_data}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


# ==================== ARTIST DASHBOARD ENDPOINTS ====================
@app.get("/artist/products")
async def get_artist_products(current_user: dict = Depends(get_current_user)):
    """Get all products for current artist/admin"""
    try:
        if current_user.get("role") not in ["artist", "admin"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only artists can access this"
            )
        
        products = firebase_service.query_collection(
            "products",
            "artistId",
            "==",
            current_user["id"]
        )
        return {"items": products, "total": len(products)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@app.get("/artist/orders")
async def get_artist_orders(current_user: dict = Depends(get_current_user)):
    """Get orders for products sold by artist/admin"""
    try:
        if current_user.get("role") not in ["artist", "admin"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only artists can access this"
            )
        
        # Get artist's products
        products = firebase_service.query_collection(
            "products",
            "artistId",
            "==",
            current_user["id"]
        )
        product_ids = [p.get("id") for p in products]
        
        # Get all orders and filter by product IDs
        all_orders = firebase_service.get_collection("orders")
        artist_orders = [
            o for o in all_orders
            if any(item.get("productId") in product_ids for item in o.get("items", []))
        ]
        
        return {"items": artist_orders, "total": len(artist_orders)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@app.get("/artist/analytics")
async def get_artist_analytics(current_user: dict = Depends(get_current_user)):
    """Get analytics for artist dashboard"""
    try:
        if current_user.get("role") not in ["artist", "admin"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only artists can access this"
            )
        
        # Get artist's products
        products = firebase_service.query_collection(
            "products",
            "artistId",
            "==",
            current_user["id"]
        )
        product_ids = [p.get("id") for p in products]
        
        # Get all orders
        all_orders = firebase_service.get_collection("orders")
        
        # Filter orders for this artist's products
        artist_orders = [
            o for o in all_orders
            if any(item.get("productId") in product_ids for item in o.get("items", []))
        ]
        
        # Calculate analytics
        completed_orders = [o for o in artist_orders if o.get("paymentStatus") == "completed"]
        pending_orders = [o for o in artist_orders if o.get("paymentStatus") == "pending"]
        
        total_sales = sum(o.get("total", 0) for o in completed_orders)
        total_items = sum(len(o.get("items", [])) for o in completed_orders)
        
        return {
            "totalProducts": len(products),
            "totalOrders": len(artist_orders),
            "completedOrders": len(completed_orders),
            "pendingOrders": len(pending_orders),
            "totalSales": total_sales,
            "totalItemsSold": total_items,
            "averageOrderValue": total_sales / len(completed_orders) if completed_orders else 0
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


# ==================== SUPER USER DASHBOARD ENDPOINTS ====================
@app.get("/admin/analytics/overview")
async def get_dashboard_overview(current_user: dict = Depends(get_current_user)):
    """Get dashboard overview (super user only)"""
    try:
        if current_user.get("email") != "cnssreedhar2001@gmail.com":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Super user only"
            )
        
        users = firebase_service.get_collection("users")
        orders = firebase_service.get_collection("orders")
        products = firebase_service.get_collection("products")
        
        total_revenue = sum(o.get("total", 0) for o in orders if o.get("paymentStatus") == "completed")
        total_orders = len(orders)
        completed_orders = len([o for o in orders if o.get("paymentStatus") == "completed"])
        pending_orders = len([o for o in orders if o.get("paymentStatus") == "pending"])
        
        return {
            "totalUsers": len(users),
            "totalOrders": total_orders,
            "completedOrders": completed_orders,
            "pendingOrders": pending_orders,
            "totalRevenue": total_revenue,
            "totalProducts": len(products),
            "averageOrderValue": total_revenue / completed_orders if completed_orders > 0 else 0
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@app.get("/admin/users/search")
async def search_users(
    query: str = "",
    current_user: dict = Depends(get_current_user)
):
    """Search users (super user only)"""
    try:
        if current_user.get("email") != "cnssreedhar2001@gmail.com":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Super user only"
            )
        
        users = firebase_service.get_collection("users")
        
        if query.strip():
            filtered = [
                u for u in users 
                if query.lower() in u.get("email", "").lower() or 
                   query.lower() in u.get("name", "").lower()
            ]
        else:
            filtered = users
        
        return {"items": filtered, "total": len(filtered)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@app.post("/admin/users/{user_id}/grant-admin")
async def grant_admin_access(
    user_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Grant admin access to user (super user only)"""
    try:
        if current_user.get("email") != "cnssreedhar2001@gmail.com":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Super user only"
            )
        
        user = firebase_service.get_document("users", user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        firebase_service.update_document(
            "users",
            user_id,
            {"role": "admin", "updatedAt": datetime.now()}
        )
        
        return {"message": f"Admin access granted to {user.get('email')}", "userId": user_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@app.post("/admin/users/{user_id}/revoke-admin")
async def revoke_admin_access(
    user_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Revoke admin access from user (super user only)"""
    try:
        if current_user.get("email") != "cnssreedhar2001@gmail.com":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Super user only"
            )
        
        user = firebase_service.get_document("users", user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        firebase_service.update_document(
            "users",
            user_id,
            {"role": "user", "updatedAt": datetime.now()}
        )
        
        return {"message": f"Admin access revoked from {user.get('email')}", "userId": user_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@app.get("/admin/orders/all")
async def get_all_orders(current_user: dict = Depends(get_current_user)):
    """Get all orders (super user only)"""
    try:
        if current_user.get("email") != "cnssreedhar2001@gmail.com":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Super user only"
            )
        
        orders = firebase_service.get_collection("orders")
        return {"items": orders, "total": len(orders)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@app.get("/admin/analytics/payments")
async def get_payment_analytics(current_user: dict = Depends(get_current_user)):
    """Get payment analytics (super user only)"""
    try:
        if current_user.get("email") != "cnssreedhar2001@gmail.com":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Super user only"
            )
        
        orders = firebase_service.get_collection("orders")
        
        completed = [o for o in orders if o.get("paymentStatus") == "completed"]
        pending = [o for o in orders if o.get("paymentStatus") == "pending"]
        failed = [o for o in orders if o.get("paymentStatus") == "failed"]
        
        completed_revenue = sum(o.get("total", 0) for o in completed)
        pending_revenue = sum(o.get("total", 0) for o in pending)
        
        return {
            "completedPayments": len(completed),
            "completedRevenue": completed_revenue,
            "pendingPayments": len(pending),
            "pendingRevenue": pending_revenue,
            "failedPayments": len(failed),
            "totalTransactions": len(orders),
            "successRate": (len(completed) / len(orders) * 100) if orders else 0
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@app.get("/admin/analytics/users")
async def get_user_analytics(current_user: dict = Depends(get_current_user)):
    """Get user analytics (super user only)"""
    try:
        if current_user.get("email") != "cnssreedhar2001@gmail.com":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Super user only"
            )
        
        users = firebase_service.get_collection("users")
        orders = firebase_service.get_collection("orders")
        
        admins = [u for u in users if u.get("role") == "admin"]
        artists = [u for u in users if u.get("role") == "artist"]
        regular = [u for u in users if u.get("role") == "user"]
        
        return {
            "totalUsers": len(users),
            "adminCount": len(admins),
            "artistCount": len(artists),
            "regularUsers": len(regular),
            "ordersByUsers": len(set(o.get("userId") for o in orders))
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


# ==================== HEALTH CHECK ====================
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "GIA API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.api_port)
