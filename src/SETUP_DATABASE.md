# 🗄️ Database Setup Required

## Error
`Could not find the table 'public.kv_store_e9dccf07' in the schema cache`

## Solution
You need to create the KV Store table in your Supabase database.

---

## 🚀 Quick Fix (2 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to: **https://supabase.com/dashboard/project/awmgkhticthegwazfkoq**
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New query"**

### Step 2: Run This SQL

Copy and paste this SQL into the editor:

```sql
-- Create KV Store table for Living in Style e-commerce platform
CREATE TABLE IF NOT EXISTS public.kv_store_e9dccf07 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);

-- Add index for prefix searches (improves performance)
CREATE INDEX IF NOT EXISTS idx_kv_store_e9dccf07_key_prefix 
ON public.kv_store_e9dccf07 
USING btree (key text_pattern_ops);

-- Enable Row Level Security (optional, but recommended)
ALTER TABLE public.kv_store_e9dccf07 ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role full access
CREATE POLICY "Service role has full access" 
ON public.kv_store_e9dccf07
FOR ALL 
USING (true)
WITH CHECK (true);
```

### Step 3: Execute

1. Click **"Run"** button (or press Ctrl+Enter)
2. Wait for success message
3. ✅ Table created!

### Step 4: Verify

Check that the table was created:

```sql
SELECT * FROM public.kv_store_e9dccf07 LIMIT 10;
```

Should return empty results (no error).

### Step 5: Refresh Your App

1. Go back to your app
2. Refresh the page (F5)
3. Should see: "Connected to Supabase Cloud" ✅
4. Click "Reload Demo Data" to seed products

---

## 🎯 What This Table Does

The `kv_store_e9dccf07` table is a **key-value store** that holds all your e-commerce data:

### Structure
```sql
key (TEXT)          | value (JSONB)
--------------------|----------------------------------
product:sofa-1      | {"id":"sofa-1", "name":"Cloud..."}
product:table-1     | {"id":"table-1", "name":"Min..."}
category:sofas      | {"slug":"sofas", "name":"Sof..."}
order:order-123     | {"id":"order-123", "total":...}
```

### Usage
- **Products** stored as `product:{id}`
- **Categories** stored as `category:{slug}`
- **Orders** stored as `order:{id}`

### Benefits
- Simple key-value interface
- Flexible JSONB storage
- Fast prefix searches
- No schema migrations needed

---

## 🔍 Troubleshooting

### Issue: "Permission denied"

**Solution:**
Make sure you're logged into your Supabase dashboard with the account that created the project.

### Issue: "Syntax error"

**Solution:**
1. Make sure you copied the entire SQL block
2. No extra characters at the beginning/end
3. Run again

### Issue: Table already exists

**Solution:**
That's fine! The `IF NOT EXISTS` clause prevents errors. Just continue to Step 4.

### Issue: Still getting errors after creating table

**Solutions:**
1. Wait 30 seconds for cache refresh
2. Refresh your app (F5)
3. Clear browser cache
4. Check Supabase dashboard → Logs for errors

---

## 📊 Alternative: Use Supabase Dashboard UI

If you prefer not to use SQL:

### Method 2: Table Editor

1. Go to **Table Editor** in Supabase dashboard
2. Click **"New table"**
3. Enter:
   - **Name:** `kv_store_e9dccf07`
   - **Description:** KV Store for Living in Style
4. Add columns:
   - **Column 1:**
     - Name: `key`
     - Type: `text`
     - Primary: ✅ Yes
     - Nullable: ❌ No
   - **Column 2:**
     - Name: `value`
     - Type: `jsonb`
     - Primary: ❌ No
     - Nullable: ❌ No
5. Click **"Save"**
6. ✅ Done!

---

## 🎉 After Setup

Once the table is created:

### Your app will:
- ✅ Connect to Supabase successfully
- ✅ Show green "Connected to Supabase Cloud" badge
- ✅ Load/save products to cloud
- ✅ Persist data permanently
- ✅ Sync across devices

### Test it:
1. Refresh app
2. Click "Reload Demo Data"
3. Should load 8 products
4. Check Supabase → Table Editor → `kv_store_e9dccf07`
5. See product data! ✅

---

## 📝 Why This Is Needed

Supabase projects start empty (no tables). The `kv_store_e9dccf07` table needs to be manually created before the Edge Function can store data.

Think of it like this:
- **Edge Function** = Your backend server (already deployed)
- **KV Store Table** = Your database storage (needs to be created)

Without the table, the server has nowhere to store data!

---

## 🚀 Next Steps

After creating the table:

1. ✅ Refresh your app
2. ✅ Verify connection (green badge)
3. ✅ Click "Reload Demo Data"
4. ✅ Browse products
5. ✅ Test admin panel
6. ✅ Start adding your own products!

---

## 📞 Still Having Issues?

### Check Database Logs
1. Supabase Dashboard → **Logs** → **Database**
2. Look for recent errors
3. Should see INSERT/SELECT queries after table creation

### Check Edge Function Logs
1. Supabase Dashboard → **Logs** → **Edge Functions**
2. Look for errors
3. Should see successful API calls

### Verify Environment Variables
The Edge Function needs these to be set automatically by Figma Make:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

These should already be configured!

---

## ✅ Summary

**1 SQL Query → 30 seconds → Problem Fixed!**

```sql
CREATE TABLE IF NOT EXISTS public.kv_store_e9dccf07 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);
```

Run this in Supabase SQL Editor, then refresh your app. You're done! 🎉

---

**Living in Style**  
**Powered by Supabase ☁️**  
**Database Ready!** 🗄️
