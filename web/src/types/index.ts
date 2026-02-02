export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  portfolioUrl?: string
  role: 'user' | 'artist' | 'admin'
  createdAt: Date
  updatedAt: Date
}

export interface Artist {
  id: string
  userId: string
  artForm: string
  region: string
  yearsOfPractice: number
  bio: string
  portfolio: string[]
  avatar?: string
  verified: boolean
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  image: string
  images: string[]
  category: string
  artistId: string
  artStory: string
  careInstructions: string
  culturalContext: string
  stock: number
  createdAt: Date
  updatedAt: Date
}

export interface Cart {
  userId: string
  items: CartItem[]
  total: number
  updatedAt: Date
}

export interface CartItem {
  productId: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  paymentId?: string
  paymentStatus: 'pending' | 'completed' | 'failed'
  shippingAddress: Address
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  productId: string
  title: string
  quantity: number
  price: number
}

export interface Address {
  fullName: string
  phone: string
  email: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface Subscription {
  id: string
  userId: string
  plan: 'monthly' | 'yearly'
  status: 'active' | 'cancelled' | 'expired'
  subscriptionId?: string
  startDate: Date
  renewalDate: Date
  createdAt: Date
}

export interface BlogPost {
  id: string
  title: string
  content: string
  author: string
  authorId: string
  category: string
  featuredImage: string
  images: string[]
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Magazine {
  id: string
  issue: number
  title: string
  description: string
  coverImage: string
  content: string
  articles: string[]
  releaseDate: Date
  createdAt: Date
}

export interface WorkWithUsApplication {
  id: string
  userId: string
  artForm: string
  region: string
  yearsOfPractice: number
  portfolio: string[]
  bio: string
  mobileNumber: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

export interface WorkWithUsCreate {
  artistName: string
  email: string
  artForm: string
  region: string
  yearsOfPractice: number
  portfolio: string[]
  bio: string
  mobileNumber: string
}
