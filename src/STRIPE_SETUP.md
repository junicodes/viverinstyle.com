# 💳 Stripe Payment Integration Guide

## Current Status: ✅ TEST MODE ACTIVE

Your checkout system is fully functional and currently running in **TEST MODE** with demo payment processing.

---

## 🧪 Test Mode (Current Setup)

### Test Cards You Can Use Now:

| Card Number | Brand | Scenario |
|------------|-------|----------|
| `4242 4242 4242 4242` | Visa | Success |
| `4000 0025 0000 3155` | Visa | Requires 3D Secure |
| `4000 0000 0000 9995` | Visa | Declined |

**Expiry:** Any future date (e.g., `12/25`)  
**CVC:** Any 3 digits (e.g., `123`)  
**Name:** Any name

---

## 🚀 Setting Up Real Stripe Payments

### Step 1: Create a Stripe Account

1. Go to https://stripe.com and sign up
2. Complete your business profile
3. Verify your identity (required for live payments)

### Step 2: Get Your API Keys

1. Log in to your Stripe Dashboard
2. Click **Developers** → **API Keys**
3. You'll see two types of keys:

   **Test Keys** (for development):
   - Publishable key: `pk_test_...`
   - Secret key: `sk_test_...`

   **Live Keys** (for production):
   - Publishable key: `pk_live_...`
   - Secret key: `sk_live_...`

### Step 3: Add Keys to Your Server

You need to add your Stripe Secret Key as an environment variable:

1. **In Supabase Dashboard:**
   - Go to **Project Settings** �� **Edge Functions**
   - Add environment variable: `STRIPE_SECRET_KEY`
   - Value: Your secret key (starts with `sk_test_` or `sk_live_`)

2. **Update Server Code:**

The server code needs to be updated to use real Stripe. Edit `/supabase/functions/server/index.tsx`:

```typescript
// At the top of the file, add:
import Stripe from 'npm:stripe@latest';

// Initialize Stripe with your secret key
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-11-20.acacia',
});

// Update the payment intent endpoint:
app.post("/make-server-35e920f3/create-payment-intent", async (c) => {
  try {
    const { amount } = await c.req.json();
    
    // Create real Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'aud',
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    console.log(`Payment intent created: ${paymentIntent.id}`);
    return c.json({ 
      success: true, 
      paymentIntent: {
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      }
    });
  } catch (error) {
    console.log(`Error creating payment intent: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});
```

### Step 4: Update Frontend Checkout

For a production-ready Stripe integration, you should use Stripe Elements. Update `/components/Checkout.tsx`:

```typescript
// Install Stripe Elements in your component
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_YOUR_KEY_HERE'); // Replace with your key

// Then wrap your checkout form with Elements:
<Elements stripe={stripePromise}>
  <CheckoutForm />
</Elements>
```

---

## 🔐 Security Best Practices

### ✅ DO:
- Store secret keys in environment variables only
- Use test keys during development
- Switch to live keys only when ready for production
- Never commit keys to version control
- Use webhooks to verify payment status server-side

### ❌ DON'T:
- Never expose secret keys in frontend code
- Never hardcode API keys
- Don't skip 3D Secure authentication
- Don't trust payment status from frontend only

---

## 💰 Stripe Pricing (Australia)

- **2.9% + 30¢** per successful card charge
- **No monthly fees** for standard plan
- **International cards:** Additional 1.5% fee
- **Instant payouts:** 1.5% fee (optional)

---

## 🧪 Testing Payment Flows

### Successful Payment:
1. Use card: `4242 4242 4242 4242`
2. Fill in valid details
3. Payment should succeed
4. Order created in database

### Failed Payment:
1. Use card: `4000 0000 0000 9995`
2. Payment will be declined
3. Error shown to user
4. No order created

### 3D Secure:
1. Use card: `4000 0025 0000 3155`
2. Additional authentication modal appears
3. Complete authentication
4. Payment succeeds

---

## 📊 Current Implementation

### What's Working Now:

✅ **Checkout Flow:**
- Multi-step checkout (Details → Payment → Confirmation)
- Customer information collection
- Australian address validation
- Guest checkout support

✅ **Payment Processing:**
- Card validation (number, expiry, CVC)
- Demo payment simulation
- Order creation in database
- Success/failure handling

✅ **Test Mode Features:**
- Test card acceptance
- Payment intent creation
- Order confirmation
- Email capture for invoices

### What Needs Real Stripe:

🔧 **For Production:**
- Real card charging
- 3D Secure authentication
- Webhook event handling
- Refund processing
- Dispute management

---

## 🎯 Next Steps

1. **Test the current checkout:**
   - Add items to cart
   - Use test card `4242 4242 4242 4242`
   - Complete checkout
   - Verify order is created

2. **When ready for real payments:**
   - Create Stripe account
   - Add `STRIPE_SECRET_KEY` environment variable
   - Update server code (see Step 3 above)
   - Test with real card (small amount)
   - Switch to live keys when ready

3. **Optional enhancements:**
   - Add Stripe Elements for better card input
   - Implement webhooks for payment confirmation
   - Add support for Apple Pay / Google Pay
   - Set up email receipts via Stripe

---

## 🆘 Troubleshooting

### "Payment failed" error:
- Check that environment variable is set
- Verify Stripe key is correct
- Check server logs for details

### Card declined in test mode:
- Use test card `4242 4242 4242 4242`
- Ensure expiry is future date
- Check CVC is 3 digits

### Order not created:
- Check browser console for errors
- Verify server endpoint is accessible
- Check database connection

---

## 📞 Support

- **Stripe Documentation:** https://stripe.com/docs
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Test Cards:** https://stripe.com/docs/testing

---

**Built for Vivere In Style**  
**Adelaide, SA 5000, Australia 🇦🇺**
