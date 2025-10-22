# Supabase Database Setup Guide

## Quick Setup Steps

### 1. Get Your Supabase Connection String

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Navigate to **Project Settings** → **Database**
4. Scroll down to **Connection String** section
5. Select the **URI** tab
6. Copy the connection string (it looks like this):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

### 2. Create Your .env File

Create a file named `.env` in the project root with the following content:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
USE_DATABASE=true

# OpenAI Configuration (optional - for AI features)
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

**Important:** Replace `[YOUR-PASSWORD]` and `[YOUR-PROJECT-REF]` with your actual values!

### 3. Run Database Migrations

After setting up the `.env` file, run the following command to create the database tables:

```bash
npm run db:push
```

This will create the following tables:
- `users` - User accounts
- `feedback_submissions` - Civic feedback submissions
- `analysis_results` - AI analysis results

### 4. Test Your Connection

Run the test script to verify everything is working:

```bash
npx tsx test-supabase.ts
```

You should see green checkmarks ✅ indicating successful connection!

### 5. Start the Development Server

Once the database is connected, start your application:

```bash
npm run dev
```

## Troubleshooting

### Error: "password authentication failed"
- Double-check your database password in the connection string
- You can reset your database password in Supabase Dashboard → Project Settings → Database → Reset Database Password

### Error: "SSL connection required"
- The code has been updated to automatically use SSL for Supabase connections
- Make sure you're using the latest version of `server/pgStorage.ts`

### Error: "Connection timeout"
- Check your internet connection
- Verify that your Supabase project is active and running
- Check if there are any firewall restrictions

### Tables don't exist
- Run `npm run db:push` to create the database schema
- Verify the migrations ran successfully in the output

## Connection Modes

The application automatically detects Supabase and uses:
- **Transaction Pooler (port 6543)** - For efficient connection pooling
- **SSL encryption** - Automatically enabled for Supabase
- **Fallback to in-memory storage** - If database connection fails

## Next Steps

Once connected:
1. Your application will store data persistently in Supabase
2. All feedback submissions will be saved to the database
3. Analytics and analysis results will persist across server restarts
4. You can view and manage your data in the Supabase dashboard

## Support

If you encounter issues:
1. Run `npx tsx test-supabase.ts` to get detailed diagnostics
2. Check the console output for specific error messages
3. Review the Supabase dashboard for project status


