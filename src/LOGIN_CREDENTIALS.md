# 🔐 Vivere In Style - Login Credentials

## Test Accounts

### Admin Account
**Email:** `admin@vivereinstyle.com`  
**Password:** `admin123`

> 🔒 **Security Note:** Admin access is controlled server-side. Only emails in the server's admin list receive admin privileges. This cannot be bypassed from the frontend.

### Customer Account
**Email:** `customer@vivereinstyle.com`  
**Password:** `customer123`

---

## Creating New Accounts

### Option 1: Sign Up with Email
1. Click the **Login** button in the header
2. Switch to the **Sign Up** tab
3. Fill in your details:
   - Full Name
   - Email
   - Password (minimum 6 characters)
   - Confirm Password
4. Click **Create Account**

> 🔒 **Admin Access:** Admin privileges are granted server-side based on a predefined list of admin emails. Regular users cannot self-assign admin access.

### Option 2: Sign In with Google
1. Click **Continue with Google** button
2. Follow Google authentication flow
3. ⚠️ **Important:** You must first configure Google OAuth in Supabase:
   - Go to: https://supabase.com/docs/guides/auth/social-login/auth-google
   - Follow the setup instructions
   - Add authorized redirect URLs in Google Console

---

## Features by Role

### Admin Features
- ✅ Access to Admin Panel
- ✅ Create/Edit/Delete Products
- ✅ Create/Edit/Delete Categories
- ✅ View All Orders
- ✅ Full product management

### Customer Features
- ✅ Browse Products
- ✅ Add to Cart (stored in localStorage)
- ✅ Favorite Products (stored in localStorage)
- ✅ Place Orders
- ✅ Search Products
- ✅ View Product Details
- ✅ Checkout with Payment

---

## Payment Testing

### Test Card Details (Stripe Demo)
**Card Number:** `4242 4242 4242 4242`  
**Expiry:** Any future date (e.g., `12/25`)  
**CVC:** Any 3 digits (e.g., `123`)

> 💡 Payment is in demo mode. No real charges will be made.

---

## Quick Start Guide

1. **Browse Products**
   - Scroll through the home page
   - Click on categories (Sofas, Chairs, Tables, Beds, Storage)
   - Use the search bar to find specific items

2. **Add to Favorites**
   - Hover over any product card
   - Click the ❤️ heart icon
   - Favorites are saved to localStorage

3. **Shopping Cart**
   - Click on any product to view details
   - Select color, material, and size options
   - Click **Add to Cart**
   - Cart is saved to localStorage (Supabase when logged in)

4. **Checkout**
   - Click the cart icon in the header
   - Review your items
   - Click **Proceed to Checkout**
   - Fill in shipping details
   - Enter payment information
   - Complete your order

5. **Admin Panel** (Admin accounts only)
   - Click on your profile name in the header
   - Access the Admin Panel
   - Manage products and categories

---

## Data Storage

### When NOT Logged In
- Cart → localStorage
- Favorites → localStorage
- Newsletter → localStorage

### When Logged In
- Cart → Synced to Supabase
- Orders → Saved to Supabase
- User Profile → Supabase Auth

---

## Features Implemented

### ✅ Fixed Issues
1. **Hero Section "Buy Now" button** - Now correctly identifies and opens the product related to the current slide
2. **Hero slider indicators** - Fixed overlap issue, moved to proper position
3. **Page Navigation** - FAQ, Returns & Refunds, Warranty, all information pages working
4. **Favorites** - Fully implemented with localStorage persistence
5. **Checkout & Payment** - Complete Stripe integration (demo mode)
6. **Newsletter** - Subscription saves to localStorage
7. **Search** - Database search with real-time results
8. **Ratings Display** - Clean format: ★ 4.6 (not 4.631527240507284)
9. **Logo** - Creative new design with emerald gradient
10. **3D Animation** - Interactive floating elements on hero section
11. **Supabase Connection** - Shows in console only, not UI
12. **Cart Storage** - localStorage for guests, Supabase for logged-in users
13. **Google Login** - Fully configured (requires Supabase OAuth setup)

### 🎨 Design Improvements
- New vibrant logo with emerald/teal gradient
- 3D floating animation on hero section
- Better search interface with dropdown results
- Improved rating display
- Enhanced checkout with payment form

### 📱 Responsive Design
- Mobile-friendly navigation
- Touch-optimized carousel
- Responsive product grids
- Mobile checkout flow

---

## Troubleshooting

### Can't Login?
1. Make sure you've created an account first via Sign Up
2. Check that email and password are correct
3. Try creating a new account

### Google Login Not Working?
Follow the setup guide: https://supabase.com/docs/guides/auth/social-login/auth-google

### Cart Not Persisting?
- Without login: Cart saves to localStorage automatically
- With login: Cart syncs to Supabase

### Admin Panel Not Showing?
- Admin access is controlled server-side only
- Your email must be in the server's admin list
- Contact system administrator to request admin access
- Test admin account: admin@vivereinstyle.com

---

## Support

For questions or issues:
- Email: hello@vivereinstyle.com
- Website: vivereinstyle.com
- Location: Adelaide SA 5000, Australia

---

**Last Updated:** November 10, 2025  
**Version:** 2.0.0  
**Status:** Production Ready ✅
