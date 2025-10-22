# CivicLens

> AI-powered civic feedback analysis platform that amplifies underrepresented voices through translation, sentiment analysis, and inclusive language rewriting.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

CivicLens bridges the gap between citizens and policymakers by using AI to process multilingual civic feedback. The platform translates feedback from 95+ languages, analyzes sentiment, and rewrites content in inclusive language - ensuring every voice is heard equally.

**Key Features:**
- **Multi-language Translation** - Auto-detects and translates from 95+ languages
- **Sentiment Analysis** - Analyzes emotional tone (positive/neutral/negative)
- **Inclusive Rewriting** - AI-enhanced language for clarity and inclusivity
- **Smart Demographic Tagging** - Auto-categorizes feedback by demographic groups
- **Real-time Analytics Dashboard** - Visualize sentiment trends and representation gaps
- **Data Export** - Download insights as CSV for reporting

## Quick Links

- **[Quick Start](./QUICKSTART.md)** - Get running in 5 minutes
- **[Setup Guide](./SETUP-GUIDE.md)** - Detailed setup instructions
- **[User Guide](./USER-GUIDE.md)** - How to use the application
- **[Contributing](./CONTRIBUTING.md)** - How to contribute
- **[Documentation](./docs/)** - Additional technical docs

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Recharts for data visualization
- shadcn/ui component library

**Backend:**
- Express.js with TypeScript
- Node.js runtime
- Drizzle ORM for database management

**Services:**
- Supabase for persistent data storage
- OpenAI GPT-4 for translation and analysis
- PostgreSQL database

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)
- An OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd civic-lens
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_connection_string

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
```

**Quick Setup:** Use the interactive setup script:
```bash
npm run db:setup
```

### Database Setup

1. Create tables in your Supabase database:
```bash
npm run db:push
```

2. Verify the connection:
```bash
npm run db:test
```

### Running the Application

**Development mode:**
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

**Production build:**
```bash
npm run build
npm start
```

## Project Structure

```
civic-lens/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and helpers
│   └── index.html
├── server/                # Backend Express application
│   ├── routes.ts          # API route definitions
│   ├── index.ts           # Server entry point
│   ├── storage.ts         # Database layer
│   └── services/          # Business logic services
│       ├── openai.ts      # OpenAI integration
│       ├── sentiment.ts   # Sentiment analysis
│       └── fileProcessor.ts
├── migrations/            # Database migrations
├── docs/                  # Additional documentation
├── package.json
└── README.md
```

## Usage

### Submitting Feedback

1. Navigate to the home page
2. Enter citizen feedback in any language (or upload a CSV/TXT file)
3. Optionally add demographic tags
4. Click "Submit" and watch AI process the feedback

### Viewing Analytics

1. Go to the Dashboard section
2. View sentiment distribution charts
3. Explore demographic breakdowns
4. Read AI-generated insights and recommendations

### Exporting Data

Click the "Export CSV" button on the dashboard to download all feedback with analysis results.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/feedback/text` | Submit text feedback |
| POST | `/api/feedback/upload` | Upload CSV/TXT file |
| GET | `/api/feedback` | Get all feedback |
| GET | `/api/feedback/:id` | Get specific feedback |
| GET | `/api/analytics` | Get dashboard analytics |
| GET | `/api/export/csv` | Export data as CSV |

## Configuration

### Environment Variables

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - Your OpenAI API key

### Database Tables

The application uses three main tables:

1. **feedback_submissions** - Stores all citizen feedback with AI analysis
2. **analysis_results** - Aggregated analytics and insights
3. **users** - User authentication (optional)

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run check        # Type check with TypeScript
npm run db:push      # Push database schema changes
npm run db:test      # Test database connection
```

### Testing

Test the Supabase connection:
```bash
npm run test:supabase
```

## Deployment

The application can be deployed to various platforms:

- **Vercel/Netlify** - For the frontend
- **Heroku/Railway/Render** - For the full-stack application
- **Supabase** - Database is already cloud-hosted

Make sure to set environment variables in your deployment platform.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for hackathon submission
- Inspired by the need for equitable civic engagement
- Uses OpenAI GPT-4 for language processing
- Powered by Supabase for data persistence

## Support

For questions or issues:
- Open an issue on GitHub
- Check the [documentation](./docs) folder for detailed guides

## Roadmap

- [ ] Voice input with speech-to-text
- [ ] Multi-user authentication
- [ ] Advanced demographic analysis
- [ ] PDF report generation
- [ ] Mobile app version
- [ ] Integration with civic engagement platforms

---

**Made with care to amplify every voice in civic discourse.**
