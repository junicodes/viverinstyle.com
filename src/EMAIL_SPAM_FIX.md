# 📧 How to Prevent Emails from Going to Spam

## Why Emails Go to Spam

Your emails are currently being sent from Resend's test domain (`onboarding@resend.dev`), which is:
- Shared by all Resend test users
- Not personalized to your brand
- Flagged by email providers as "potentially untrusted"

**Solution:** Verify your own domain (vivereinstyle.com)

---

## ✅ Step-by-Step: Verify Your Domain

### Step 1: Add Domain in Resend

1. Go to **https://resend.com/domains**
2. Click **Add Domain**
3. Enter: `vivereinstyle.com`
4. Click **Add**

### Step 2: Add DNS Records

Resend will show you DNS records to add. You'll need to add these to your domain registrar:

**Example Records (yours will be different):**

```
Type: TXT
Name: _resend
Value: resend-verify=abc123xyz789...
```

```
Type: MX
Name: vivereinstyle.com
Priority: 10
Value: feedback-smtp.us-east-1.amazonses.com
```

```
Type: TXT
Name: vivereinstyle.com
Value: v=spf1 include:amazonses.com ~all
```

```
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCS...
```

### Step 3: Add Records to Your DNS Provider

**If your domain is with:**

#### **Namecheap:**
1. Log in to Namecheap
2. Manage → Advanced DNS
3. Add each record as shown in Resend

#### **GoDaddy:**
1. Log in to GoDaddy
2. My Products → DNS
3. Add each record type

#### **Cloudflare:**
1. Log in to Cloudflare
2. Select your domain
3. DNS → Add Record
4. Add each record

#### **Other Providers:**
- Find DNS settings in your domain control panel
- Add each record exactly as shown in Resend

### Step 4: Verify in Resend

1. Go back to Resend dashboard
2. Click **Verify** next to your domain
3. Wait for verification (can take 1-72 hours)
4. You'll see a green checkmark when verified

### Step 5: Update Server Code

Once verified, update the email sender address in your server:

**File:** `/supabase/functions/server/index.tsx`

**Find this line:**
```typescript
from: "Vivere In Style <onboarding@resend.dev>",
```

**Change to:**
```typescript
from: "Vivere In Style <orders@vivereinstyle.com>",
```

Or any other email like:
- `hello@vivereinstyle.com`
- `noreply@vivereinstyle.com`
- `support@vivereinstyle.com`

---

## 🎯 Results After Domain Verification

### Before (Test Domain):
- ❌ Goes to spam often
- ❌ Shows "via resend.dev"
- ❌ Low trust score
- ❌ Limited sending

### After (Your Domain):
- ✅ Better inbox delivery
- ✅ Shows "from vivereinstyle.com"
- ✅ Higher trust score
- ✅ Professional appearance
- ✅ Unlimited sending (within plan limits)

---

## 📊 Additional Tips to Avoid Spam

### 1. **Warm Up Your Domain**
- Start by sending to real addresses
- Gradually increase volume
- Don't send thousands immediately

### 2. **Good Email Practices**
- ✅ Use real "from" addresses (no `noreply@` if possible)
- ✅ Include unsubscribe link (for marketing emails)
- ✅ Personalize with customer name
- ✅ Avoid spam trigger words
- ✅ Keep HTML clean and simple

### 3. **Test Your Emails**
- Send to Gmail, Outlook, Yahoo
- Check spam scores: https://www.mail-tester.com
- Use Resend's email preview feature

### 4. **Monitor Deliverability**
- Check Resend dashboard for bounce rate
- Watch spam complaint rate
- Remove bounced emails from your list

---

## 🚀 Quick Fix (Temporary)

While waiting for domain verification, you can:

### Ask Recipients to Whitelist

Tell customers to:
1. Check spam folder
2. Mark email as "Not Spam"
3. Add `onboarding@resend.dev` to contacts
4. Move email to inbox

### Add Unsubscribe Link

Even for transactional emails, this helps:

```typescript
// Add to email footer
<p style="margin: 15px 0 0 0; color: #666; font-size: 12px;">
  <a href="mailto:support@vivereinstyle.com?subject=Unsubscribe" style="color: #666; text-decoration: underline;">
    Update email preferences
  </a>
</p>
```

---

## ⏱️ Timeline

**Immediate (Today):**
- Add domain in Resend
- Add DNS records
- Wait for propagation

**24-48 Hours:**
- DNS records propagate
- Resend verifies domain
- Update server code
- Test sending

**1 Week Later:**
- Monitor deliverability
- Check inbox placement
- Adjust if needed

---

## ✅ Verification Checklist

Before your domain is verified:
- [ ] Added domain in Resend
- [ ] Added all DNS records to domain provider
- [ ] Waited 24-72 hours for propagation
- [ ] Clicked "Verify" in Resend dashboard
- [ ] Received green checkmark confirmation

After verification:
- [ ] Updated `from` address in server code
- [ ] Tested sending an email
- [ ] Checked inbox delivery
- [ ] Confirmed no spam folder placement
- [ ] Monitored Resend dashboard

---

## 🆘 Troubleshooting

### Domain Won't Verify
- Wait longer (can take up to 72 hours)
- Double-check DNS records are exact
- Use DNS checker: https://mxtoolbox.com
- Remove any old conflicting records

### Still Going to Spam After Verification
- Check email content (avoid spam words)
- Warm up domain (send gradually)
- Add unsubscribe link
- Test at mail-tester.com
- Check SPF/DKIM/DMARC records

### DNS Provider Issues
- Some providers format records differently
- Check provider documentation
- Contact support if stuck
- Try online DNS checker tools

---

## 📞 Need Help?

**Resend Support:**
- Docs: https://resend.com/docs
- Email: support@resend.com
- Discord: https://resend.com/discord

**DNS Help:**
- Your domain registrar's support
- DNS propagation checker: https://dnschecker.org

---

## 🎯 Expected Timeline

```
Day 1: Add DNS records
  ↓
Day 2-3: DNS propagation
  ↓
Day 3: Verify domain in Resend
  ↓
Day 3: Update server code
  ↓
Day 3+: Better inbox delivery! ✅
```

---

**Pro Tip:** While waiting for verification, you can still test the email system. Just remind testers to check their spam folder and mark emails as "Not Spam" to train their email client.

Once your domain is verified, all future emails will have much better deliverability! 📬✨
