# Vivere In Style — Development Changes Documentation

## Architecture

- **Frontend**: Vite + React 18 + TypeScript + Tailwind CSS 4
- **Backend**: Supabase Edge Functions (Hono on Deno)
- **Database**: Supabase KV Store (`kv_store_e9dccf07`)
- **Payments**: Stripe (demo mode unless `STRIPE_SECRET_KEY` is set)
- **Emails**: Resend (optional, needs `RESEND_API_KEY`)
- **Hosting**: Netlify (build output: `dist/`)

---

## Environment Variables

### Frontend (`.env` file — read by Vite at build time)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_PROJECT_ID` | Yes | Supabase project ID |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |
| `VITE_STRIPE_PUBLISHABLE_KEY` | No | Stripe publishable key (for future Stripe Elements) |

### Server (Set in Supabase Dashboard → Edge Functions → Secrets)

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Auto | Automatically injected by Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Auto | Automatically injected by Supabase |
| `STRIPE_SECRET_KEY` | No | Stripe secret key. Without this, payments run in demo mode |
| `RESEND_API_KEY` | No | Resend API key for transactional emails (invoices) |
| `OPENAI_API_KEY` | No | OpenAI key for AI product descriptions in admin |

### Setting Stripe for live payments

1. Create a Stripe account at https://stripe.com
2. Get your keys from https://dashboard.stripe.com/apikeys
3. Add `STRIPE_SECRET_KEY` to Supabase Edge Function secrets
4. Optionally add `VITE_STRIPE_PUBLISHABLE_KEY` to `.env` for future Stripe Elements integration

**Payment Gateway**: Stripe. Currently the checkout collects card details and creates a Stripe PaymentIntent on the server. In demo mode (no secret key), a mock payment intent is created and orders go through immediately.

---

## What Was Changed

### 1. SEO & Technical Optimization

- **`index.html`**: Proper title, meta description, keywords, OG tags, Twitter card, Google Search Console verification tag (`MbvV-prGv_zakWfClIpITyvxEthi7vOJhxVIQJuF8R8`), robots meta
- **`SEO.tsx`**: Fixed brand name "Living in Style" → "Vivere In Style" everywhere. Added BreadcrumbList structured data. Updated product schemas with seller info. Fixed social media links.
- **Per-page SEO**: Added `<Helmet>` with unique title/description to CategoryPage, CollectionPage, ProductDetailPage, BlogPage
- **`robots.txt`** and **`sitemap.xml`**: Created in `/public/`
- **H1 headings**: Added proper H1 on home page. All pages now have semantic H1 tags.
- **URL structure**: Category pages at `/collections/{slug}`, products at `/products/{slug}` with `pushState`

### 2. Business Info Updated

- **Address**: 8/105 O'Sullivan Road, Lonsdale SA 5160
- **Phone**: 0424 023 996
- **Email**: hello@vivereinstyle.com
- Updated in: Footer, SEO structured data, Contact Us page, FAQ, Terms, Privacy Policy, Returns, Warranty, Shipping, email templates

### 3. Showroom / Appointment Section

- Added "Visit Our Showroom" section on homepage with:
  - By-appointment-only messaging
  - Address, phone, email
  - "Book an Appointment" button → Contact page
- Showroom notice also appears in checkout sidebar

### 4. Inventory Fix

- **Root issue**: Admin-uploaded products had `stock` (number) but never set `inStock` (boolean), so all appeared as "Out of Stock"
- **Fix**: `inStock` is now derived from `stock > 0` in:
  - `AddProductForm.tsx` (client-side)
  - Server create/update product endpoints
  - `isProductInStock()` utility checks both fields
- Stock min changed from 1 to 0 (admin can mark items out of stock)
- Out of stock items now show "Pre-order" badge instead of "Out of Stock"

### 5. Default Light Theme

- App defaults to light theme on first visit (removed `prefers-color-scheme: dark` fallback)
- Users can still toggle to dark mode manually

### 6. Routing — All Pages Wired Up

All footer/info pages now properly routed via SPA navigation:
`brand-story`, `faq`, `contact-us`, `shipping-delivery`, `returns-refunds`, `warranty`, `privacy-policy`, `sitemap`, `blogs`, `wishlist`

Footer uses `onNavigate` prop for SPA navigation instead of full page reloads.

### 7. Blog System

- **Public blog** at `/blogs` with category filtering, featured post hero, individual article pages
- **Admin blog management** (Blog tab in admin dashboard): create, edit, delete posts
- Blog data stored in Supabase KV as `blog:{id}` entries
- Default 6 starter articles included as fallback
- Server endpoints: `GET /blogs`, `GET /blogs/:slug`, `POST/PUT/DELETE /admin/blogs`

