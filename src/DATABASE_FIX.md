# ⚡ QUICK FIX - Database Table Missing

## 🚨 Error
```
Could not find the table 'public.kv_store_e9dccf07' in the schema cache
```

## ✅ Solution (30 seconds)

### 1. Open Supabase SQL Editor
👉 https://supabase.com/dashboard/project/awmgkhticthegwazfkoq/sql

### 2. Paste & Run This:

```sql
CREATE TABLE IF NOT EXISTS public.kv_store_e9dccf07 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);
```

### 3. Click "RUN" Button

### 4. Refresh Your App

✅ **FIXED!**

---

## 🔍 What Happened?

- Your Supabase project is empty (no tables yet)
- Edge Function needs `kv_store_e9dccf07` table to store data
- Creating the table = Instant fix

---

## 📊 Optional: Better Setup

If you want indexes and security:

```sql
-- Create table
CREATE TABLE IF NOT EXISTS public.kv_store_e9dccf07 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);

-- Add index for fast searches
CREATE INDEX IF NOT EXISTS idx_kv_store_e9dccf07_key_prefix 
ON public.kv_store_e9dccf07 
USING btree (key text_pattern_ops);

-- Enable security
ALTER TABLE public.kv_store_e9dccf07 ENABLE ROW LEVEL SECURITY;

-- Allow service role access
CREATE POLICY "Service role has full access" 
ON public.kv_store_e9dccf07 FOR ALL USING (true) WITH CHECK (true);
```

---

## ✨ After Fix

Your app will:
- ✅ Connect to Supabase
- ✅ Show green badge
- ✅ Load/save products
- ✅ Work perfectly!

---

**🎯 Just run the SQL and you're done!**

See **[SETUP_DATABASE.md](./SETUP_DATABASE.md)** for detailed instructions.
