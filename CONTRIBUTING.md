# Contributing to CivicLens

Thank you for your interest in contributing to CivicLens! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear description of the problem
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots (if applicable)
- Your environment details (OS, Node version, etc.)

### Suggesting Features

We love new ideas! Open an issue with:
- A clear description of the feature
- Why it would be useful
- How it might work
- Any relevant examples

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Test your changes thoroughly
5. Commit your changes (`git commit -m 'Add some feature'`)
6. Push to the branch (`git push origin feature/your-feature-name`)
7. Open a Pull Request

### Development Setup

1. Clone your fork
2. Install dependencies: `npm install`
3. Set up environment variables (see README.md)
4. Run the development server: `npm run dev`

### Code Style

- Use TypeScript for type safety
- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Keep functions small and focused

### Testing

Before submitting a PR:
- Test your changes locally
- Ensure the build completes: `npm run build`
- Run type checks: `npm run check`
- Test database connections: `npm run db:test`

### Documentation

If your changes affect:
- User-facing features → Update README.md
- Setup process → Update relevant docs in `/docs`
- API endpoints → Update API documentation

## Code of Conduct

Be respectful and inclusive. We're all here to build something meaningful together.

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

Thank you for contributing to CivicLens!
