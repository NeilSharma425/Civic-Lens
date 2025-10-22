# CivicLens - AI-Powered Civic Feedback Analysis

## Overview

CivicLens is an AI-powered web application designed to analyze civic feedback for equitable policymaking and inclusive community representation. The application processes text and file-based feedback through AI translation, sentiment analysis, and inclusive language rewriting to identify representation gaps and provide actionable insights for government organizations and civic leaders.

The system accepts multilingual feedback (text input or CSV/text file uploads), translates non-English content, performs sentiment analysis, rewrites content for inclusivity, and generates comprehensive analytics dashboards showing demographic sentiment distribution and representation insights.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern component development
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, accessible UI components
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Chart.js for data visualization (sentiment pie charts, demographic bar charts)
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js RESTful API server
- **Language**: TypeScript with ES modules for modern JavaScript features
- **File Processing**: Multer for file uploads with CSV parsing capabilities
- **Session Management**: Express sessions with PostgreSQL session store
- **Database ORM**: Drizzle ORM with PostgreSQL for type-safe database operations

### Database Design
- **Primary Database**: PostgreSQL with three main tables:
  - `users`: User authentication and management
  - `feedback_submissions`: Original feedback with AI processing results (translation, sentiment, rewriting)
  - `analysis_results`: Aggregated analytics and insights for dashboard display
- **Session Storage**: PostgreSQL-backed session management for user state persistence

### AI Integration Strategy
- **Translation Service**: OpenAI GPT-5 API for multilingual translation with language detection
- **Sentiment Analysis**: OpenAI-powered sentiment classification (positive/neutral/negative) with confidence scoring
- **Inclusive Rewriting**: GPT-5 with specialized prompts for culturally inclusive language transformation
- **Demographic Detection**: Rule-based text analysis for identifying community group markers (age, income, immigration status, etc.)

### Data Processing Pipeline
1. **Input Processing**: Accept text or file uploads (CSV/TXT) with automatic format detection
2. **Language Processing**: Detect non-English content and translate to English for analysis
3. **Sentiment Analysis**: Score emotional tone and classify feedback sentiment
4. **Inclusive Rewriting**: Transform language for accessibility and cultural sensitivity
5. **Demographic Tagging**: Identify community group indicators from text content
6. **Analytics Aggregation**: Generate insights on representation gaps and sentiment distribution

### Security & Performance
- **File Upload Limits**: 10MB maximum file size with memory-based storage
- **Error Handling**: Comprehensive error boundaries with user-friendly messaging
- **API Design**: RESTful endpoints with consistent JSON responses and proper HTTP status codes
- **Development Tools**: Hot reload, TypeScript checking, and runtime error overlays

## External Dependencies

### AI Services
- **OpenAI API**: GPT-5 model for translation, sentiment analysis, and inclusive language rewriting
- **Environment Variables**: Requires OPENAI_API_KEY for AI service authentication

### Database Services
- **PostgreSQL**: Primary database for application data and session storage
- **Neon Database**: Cloud PostgreSQL provider (via @neondatabase/serverless driver)
- **Environment Variables**: Requires DATABASE_URL for database connection

### Development & Deployment
- **Replit Platform**: Development environment with integrated hosting and database provisioning
- **Vite Plugins**: @replit/vite-plugin-runtime-error-modal and @replit/vite-plugin-cartographer for enhanced development experience

### Frontend Libraries
- **UI Components**: Radix UI primitives for accessible form controls, dialogs, and interactive elements
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing
- **Styling**: Tailwind CSS with class-variance-authority for component variant management
- **Charts**: Chart.js for data visualization components

### Backend Libraries
- **File Processing**: csv-parse for CSV file parsing and data extraction
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Development**: tsx for TypeScript execution and esbuild for production bundling