### 8. Checkout Redesign (Fleur Studios-inspired)

- **Full-page checkout** instead of modal overlay
- **Two-step flow**: Delivery details → Payment
- **State-based shipping rates**: Free for SA, $149-$399 for other states
- **Order summary sidebar** with product images, quantities, subtotal, shipping, total
- **Recommended products** ("You may also like") shown during checkout
- **Showroom info** in checkout sidebar
- **Trust signals**: Warranty, shipping, phone number
- **Delivery summary** shown on payment step with edit link

### 9. Navigation — Mega Menu

- **Shop dropdown** with organized sections:
  - By Type: Sofas, Chairs, Tables, Beds, Storage
  - By Material: Leather, Velvet, Wood, Marble, Metal, Fabric
  - "Shop All" and "View Complete Collection" links
- **About** and **Journal** (blog) links
- Mobile accordion-style shop menu
- Desktop mega menu with hover-open

### 10. Wishlist Page

- Heart icon in header with count badge
- Full wishlist page at `/wishlist`
- Add to cart / remove from wishlist actions
- Uses existing Zustand `favorites` store

### 11. Customer Photos & Testimonials — Admin Managed

- Both sections now fetch from API (fallback to defaults)
- **Content tab** in admin dashboard to add/remove:
  - Customer photos (name, location, image URL)
  - Testimonials (name, location, rating, review text, product, date)
- Server endpoints for CRUD

### 12. Related Products

- Product detail page shows "You May Also Like" with up to 4 products from the same category

### 13. New Arrivals Section

- Homepage section showing the 8 most recently added products

### 14. Layout Widened

- Content containers widened from `max-w-7xl` (1280px) to `max-w-[1600px]`
- Product grid shows 5 columns on 2XL screens
- Affects: Header, Footer, all homepage sections, category/collection/product pages

### 15. Removed Dev Clutter

- Floating "Reload Demo Data" button removed
- MigrationWizard / SimpleSetupGuide removed from app
- Debug console.logs removed
- Unused imports cleaned up
- Fake analytics growth percentages removed
- Fake chart data removed (charts only show with real data)

### 16. Clear All Orders

- Admin can clear all orders from Overview tab
- Uses direct Supabase client delete with fallback approaches
- Fixed KV key double-prefix bug in seed and delete operations

### 17. Environment Variables

- Created `.env` with `VITE_SUPABASE_PROJECT_ID` and `VITE_SUPABASE_ANON_KEY`
- Created `.env.example` as safe-to-commit template
- Created `.gitignore` to exclude `.env`, `node_modules`, build output
- `src/utils/supabase/info.tsx` reads from `import.meta.env` with fallbacks

---

## Shipping Integration Notes

### Current Setup
State-based flat rates built into the checkout:
- **SA**: Free
- **VIC/ACT**: $149-199
- **NSW**: $199
- **QLD**: $249
- **TAS**: $299
- **WA**: $349
- **NT**: $399

### Australia Post API (Future)
For accurate shipping quotes, integrate the Australia Post PAC API:
- API: https://developers.auspost.com.au/
- Use for smaller parcels and standard items
- Requires API key (set as `AUSPOST_API_KEY` in Supabase secrets)

### Freight Providers (Recommended for Furniture)
For bulky/heavy furniture items, consider:
- **Direct Freight Express**: https://www.directfreight.com.au/
- **Toll Group**: https://www.tollgroup.com/
- **TNT/FedEx**: https://www.tnt.com/express/en_au/site/home.html
- **Hunter Express**: For Adelaide metro
- These typically require a business account and provide API access for quoting

### Recommended Approach
1. Use flat rates (current) as the baseline
2. Add Australia Post API for smaller items (decor, accessories)
3. Partner with a freight provider (Direct Freight or Toll) for large furniture
4. Add weight/dimensions to products in admin to enable accurate quoting

---

## Admin Access

Admin emails are set in `src/supabase/functions/server/index.tsx`:
- `admin@vivereinstyle.com`
- `superadmin@vivereinstyle.com`

To add a new admin, add the email to the `ADMIN_EMAILS` array and redeploy the edge function.

Passwords are managed through Supabase Auth. Reset at:
`https://supabase.com/dashboard/project/awmgkhticthegwazfkoq/auth/users`

---

## Deployment

- **Build command**: `npm run build`
- **Output directory**: `dist/`
- **Platform**: Netlify
- Set `VITE_SUPABASE_PROJECT_ID` and `VITE_SUPABASE_ANON_KEY` as environment variables in Netlify dashboard
