# 🔒 Security & Admin Access Guide

## Secure Admin System

### Overview
Vivere In Style uses a **server-side admin authorization system** to ensure security. Admin privileges cannot be self-assigned from the frontend and are strictly controlled by the backend server.

---

## How Admin Access Works

### 1. Server-Side Admin List
Admin emails are maintained in a **secure list on the server** at:
```
/supabase/functions/server/index.tsx
```

The admin list is defined as:
```typescript
const ADMIN_EMAILS = [
  "admin@vivereinstyle.com",
  "superadmin@vivereinstyle.com",
  // Add more admin emails here as needed
];
```

### 2. Admin Role Assignment
When a user signs up or logs in:
1. **Server checks** if their email is in the `ADMIN_EMAILS` list
2. **Server assigns** the role (`admin` or `customer`) in user metadata
3. **Frontend receives** the role from the server
4. **Frontend displays** admin features only if role is `admin`

### 3. Security Features
✅ **Server-side validation** - Role is determined by backend, not frontend  
✅ **Immutable from client** - Users cannot modify their role via browser  
✅ **Secure endpoints** - Admin operations require server-side role checks  
✅ **Centralized control** - All admin emails in one secure location  

---

## Adding New Admins

### Method 1: Update Server File (Recommended)
1. Edit `/supabase/functions/server/index.tsx`
2. Add email to `ADMIN_EMAILS` array:
```typescript
const ADMIN_EMAILS = [
  "admin@vivereinstyle.com",
  "superadmin@vivereinstyle.com",
  "newemail@vivereinstyle.com", // Add here
];
```
3. Deploy the updated server code
4. New admin can now sign up or log in with admin privileges

### Method 2: Environment Variables (Advanced)
For production systems, consider using environment variables:
1. Store admin emails in `ADMIN_EMAILS` environment variable
2. Parse as JSON array in server code
3. Allows admin management without code changes

---

## Current Admin Accounts

### Primary Admin
**Email:** `admin@vivereinstyle.com`  
**Password:** `admin123`  
**Access Level:** Full admin privileges

### Super Admin (if needed)
**Email:** `superadmin@vivereinstyle.com`  
**Password:** Create via sign up  
**Access Level:** Full admin privileges

---

## Admin Features

### What Admins Can Do:
✅ Access Admin Panel  
✅ Create, Edit, Delete Products  
✅ Create, Edit, Delete Categories  
✅ View All Orders  
✅ Manage Inventory  
✅ View Analytics (when implemented)  

### What Customers CANNOT Do:
❌ Access Admin Panel  
❌ Modify products or categories  
❌ View other users' orders  
❌ Assign themselves admin role  

---

## Role Verification Endpoint

### Check User Role
**Endpoint:** `/make-server-35e920f3/auth/check-role`  
**Method:** GET  
**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "success": true,
  "role": "admin",
  "email": "admin@vivereinstyle.com",
  "name": "Admin User"
}
```

This endpoint:
- Validates the access token
- Checks if email is in admin list
- Updates user metadata if role changed
- Returns current role to frontend

---

## Security Best Practices

### ✅ DO:
- Keep admin emails list updated on server
- Use strong passwords for admin accounts
- Regularly review admin access
- Monitor admin actions via logs
- Use environment variables in production

### ❌ DON'T:
- Store admin list in frontend code
- Check admin status only on frontend
- Use predictable admin email patterns
- Share admin credentials
- Allow frontend to set user roles

---

## Why Not "admin@" Prefix?

### Previous Insecure Method (REMOVED):
```typescript
// ❌ INSECURE - Anyone could create admin account
const isAdmin = email.includes('admin@');
```

### New Secure Method (CURRENT):
```typescript
// ✅ SECURE - Only server-defined emails get admin
const ADMIN_EMAILS = ["admin@vivereinstyle.com"];
const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
```

**Why the change?**
- **Security:** Prevents unauthorized admin access
- **Control:** Centralized admin management
- **Audit:** Clear list of who has admin access
- **Scalability:** Easy to add/remove admins

---

## Troubleshooting

### Issue: User not getting admin access
**Solution:**
1. Verify email is in `ADMIN_EMAILS` list (exact match)
2. Check for typos or case differences
3. Ensure server code is deployed
4. User may need to log out and log back in

### Issue: Existing user needs admin access
**Solution:**
1. Add email to `ADMIN_EMAILS` list
2. User logs in again
3. Server updates role automatically via `/auth/check-role`

### Issue: Need to revoke admin access
**Solution:**
1. Remove email from `ADMIN_EMAILS` list
2. Deploy updated code
3. User's role will be downgraded on next login

---

## Production Deployment

### Before Going Live:
1. ✅ Change default admin password
2. ✅ Review all emails in `ADMIN_EMAILS` list
3. ✅ Remove test accounts
4. ✅ Enable production logging
5. ✅ Set up monitoring for admin actions
6. ✅ Consider 2FA for admin accounts (future)

### Recommended Admin Email Format:
```
admin@vivereinstyle.com        // Primary admin
operations@vivereinstyle.com   // Operations team
manager@vivereinstyle.com      // Store manager
```

Avoid:
```
admin@gmail.com                // Personal emails
test@test.com                  // Test accounts
admin123@vivereinstyle.com     // Obvious patterns
```

---

## Future Enhancements

### Planned Security Improvements:
- [ ] Role-based permissions (super admin, editor, viewer)
- [ ] Two-factor authentication for admins
- [ ] Admin action audit logs
- [ ] IP whitelist for admin access
- [ ] Session timeout for admins
- [ ] Email verification for new admins

---

## Support

### For Admin Access Issues:
**System Administrator:** admin@vivereinstyle.com  
**Technical Support:** Available via admin panel  

### Reporting Security Issues:
**Email:** security@vivereinstyle.com  
**Priority:** Critical  

---

**Last Updated:** November 10, 2025  
**Security Version:** 1.0.0  
**Status:** Production Ready 🔒
