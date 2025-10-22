# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please email the maintainers directly rather than opening a public issue.

## Security Best Practices

### Environment Variables

**NEVER commit your `.env` file to git!**

This file contains sensitive information:
- Database credentials
- API keys (OpenAI, Supabase)
- Session secrets

### Setting Up Securely

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your credentials to `.env`

3. Verify `.env` is in `.gitignore`:
   ```bash
   git check-ignore .env
   ```
   Should output: `.env`

4. Never use `git add .` blindly - always review what you're committing:
   ```bash
   git status
   git diff
   ```

### API Key Security

**OpenAI API Key:**
- Keep it secret
- Rotate it if exposed
- Set usage limits in your OpenAI dashboard
- Monitor usage regularly

**Supabase Keys:**
- Use the `anon` key for client-side (safe to expose)
- NEVER expose the `service_role` key
- Use Row Level Security (RLS) policies
- Rotate keys if compromised

### Production Deployment

When deploying to production:

1. Use environment variables through your hosting platform (not `.env` files)
2. Enable HTTPS/SSL
3. Set secure session secrets
4. Use rate limiting for API endpoints
5. Enable CORS only for trusted domains
6. Keep dependencies updated: `npm audit`

### Database Security

- Never expose your database password
- Use connection pooling
- Enable SSL for database connections in production
- Regularly backup your database
- Use Supabase Row Level Security policies

## Previous Security Issues

**2025-10-22:** `.env` file was accidentally tracked in git history. This has been removed, but if you cloned the repository before commit `cd7232c`, you should:

1. Rotate your API keys:
   - Generate new OpenAI API key: https://platform.openai.com/api-keys
   - Reset Supabase keys: https://supabase.com/dashboard/project/_/settings/api

2. Update your local `.env` file with new credentials

3. Pull the latest changes: `git pull origin main`

## Dependency Security

Run security audits regularly:

```bash
npm audit
npm audit fix
```

Keep dependencies updated:

```bash
npm update
```

## Questions?

If you have security questions, please contact the maintainers directly.
