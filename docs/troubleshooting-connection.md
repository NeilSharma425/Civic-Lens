# 🔧 Fix Database Connection URL

## ⚠️ Issue Found

The connection is failing because the database hostname format might be incorrect for your Supabase project.

**Error:** `getaddrinfo ENOTFOUND db.fhajbtyjhwgasdmhxnuw.supabase.co`

This means the hostname doesn't exist. We need to get the **exact** connection string from your Supabase dashboard.

---

## ✅ Solution: Get the Correct Connection String

### Step 1: Go to Database Settings

**Click this link:**
👉 https://supabase.com/dashboard/project/fhajbtyjhwgasdmhxnuw/settings/database

### Step 2: Find Connection String Section

1. Scroll down to the **"Connection String"** section
2. You'll see multiple tabs: **URI**, **JDBC**, **Golang**, etc.
3. **Click the "URI" tab**

### Step 3: Copy the EXACT Connection String

You should see something like one of these formats:

**Format 1 (Transaction Pooler):**
```
postgresql://postgres.fhajbtyjhwgasdmhxnuw:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
```

**Format 2 (Direct Connection):**
```
postgresql://postgres:[YOUR-PASSWORD]@db.fhajbtyjhwgasdmhxnuw.supabase.co:5432/postgres
```

**Format 3 (Session Pooler):**
```
postgresql://postgres:[YOUR-PASSWORD]@[region]-pooler.supabase.com:5432/postgres?pgbouncer=true
```

### Step 4: Update Your .env File

1. **Copy the ENTIRE connection string** from Supabase dashboard
2. **Replace `[YOUR-PASSWORD]` with:** `Civiclens%23123` (URL-encoded)
3. **Update the `.env` file:**

```env
DATABASE_URL=[paste-the-complete-URL-here-with-password]
USE_DATABASE=true
PORT=5000
NODE_ENV=development
```

---

## 🎯 Quick Fix Commands

### Option 1: I'll provide the exact format

**Please send me the EXACT connection string you see in your Supabase dashboard** (you can mask the password part), and I'll format it correctly for you.

### Option 2: Manual Fix

1. Open `.env` file
2. Replace the `DATABASE_URL` line with the exact string from Supabase
3. Replace the password part with `Civiclens%23123`
4. Save the file
5. Run `npm run db:test` again

---

## 📸 Screenshot Guide

If you're not sure what to copy, look for:

1. **Settings** → **Database**
2. **Connection String** section
3. **URI** tab
4. Copy the string that starts with `postgresql://`

---

## ⚡ Quick Test

After updating your `.env` file, run:

```bash
npm run db:test
```

You should see:
```
✅ Connection successful
✅ Found tables in database
```

---

## 🔍 Common Supabase URL Formats

Your project might use one of these:

```bash
# Format A: Direct with db. prefix
postgresql://postgres:PASSWORD@db.PROJECT-REF.supabase.co:5432/postgres

# Format B: Pooler with region
postgresql://postgres.PROJECT-REF:PASSWORD@aws-0-us-west-1.pooler.supabase.com:6543/postgres

# Format C: Newer pooler format
postgresql://postgres:PASSWORD@PROJECT-REF.pooler.supabase.com:5432/postgres
```

The format depends on your Supabase plan, region, and when the project was created.

---

## ❓ What to Do Next

**Please:**
1. Go to: https://supabase.com/dashboard/project/fhajbtyjhwgasdmhxnuw/settings/database
2. Copy the connection string under "URI" tab
3. Share it here (you can hide the password part)
4. I'll create the correct `.env` file for you!

---

**Or manually update `.env` and run `npm run db:test`**






