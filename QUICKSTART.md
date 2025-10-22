# Quick Start Guide

Get CivicLens running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free)
- An OpenAI API key

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the environment template:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
OPENAI_API_KEY=sk-your-key-here
```

**Need help getting these?** See [SETUP-GUIDE.md](./SETUP-GUIDE.md)

### 3. Set Up Database

Push the database schema to Supabase:

```bash
npm run db:push
```

Test the connection:

```bash
npm run db:test
```

### 4. Start the App

```bash
npm run dev
```

Open http://localhost:5000 in your browser!

## Next Steps

- **[User Guide](./USER-GUIDE.md)** - Learn how to use the app
- **[Setup Guide](./SETUP-GUIDE.md)** - Detailed setup instructions
- **[Documentation](./docs/)** - Technical documentation

## Troubleshooting

**Connection errors?** Check [docs/troubleshooting-connection.md](./docs/troubleshooting-connection.md)

**Database issues?** See [docs/supabase-troubleshooting.md](./docs/supabase-troubleshooting.md)

## Support

- Open an issue on GitHub
- Check the [docs](./docs/) folder
- Review [VERIFICATION-SUCCESS.md](./VERIFICATION-SUCCESS.md) for reference
