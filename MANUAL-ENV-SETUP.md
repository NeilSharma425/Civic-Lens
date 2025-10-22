# 📝 Manual .env File Setup

Since the `.env` file is protected, here's how to create it manually:

## 🚀 Quick Setup (Recommended)

Run the custom setup script for your project:

```bash
node setup-my-database.js
```

This will prompt you for your database password and create the `.env` file automatically.

---

## ✋ Manual Setup (Alternative)

If you prefer to create the `.env` file manually:

### Step 1: Create .env File

In your project root (`c:\Docs\civicLens`), create a new file named `.env`

### Step 2: Add This Content

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD_HERE@db.fhajbtyjhwgasdmhxnuw.supabase.co:5432/postgres
USE_DATABASE=true

# OpenAI Configuration (optional)
# OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Step 3: Replace YOUR_PASSWORD_HERE

Replace `YOUR_PASSWORD_HERE` with your actual Supabase database password.

---

## 🔑 Getting Your Database Password

### Your Project Details:
- **Project Reference:** `fhajbtyjhwgasdmhxnuw`
- **Dashboard:** https://supabase.com/dashboard/project/fhajbtyjhwgasdmhxnuw

### Get Password:

**Method 1: View Existing Password**
1. Go to: https://supabase.com/dashboard/project/fhajbtyjhwgasdmhxnuw/settings/database
2. Scroll to **"Connection String"** section
3. Click the **"URI"** tab
4. Copy the password from the connection string

**Method 2: Reset Password**
1. Same page as above
2. Find **"Reset Database Password"** button
3. Create a new password
4. Save it securely!

---

## ✅ After Creating .env

Run these commands in order:

```bash
# 1. Create database tables
npm run db:push

# 2. Test connection
npm run db:test

# 3. Start app
npm run dev
```

---

## 🎯 Expected Result

When you run `npm run db:test`, you should see:

```
🧪 Starting Supabase Connection Tests

Step 1: Checking environment variables...
✅ DATABASE_URL is set
   Connection string: postgresql://postgres:****@db.fhajbtyjhwgasdmhxnuw.supabase.co:5432/postgres

Step 2: Determining connection mode...
✅ Detected Supabase URL

📡 Testing: Direct Connection (port 5432)
  Testing basic connectivity...
  ✅ Connection successful
  ...
```

---

## 📋 Complete .env Example

Here's what your final `.env` file should look like:

```env
DATABASE_URL=postgresql://postgres:MySecurePassword123@db.fhajbtyjhwgasdmhxnuw.supabase.co:5432/postgres
USE_DATABASE=true
OPENAI_API_KEY=sk-...your-key...
PORT=5000
NODE_ENV=development
```

**Important:** Replace `MySecurePassword123` with your actual password!

---

Need help? Read `GET-DATABASE-PASSWORD.md` for detailed instructions.






