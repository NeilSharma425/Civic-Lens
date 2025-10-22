# Repository Structure

This document provides an overview of the CivicLens repository structure.

## Root Directory

```
civic-lens/
├── .github/                    # GitHub templates and workflows
│   ├── ISSUE_TEMPLATE/        # Issue templates
│   └── pull_request_template.md
├── client/                    # Frontend React application
│   ├── src/                   # Source code
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilities
│   │   └── types/            # TypeScript types
│   └── index.html            # HTML entry point
├── server/                    # Backend Express application
│   ├── services/             # Business logic
│   │   ├── openai.ts         # OpenAI integration
│   │   ├── sentiment.ts      # Sentiment analysis
│   │   └── fileProcessor.ts  # File processing
│   ├── routes.ts             # API routes
│   ├── index.ts              # Server entry point
│   ├── storage.ts            # Database layer
│   └── env.ts                # Environment config
├── migrations/                # Database migrations
├── docs/                      # Additional documentation
├── shared/                    # Shared types and utilities
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── CONTRIBUTING.md           # Contribution guidelines
├── LICENSE                   # MIT License
├── QUICKSTART.md             # Quick start guide
├── README.md                 # Main readme
├── SETUP-GUIDE.md            # Detailed setup guide
├── USER-GUIDE.md             # User guide
├── VERIFICATION-SUCCESS.md   # Successful setup reference
└── package.json              # Dependencies and scripts
```

## Key Files

### Configuration Files

- **package.json** - Project dependencies and npm scripts
- **tsconfig.json** - TypeScript configuration
- **vite.config.ts** - Vite build configuration
- **tailwind.config.ts** - TailwindCSS configuration
- **drizzle.config.ts** - Database ORM configuration
- **.env.example** - Environment variables template

### Documentation Files

- **README.md** - Main project documentation
- **QUICKSTART.md** - Quick start instructions
- **SETUP-GUIDE.md** - Detailed setup process
- **USER-GUIDE.md** - How to use the application
- **CONTRIBUTING.md** - Contribution guidelines
- **VERIFICATION-SUCCESS.md** - Reference for successful setup

### Database Files

- **migrations/** - Drizzle ORM migrations
- **create-supabase-tables.sql** - SQL table creation script
- **setup-my-database.js** - Interactive database setup

### Testing Files

- **test-supabase.ts** - Database connection tests
- **test-supabase-client.ts** - Supabase client tests

## Frontend Structure

### Components

- **components/** - Reusable UI components
  - **ui/** - Base UI components (buttons, cards, etc.)
  - **charts/** - Data visualization components
  - **Dashboard.tsx** - Main dashboard component
  - **UploadSection.tsx** - File upload interface
  - **ProcessingResults.tsx** - Results display

### Pages

- **pages/Home.tsx** - Landing page
- **pages/Analytics.tsx** - Analytics dashboard
- **pages/not-found.tsx** - 404 page

### Hooks

- **hooks/useFileUpload.ts** - File upload logic
- **hooks/use-toast.ts** - Toast notifications
- **hooks/use-mobile.tsx** - Mobile detection

## Backend Structure

### Routes

All API routes are defined in `server/routes.ts`:

- `/api/feedback/*` - Feedback submission and retrieval
- `/api/analytics` - Analytics data
- `/api/export/*` - Data export

### Services

- **openai.ts** - OpenAI API integration for translation and analysis
- **sentiment.ts** - Sentiment analysis logic
- **fileProcessor.ts** - CSV/TXT file processing

### Storage

- **storage.ts** - Database abstraction layer
- **supabaseStorage.ts** - Supabase-specific implementation

## Documentation Structure

The `docs/` folder contains:

- Setup guides and troubleshooting
- Supabase configuration docs
- Connection string guides
- Manual setup instructions
- Testing documentation

See [docs/README.md](./docs/README.md) for a complete list.

## Build Output

Generated files (ignored by git):

- **dist/** - Production build output
- **node_modules/** - npm dependencies
- **server/public/** - Static files served by Express

## Development Workflow

1. Install: `npm install`
2. Configure: Copy `.env.example` to `.env`
3. Setup DB: `npm run db:push`
4. Develop: `npm run dev`
5. Build: `npm run build`
6. Deploy: `npm start`

## Environment Variables

All environment variables should be defined in `.env` (see `.env.example` for template):

- Supabase credentials
- OpenAI API key
- Database connection string

**Never commit `.env` to version control!**

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details on:

- Code style
- Pull request process
- Issue reporting
- Development setup

## License

This project is MIT licensed. See [LICENSE](./LICENSE) for details.
