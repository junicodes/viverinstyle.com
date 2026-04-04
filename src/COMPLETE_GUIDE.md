# 📘 Complete Guide - Living in Style E-Commerce

## 🎯 Overview

**Living in Style** is a fully functional furniture e-commerce platform that runs entirely in your browser using localStorage. No backend, no database, no deployment required.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Features](#features)
3. [Admin Panel](#admin-panel)
4. [Product Management](#product-management)
5. [Order Management](#order-management)
6. [Data Management](#data-management)
7. [Customization](#customization)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Step 1: Open the App
The app loads automatically with 8 demo products.

### Step 2: Browse
Scroll through the product catalog. Click any product for details.

### Step 3: Admin Access
Click the **🛡️ Shield icon** in the header to open the admin panel.

### Step 4: Start Customizing
Add your own products, edit existing ones, manage your catalog.

---

## ✨ Features

### Customer-Facing Features

#### Product Catalog
- **8 Demo Products** across 5 categories
- **Product Images** with zoom capability
- **Detailed Descriptions** and features list
- **Customer Ratings** and reviews
- **Price Display** with discount indicators

#### Product Customization
- **Color Selection** - Choose from available colors
- **Material Options** - Select different materials
- **Dimension Adjustments** - Modify size
- **Price Updates** - See price change with options

#### Shopping Cart
- **Add to Cart** - One-click add
- **Quantity Management** - Adjust amounts
- **Remove Items** - Delete from cart
- **Subtotal** - Running total
- **Persistent Cart** - Saves across sessions

#### Checkout
- **Shipping Form** - Name, address, contact
- **Order Summary** - Review items
- **Order Confirmation** - Unique order ID
- **Order Tracking** - View in admin panel

### Admin Features

#### Product Management
- **Create Products** - Add new items
- **Edit Products** - Modify existing items
- **Delete Products** - Remove from catalog
- **Bulk Upload** - Use "Reload Demo Data"

#### Category Management
- **Create Categories** - Define new categories
- **Edit Categories** - Update details
- **Delete Categories** - Remove categories
- **Product Count** - See products per category

#### Order Management
- **View Orders** - All customer orders
- **Order Details** - Items, total, customer info
- **Order Status** - Track order state
- **Order History** - Full order log

---

## 🛡️ Admin Panel

### Accessing Admin Panel

**Desktop:**
1. Click the **🛡️ Shield icon** in the header (top-right)
2. Admin dashboard opens

**Mobile:**
Shield icon hidden on mobile by default (small screen). To enable:
1. Edit `/components/Header.tsx`
2. Remove `hidden sm:block` from shield button
3. Access on mobile

### Admin Panel Layout

```
┌─────────────────────────────────────┐
│  Admin Dashboard              [X]   │
├─────────────────────────────────────┤
│  [Products] [Categories] [Orders]   │
├─────────────────────────────────────┤
│                                     │
│  Content Area                       │
│  (Products, Categories, or Orders)  │
│                                     │
└─────────────────────────────────────┘
```

### Tabs

1. **Products Tab**
   - Grid of all products
   - Add Product button
   - Edit/Delete actions per product

2. **Categories Tab**
   - List of categories
   - Add Category button
   - Edit/Delete actions per category

3. **Orders Tab**
   - List of customer orders
   - Order details
   - No edit/delete (orders are immutable)

---

## 📦 Product Management

### Adding a Product

1. **Open Admin Panel** → Products Tab
2. **Click "Add Product"**
3. **Fill Required Fields:**
   - **Name** - Display name (e.g., "Cloud Modern Sofa")
   - **Slug** - URL-friendly ID (e.g., "cloud-modern-sofa")
   - **Category** - Select from dropdown
   - **Price** - In AUD (e.g., 2499)

4. **Fill Optional Fields:**
   - **Original Price** - For showing discount (e.g., 3299)
   - **Description** - Full product description
   - **Features** - One per line:
     ```
     Premium fabric upholstery
     Solid hardwood frame
     10-year warranty
     ```
   - **Image URLs** - One per line:
     ```
     https://images.unsplash.com/photo-1.jpg
     https://images.unsplash.com/photo-2.jpg
     ```
   - **Dimensions**:
     - Width: 220 (cm)
     - Depth: 95 (cm)
     - Height: 85 (cm)
   - **Colors** - Hex codes:
     ```
     #F5F5F5, #2C3E50, #8B4513
     ```
   - **Materials** - Comma-separated:
     ```
     Fabric, Leather, Velvet
     ```
   - **Rating** - 0-5 (e.g., 4.5)
   - **Reviews** - Count (e.g., 127)

5. **Toggle Options:**
   - ✅ **Customizable** - Allow color/material selection
   - ✅ **In Stock** - Show as available
   - ✅ **Featured** - Display in featured section

6. **Click "Save Product"**

### Editing a Product

1. **Find product** in Products tab
2. **Click "Edit"** button
3. **Modify fields** as needed
4. **Click "Save Product"**

### Deleting a Product

1. **Find product** in Products tab
2. **Click "Delete"** button
3. **Confirm deletion**
4. Product removed from catalog

### Product Tips

- **Slugs** must be unique and URL-friendly (lowercase, hyphens, no spaces)
- **Images** must be public URLs (https://)
- **Colors** must be hex codes (#FFFFFF)
- **Categories** must exist before assigning to product
- **Featured** products appear on homepage

---

## 🏷️ Category Management

### Adding a Category

1. **Open Admin Panel** → Categories Tab
2. **Click "Add Category"**
3. **Fill Fields:**
   - **Name** - Display name (e.g., "Sofas & Couches")
   - **Slug** - URL ID (e.g., "sofas")
   - **Description** - Short description
   - **Image URL** - Category image

4. **Click "Save Category"**

⚠️ **Note:** Slug cannot be changed after creation!

### Editing a Category

1. **Find category** in Categories tab
2. **Click "Edit"** button
3. **Modify** name, description, image
4. **Cannot change slug**
5. **Click "Save Category"**

### Deleting a Category

1. **Find category** in Categories tab
2. **Click "Delete"** button
3. **Confirm deletion**

⚠️ **Warning:** Products in that category won't display properly. Reassign them first.

---

## 📊 Order Management

### Viewing Orders

1. **Open Admin Panel** → Orders Tab
2. See list of all orders
3. Each order shows:
   - Order ID
   - Date/Time
   - Status
   - Total amount

### Order Details

Orders contain:
- Customer information (name, email, phone, address)
- Items ordered (products, quantities)
- Total amount
- Order timestamp
- Status (pending/processing/shipped/delivered)

### Order Lifecycle

```
Customer → Add to Cart → Checkout → Order Created
           ↓
Admin Panel → Orders Tab → View Order Details
```

⚠️ **Note:** Orders are read-only. Cannot edit or delete (for data integrity).

---

## 💾 Data Management

### Storage Architecture

All data stored in browser's localStorage:

```javascript
// Products
localStorage.vivere_products = [
  { id: "sofa-1", name: "...", price: 2499, ... },
  { id: "table-1", name: "...", price: 1299, ... }
]

// Categories  
localStorage.vivere_categories = [
  { slug: "sofas", name: "Sofas & Couches", ... },
  { slug: "chairs", name: "Chairs", ... }
]

// Orders
localStorage.vivere_orders = [
  { id: "order-123", total: 3298, items: [...], ... }
]
```

### Data Persistence

- ✅ **Automatic** - Saves after every change
- ✅ **Cross-session** - Data remains after closing browser
- ✅ **Private** - Each browser has its own data
- ❌ **Not synced** - Different browsers = different data

### Reload Demo Data

Button location: **Bottom-right corner** (floating button)

Action: **🔄 Reload Demo Data**

What it does:
1. Clears all localStorage
2. Reloads 8 demo products
3. Reloads 5 categories
4. Keeps empty orders array

When to use:
- Starting fresh
- Testing
- Something went wrong
- Want original products back

### Backup Your Data

**Export Products:**
```javascript
// Open browser console (F12)
console.log(JSON.parse(localStorage.vivere_products))
// Copy the output
```

**Export Categories:**
```javascript
console.log(JSON.parse(localStorage.vivere_categories))
```

**Export Orders:**
```javascript
console.log(JSON.parse(localStorage.vivere_orders))
```

**Import Data:**
```javascript
// Paste your saved data
localStorage.vivere_products = JSON.stringify([
  { id: "...", name: "...", ... },
  // ... more products
])

// Refresh page
location.reload()
```

---

## 🎨 Customization

### Updating Company Info

**Footer** (`/components/Footer.tsx`):
- Company name
- Address  
- Email
- Phone
- Social media links

**Header** (`/components/Header.tsx`):
- Logo
- Site name
- Navigation links

### Changing Colors

**Global Styles** (`/styles/globals.css`):
```css
/* Primary color */
.bg-gray-900 { background: #your-color; }

/* Accent color */
.text-gray-600 { color: #your-color; }
```

### Product Images

**Free Stock Photos:**
- Unsplash.com - Search "furniture"
- Pexels.com - High quality, free
- Pixabay.com - Free images

**Image Requirements:**
- Format: JPG, PNG, WebP
- Size: Recommended 1200x800px
- Hosting: Must be publicly accessible
- URL: Must be HTTPS

**Example URLs:**
```
https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200
https://images.pexels.com/photos/1350789/pexels-photo.jpg
```

### Adding More Categories

Common furniture categories:
- Outdoor Furniture
- Office Furniture
- Kids Furniture
- Lighting
- Decor & Accessories
- Rugs & Carpets
- Mattresses & Bedding

---

## 🚀 Deployment

### Option 1: Vercel

1. Push code to GitHub
2. Go to vercel.com
3. Import repository
4. Deploy (automatic)
5. Get URL: `your-site.vercel.app`

### Option 2: Netlify

1. Push code to GitHub
2. Go to netlify.com
3. New site from Git
4. Select repo
5. Deploy
6. Get URL: `your-site.netlify.app`

### Option 3: GitHub Pages

1. Push to GitHub
2. Settings → Pages
3. Source: main branch
4. Save
5. Get URL: `username.github.io/repo`

### Custom Domain

All hosting platforms support custom domains:
1. Buy domain (Namecheap, GoDaddy)
2. Add DNS records in hosting platform
3. Point domain to your site
4. SSL certificate (automatic)

**Example:** vivereinstyle.com → Your deployed site

---

## 🐛 Troubleshooting

### Products Not Showing

**Problem:** Empty product grid

**Solutions:**
1. Click "Reload Demo Data" (bottom-right)
2. Check browser console for errors
3. Clear browser cache
4. Try incognito/private window

### Admin Panel Won't Open

**Problem:** Shield icon does nothing

**Solutions:**
1. Check if on mobile (hidden by default)
2. Open browser console for errors
3. Refresh page
4. Check `/components/Header.tsx` for AdminPanel import

### Cart Not Working

**Problem:** Add to cart doesn't work

**Solutions:**
1. Check browser console
2. Clear localStorage
3. Reload demo data
4. Check Zustand store (`/store/useStore.ts`)

### Data Lost

**Problem:** Products disappeared

**Causes:**
- Cleared browser cache
- Cleared localStorage
- Different browser
- Incognito/private mode

**Solutions:**
1. Click "Reload Demo Data"
2. Re-add your products via admin panel
3. Import backup if you have one

### Images Not Loading

**Problem:** Broken image icons

**Causes:**
- Invalid image URL
- Image moved/deleted
- CORS issues
- HTTP vs HTTPS

**Solutions:**
1. Verify URL in browser
2. Use HTTPS URLs only
3. Use Unsplash/Pexels URLs
4. Check image still exists

### Checkout Fails

**Problem:** Can't complete order

**Solutions:**
1. Check browser console
2. Verify cart has items
3. Fill all required fields
4. Check `/components/Checkout.tsx`

---

## 📞 Support

### Browser Console

Open with F12 (Windows) or Cmd+Opt+I (Mac)

**Check for errors:**
- Red text = errors
- Yellow text = warnings
- Blue text = info

**Useful commands:**
```javascript
// View products
console.log(localStorage.vivere_products)

// View categories
console.log(localStorage.vivere_categories)

// Clear data
localStorage.clear()

// Reload page
location.reload()
```

### Common Console Errors

**"localStorage is not defined"**
- Solution: Enable localStorage in browser settings

**"Cannot read property 'map' of undefined"**
- Solution: Data not loaded, click "Reload Demo Data"

**"Failed to parse JSON"**
- Solution: Corrupted data, clear localStorage

---

## 🎓 Best Practices

### Product Creation
- ✅ Use clear, descriptive names
- ✅ Provide multiple images
- ✅ List 5-10 features
- ✅ Set realistic prices
- ✅ Add detailed descriptions
- ✅ Use consistent formatting

### Category Organization
- ✅ Limit to 5-10 categories
- ✅ Use clear, simple names
- ✅ Don't overlap categories
- ✅ Add category images
- ✅ Write short descriptions

### Order Management
- ✅ Check orders regularly
- ✅ Note order timestamps
- ✅ Track customer info
- ✅ Export important orders

### Data Management
- ✅ Backup data regularly
- ✅ Test "Reload Demo Data"
- ✅ Don't clear localStorage unless needed
- ✅ Keep backup JSON files

---

## 📚 Additional Resources

### Documentation Files
- `README.md` - Full documentation
- `QUICK_START.md` - Getting started
- `SIMPLIFIED.md` - Architecture explanation
- `STATUS.md` - Current features
- `COMPLETE_GUIDE.md` - This file

### Code Structure
```
/components
  - Header.tsx (Navigation + Admin access)
  - AdminPanel.tsx (Admin dashboard)
  - ProductGrid.tsx (Product display)
  - Cart.tsx (Shopping cart)
  - Checkout.tsx (Order placement)

/utils
  - api.ts (Main API)
  - storage.ts (localStorage wrapper)
  - seedData.ts (Demo products)

/store
  - useStore.ts (Zustand state)

/styles
  - globals.css (Global styles)
```

---

## 🎉 Conclusion

You now have a complete e-commerce platform that:
- ✅ Works immediately, no setup
- ✅ Runs entirely in browser
- ✅ Includes full admin panel
- ✅ Manages products, categories, orders
- ✅ Persists data across sessions
- ✅ Ready to customize
- ✅ Can be deployed anywhere

**Start adding your products and build your online store!** 🚀

---

**Living in Style**  
**Melbourne, VIC 3000, Australia**  
**vivereinstyle.com**
