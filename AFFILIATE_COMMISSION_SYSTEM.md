# 💰 Affiliate Commission System - Implementation Guide

## Overview

The affiliate system allows admins to generate unique product links. When customers purchase via their link, the admin gets 100% of the amount. Direct website purchases split 90% to admin, 10% to super admin.

---

## 🎯 Commission Structure

### Scenario 1: Purchase via Admin's Affiliate Link
```
Product Price: ₹1,000
↓
Admin gets: ₹1,000 (100%)
Super admin gets: ₹0
↓
Admin's commission: 100%
```

### Scenario 2: Direct Purchase from Website
```
Product Price: ₹1,000
↓
Admin gets: ₹900 (90%)
Super admin gets: ₹100 (10%)
↓
Admin's commission: 90%
Super admin's cut: 10%
```

---

## 🔗 Affiliate Link Structure

### Link Format
```
https://giamarketplace.com/shop/[productId]?ref=[adminId]
```

### Example
```
Product: Handcrafted Painting (ID: prod_12345)
Admin: John (ID: admin_john_001)

Affiliate Link:
https://giamarketplace.com/shop/prod_12345?ref=admin_john_001
```

### How It Works
```
1. Admin generates link
2. Admin shares link
3. Customer clicks link
4. Customer lands on product page
5. Customer purchases
6. System detects ref parameter
7. Commission credited to admin
```

---

## 📊 Implementation Details

### Database Schema

#### Affiliate Links Table
```typescript
{
  id: string
  adminId: string
  productId: string
  slug: string
  uniqueLink: string
  clicks: number
  conversions: number
  totalRevenue: number
  createdAt: timestamp
  expiresAt: timestamp (optional)
}
```

#### Commissions Table
```typescript
{
  id: string
  adminId: string
  orderId: string
  productId: string
  amount: number
  commissionPercentage: number
  type: 'affiliate' | 'direct'
  status: 'pending' | 'earned' | 'paid'
  payoutId: string (optional)
  createdAt: timestamp
  paidAt: timestamp
}
```

---

## 🔄 Transaction Flow

### When Customer Buys via Affiliate Link

```
Customer clicks affiliate link
    ↓
URL has ?ref=adminId
    ↓
System stores ref in order
    ↓
Customer completes purchase
    ↓
Payment processed
    ↓
Check order.referredBy (affiliate)
    ↓
If affiliate exists:
  → Credit 100% to admin
  Else (direct purchase):
  → Credit 90% to admin
  → Credit 10% to super admin
    ↓
Create commission record
    ↓
Update admin wallet/earnings
```

---

## 💻 Code Implementation

### 1. Affiliate Link Generation

```typescript
// pages/admin/products/[id]/affiliate.tsx
async function generateAffiliateLink(productId: string, adminId: string) {
  const uniqueLink = `${productId}?ref=${adminId}`
  
  // Save to database
  await db.affiliateLinks.create({
    adminId,
    productId,
    uniqueLink,
    clicks: 0,
    conversions: 0,
    totalRevenue: 0,
  })
  
  return `https://giamarketplace.com/shop/${uniqueLink}`
}
```

### 2. Track Affiliate Click

```typescript
// lib/api/affiliate.ts
export async function trackAffiliateClick(adminId: string, productId: string) {
  await db.affiliateLinks.updateOne(
    { adminId, productId },
    { $inc: { clicks: 1 } }
  )
}
```

### 3. Process Commission on Purchase

```typescript
// api/orders/[id]/complete
async function onOrderComplete(order: Order) {
  const referredBy = order.referredBy // adminId from ?ref param
  
  order.items.forEach(item => {
    const commissionPercent = referredBy ? 100 : 90
    const amount = referredBy 
      ? item.total 
      : item.total * 0.9
    
    // Create commission record
    await db.commissions.create({
      adminId: referredBy || order.adminId,
      orderId: order.id,
      productId: item.productId,
      amount,
      commissionPercentage: commissionPercent,
      type: referredBy ? 'affiliate' : 'direct',
      status: 'earned',
    })
    
    // Update affiliate stats
    if (referredBy) {
      await db.affiliateLinks.updateOne(
        { adminId: referredBy, productId: item.productId },
        {
          $inc: {
            conversions: 1,
            totalRevenue: item.total
          }
        }
      )
    }
  })
  
  // Super admin 10% cut if direct
  if (!referredBy) {
    await db.commissions.create({
      adminId: 'super_admin',
      orderId: order.id,
      amount: order.total * 0.1,
      commissionPercentage: 10,
      type: 'direct',
      status: 'earned',
    })
  }
}
```

### 4. Admin Affiliate Dashboard

```typescript
// pages/admin/affiliate-dashboard.tsx
'use client'

