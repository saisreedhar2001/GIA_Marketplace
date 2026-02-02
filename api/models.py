from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class UserBase(BaseModel):
    email: str
    name: str
    phone: Optional[str] = None


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: str
    avatar: Optional[str] = None
    role: str = "user"
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True


class ArtistBase(BaseModel):
    artForm: str
    region: str
    yearsOfPractice: int
    bio: str


class ArtistCreate(ArtistBase):
    portfolio: List[str] = []


class Artist(ArtistCreate):
    id: str
    userId: str
    avatar: Optional[str] = None
    verified: bool = False
    status: str = "pending"
    createdAt: datetime


class ProductBase(BaseModel):
    title: str
    description: str
    price: float
    image: str
    category: str
    artStory: str
    careInstructions: str
    culturalContext: str
    stock: int = 0


class ProductCreate(ProductBase):
    images: List[str] = []


class Product(ProductCreate):
    id: str
    artistId: str
    createdAt: datetime
    updatedAt: datetime


class CartItemBase(BaseModel):
    productId: str
    quantity: int


class CartItem(CartItemBase):
    price: float


class CartBase(BaseModel):
    items: List[CartItem]


class Address(BaseModel):
    fullName: str
    phone: str
    email: str
    addressLine1: str
    addressLine2: Optional[str] = None
    city: str
    state: str
    postalCode: str
    country: str


class OrderItemBase(BaseModel):
    productId: str
    title: str
    quantity: int
    price: float


class OrderBase(BaseModel):
    items: List[OrderItemBase]
    total: float
    shippingAddress: Address


class OrderCreate(OrderBase):
    pass


class Order(OrderCreate):
    id: str
    userId: str
    status: str = "pending"
    paymentStatus: str = "pending"
    paymentId: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime


class SubscriptionBase(BaseModel):
    plan: str
    status: str = "active"


class Subscription(SubscriptionBase):
    id: str
    userId: str
    subscriptionId: Optional[str] = None
    startDate: datetime
    renewalDate: datetime
    createdAt: datetime


class BlogPostBase(BaseModel):
    title: str
    content: str
    category: str
    featuredImage: str
    published: bool = False


class BlogPostCreate(BlogPostBase):
    images: List[str] = []


class BlogPost(BlogPostCreate):
    id: str
    author: str
    authorId: str
    createdAt: datetime
    updatedAt: datetime


class MagazineBase(BaseModel):
    issue: int
    title: str
    description: str
    coverImage: str
    content: str
    articles: List[str] = []
    releaseDate: datetime


class Magazine(MagazineBase):
    id: str
    createdAt: datetime


class WorkWithUsBase(BaseModel):
    artistName: str
    email: str
    artForm: str
    region: str
    yearsOfPractice: int
    bio: str
    portfolio: List[str]
    mobileNumber: str


class WorkWithUsCreate(WorkWithUsBase):
    pass


class WorkWithUsApplication(WorkWithUsCreate):
    id: str
    userId: str
    status: str = "pending"
    createdAt: datetime
    updatedAt: datetime
