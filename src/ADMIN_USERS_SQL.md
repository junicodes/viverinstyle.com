# Create Admin and Customer Users in Supabase

## Instructions

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/awmgkhticthegwazfkoq/sql
2. Copy and paste the SQL below into the SQL Editor
3. Click "RUN" to execute
4. The users will be created with the credentials listed below

## SQL to Run in Supabase SQL Editor

```sql
-- This SQL creates admin and customer test accounts
-- NOTE: These are for TESTING only. Change passwords in production!

-- The users are created using Supabase's auth schema
-- The auth.users table stores authentication data
-- We insert directly into this table with properly hashed passwords

-- IMPORTANT: Replace 'your-password-here' with actual secure passwords
-- The password will be hashed automatically by Supabase

-- Example: To create users, you'll need to use Supabase's admin API
-- Unfortunately, direct SQL insertion into auth.users is not recommended
-- as it bypasses Supabase's password hashing and security measures.

-- Instead, you have TWO OPTIONS:
```

## Option 1: Use Supabase Dashboard (RECOMMENDED)

1. Go to: https://supabase.com/dashboard/project/awmgkhticthegwazfkoq/auth/users
2. Click "Add user" button
3. Create these users:

### Admin User 1:
- **Email:** admin@vivereinstyle.com
- **Password:** (choose a secure password)
- **Auto Confirm Email:** YES (check this box)
- After creating, click on the user and add metadata:
  ```json
  {
    "name": "Admin User",
    "role": "admin"
  }
  ```

### Admin User 2:
- **Email:** superadmin@vivereinstyle.com
- **Password:** (choose a secure password)
- **Auto Confirm Email:** YES
- Metadata:
  ```json
  {
    "name": "Super Admin",
    "role": "admin"
  }
  ```

### Test Customer:
- **Email:** customer@example.com
- **Password:** (choose a secure password)
- **Auto Confirm Email:** YES
- Metadata:
  ```json
  {
    "name": "Test Customer",
    "role": "customer"
  }
  ```

## Option 2: Use cURL to Call Supabase Admin API

If you prefer command line, run these commands (replace YOUR_SERVICE_ROLE_KEY with your actual key):

```bash
# Create Admin User 1
curl -X POST 'https://awmgkhticthegwazfkoq.supabase.co/auth/v1/admin/users' \
-H "apikey: YOUR_SERVICE_ROLE_KEY" \
-H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
-H "Content-Type: application/json" \
-d '{
  "email": "admin@vivereinstyle.com",
  "password": "SecurePassword123!",
  "email_confirm": true,
  "user_metadata": {
    "name": "Admin User",
    "role": "admin"
  }
}'

# Create Super Admin User
curl -X POST 'https://awmgkhticthegwazfkoq.supabase.co/auth/v1/admin/users' \
-H "apikey: YOUR_SERVICE_ROLE_KEY" \
-H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
-H "Content-Type: application/json" \
-d '{
  "email": "superadmin@vivereinstyle.com",
  "password": "SecurePassword123!",
  "email_confirm": true,
  "user_metadata": {
    "name": "Super Admin",
    "role": "admin"
  }
}'

# Create Test Customer
curl -X POST 'https://awmgkhticthegwazfkoq.supabase.co/auth/v1/admin/users' \
-H "apikey: YOUR_SERVICE_ROLE_KEY" \
-H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
-H "Content-Type: application/json" \
-d '{
  "email": "customer@example.com",
  "password": "TestPassword123!",
  "email_confirm": true,
  "user_metadata": {
    "name": "Test Customer",
    "role": "customer"
  }
}'
```

## Important Security Notes

1. **Admin Emails are Whitelisted**: Only emails in the server's `ADMIN_EMAILS` list will get admin privileges. Currently:
   - admin@vivereinstyle.com
   - superadmin@vivereinstyle.com

2. **Signup Form is Customer-Only**: The public signup form will ALWAYS create customer accounts, never admin accounts. This is for security.

3. **To Add More Admins**: 
   - Create the user account (via dashboard or cURL)
   - Add their email to the `ADMIN_EMAILS` array in `/supabase/functions/server/index.tsx`
   - The server will automatically grant them admin privileges on their next login

4. **Change Default Passwords**: If you use the examples above, IMMEDIATELY change the passwords after first login!

## Testing After Creation

1. **Test Admin Login:**
   - Email: admin@vivereinstyle.com
   - Password: (whatever you set)
   - Should see "Admin" badge in header
   - Should have access to Admin Panel

2. **Test Customer Login:**
   - Email: customer@example.com
   - Password: (whatever you set)
   - Should NOT see Admin badge
   - Should NOT have Admin Panel access

3. **Test Signup:**
   - Create a new account via the signup form
   - Should always create a customer account
   - Should never get admin privileges (even if email matches admin list)