export default function AffiliateDashboard() {
  const [links, setLinks] = useState([])
  const [stats, setStats] = useState({
    totalClicks: 0,
    totalConversions: 0,
    totalEarnings: 0,
    conversionRate: 0,
  })

  useEffect(() => {
    fetchAffiliateData()
  }, [])

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          label="Total Clicks" 
          value={stats.totalClicks}
        />
        <StatCard 
          label="Conversions" 
          value={stats.totalConversions}
        />
        <StatCard 
          label="Conversion Rate" 
          value={`${stats.conversionRate}%`}
        />
        <StatCard 
          label="Total Earnings" 
          value={`₹${stats.totalEarnings}`}
        />
      </div>

      {/* Affiliate Links Table */}
      <table className="mt-8 w-full">
        <thead>
          <tr>
            <th>Product</th>
            <th>Clicks</th>
            <th>Conversions</th>
            <th>Revenue</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {links.map(link => (
            <tr key={link.id}>
              <td>{link.productName}</td>
              <td>{link.clicks}</td>
              <td>{link.conversions}</td>
              <td>₹{link.totalRevenue}</td>
              <td>
                <button onClick={() => copyToClipboard(link.uniqueLink)}>
                  Copy Link
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

---

## 🎯 Admin Features

### Generate Affiliate Link
```
1. Go to product page (admin)
2. Click "Generate Affiliate Link"
3. System creates unique link
4. Display link with copy button
5. Admin shares link
```

### Track Performance
```
View dashboard with:
- Total clicks
- Conversions
- Click-through rate
- Total earnings
- Revenue per product
```

### Payout Requests
```
1. Admin can request payout
2. System calculates total earned
3. Transfers to admin's bank
4. Records transaction
5. Sends confirmation
```

---

## 📊 Analytics

### Affiliate Dashboard Shows

**Performance Metrics:**
- Total clicks on all affiliate links
- Total conversions
- Conversion rate %
- Total earnings from affiliates

**Per-Product Analytics:**
- Clicks per product
- Conversions per product
- Revenue per product
- Best performing products

**Earnings Breakdown:**
- Affiliate earnings (100%)
- Direct sale commission (90%)
- Payment status
- Payout history

---

## 💳 Payout System

### Payout Flow
```
Admin earns ₹X
    ↓
Requests payout
    ↓
System verifies:
  - KYC details complete
  - Bank details verified
  - Amount minimum met
    ↓
If approved:
  → Create payout record
  → Transfer to bank (API)
  → Send notification
  → Update earnings
    ↓
Admin receives funds
```

### Payout Thresholds
```
Minimum payout: ₹100
Maximum per transaction: ₹50,000
Processing time: 2-3 business days
```

---

## 🔐 Security

### Prevent Fraud
✅ Validate ref parameter  
✅ Check admin exists  
✅ Verify product ownership  
✅ Log all transactions  
✅ Rate limit API calls  

### Verify Authenticity
✅ Admin must own product  
✅ Link expires after 90 days  
✅ Can't exceed 100% commission  
✅ Audit trail enabled  

---

## 📱 Mobile View

### Affiliate Link Sharing
```
1. Admin sees affiliate link
2. Options to:
   - Copy to clipboard
   - Share via WhatsApp
   - Share via Email
   - Share on Instagram
   - Share on Facebook
3. Easy one-click sharing
```

---

## 📊 Reporting

### Commission Report
```
Date Range: Jan 1 - Jan 31
Total Sales: ₹50,000
  ├─ Affiliate Sales: ₹30,000 (60%)
  ├─ Direct Sales: ₹20,000 (40%)

Earnings:
  ├─ From Affiliate: ₹30,000
  ├─ From Direct: ₹18,000
  ├─ Total: ₹48,000

Paid: ₹30,000
Pending: ₹18,000
```

---

## 🔄 Integration Points

### 1. Order Processing
- Detect ref parameter
- Store in order record
- Calculate commission

### 2. Payment Gateway
- Process payment normally
- Trigger commission logic
- Update admin balance

### 3. Admin Dashboard
- Show affiliate stats
- Display earnings
- Offer payout option

### 4. User Profile
- Link bank details
- KYC verification
- Payout history

---

## 🎯 Implementation Roadmap

### Phase 1 (Current)
- [x] System design
- [x] Database schema
- [x] Commission logic
- [ ] API endpoints

### Phase 2
- [ ] Admin dashboard
- [ ] Link generation
- [ ] Performance tracking
- [ ] Payout requests

### Phase 3
- [ ] Automated payouts
- [ ] Advanced analytics
- [ ] Marketing tools
- [ ] Commission reports

---

## 🧪 Testing

### Test Affiliate Purchase
```
1. Generate affiliate link
2. Purchase via link
3. Verify commission credited
4. Check admin earnings
5. Confirm payout eligibility
```

### Test Direct Purchase
```
1. Buy without ref param
2. Verify 90/10 split
3. Check admin gets 90%
4. Check super admin gets 10%
```

### Test Commission Calculation
```
Product: ₹1,000
├─ Via affiliate → Admin: ₹1,000
├─ Direct → Admin: ₹900, Super: ₹100
```

---

## 📞 APIs Needed

### Commission Endpoints

```
POST   /api/affiliate/generate-link
GET    /api/affiliate/links
GET    /api/affiliate/stats
GET    /api/affiliate/earnings
POST   /api/affiliate/request-payout
GET    /api/affiliate/payout-history
```

### Commission Calculation

```
// Affiliate purchase
commission = product.price * 1.0

// Direct purchase  
adminCom = product.price * 0.9
superCom = product.price * 0.1
```

---

## ✅ Checklist

- [ ] Database schema created
- [ ] Commission calculation logic
- [ ] Affiliate link generation
- [ ] Performance tracking
- [ ] Admin dashboard
- [ ] Payout system
- [ ] API endpoints
- [ ] Testing complete
- [ ] Documentation done
- [ ] Deployment ready

---

## 📚 Data Flow Summary

```
Customer clicks affiliate link
    ↓
ref=adminId added to URL
    ↓
Lands on product page
    ↓
Makes purchase
    ↓
System sees ref param
    ↓
Credits 100% to admin
(or 90% if no affiliate)
    ↓
Updates affiliate stats
    ↓
Admin can request payout
    ↓
Money transferred to bank
```

---

## 🎉 Result

✅ Admins can earn 100% via affiliate links  
✅ Direct sales split 90/10  
✅ Transparent commission tracking  
✅ Easy payout process  
✅ Performance analytics included  

---

**Status:** Ready for Backend Integration  
**Next Step:** Create API endpoints  
**Expected Launch:** Q1 2026
