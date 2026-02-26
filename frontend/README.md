# FinSight AI - Smart Money Management Platform

AI-powered personal finance management platform built with Next.js, React, and Tailwind CSS.

## Features

- **Modern Authentication**: Secure login and registration with JWT tokens
- **Smart Predictions**: AI-powered savings predictions based on financial data
- **Real-time Analytics**: Beautiful charts and visualizations of financial insights
- **Intelligent Chatbot**: AI assistant for financial advice with context awareness
- **Responsive Design**: Mobile-first design with dark mode by default
- **Premium UI**: Glassmorphism effects, smooth animations, and elegant gradients

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Recharts for visualizations
- **UI Components**: shadcn/ui with custom theming
- **State Management**: React hooks with localStorage for auth tokens
- **API**: Fetch API with JWT Bearer authentication

## Prerequisites

- Node.js 18+ and pnpm
- Django backend running on `http://localhost:8001`

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start the Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### 3. Configure Backend

Ensure your Django backend is running on `http://localhost:8001` with the following endpoints:

- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/predict/` - Get savings predictions
- `POST /api/chat/` - Chat with AI assistant

## Architecture

### Pages

- `/` - Home page (redirects to dashboard or auth)
- `/(auth)` - Authentication page with login/register tabs
- `/dashboard` - Main dashboard with prediction form and results

### Components

- `components/prediction-results.tsx` - Displays prediction results with charts
- `components/chatbot.tsx` - Floating AI chatbot widget
- `components/ui/*` - shadcn/ui components

### Utilities

- `lib/api.ts` - API client functions
- `lib/auth.ts` - Authentication utilities (token management)

## Key Features Details

### Authentication

- Toggle between Login and Register tabs
- JWT token stored in localStorage
- Automatic redirect based on auth status
- Secure password handling

### Prediction Form

Fields include:
- Income, Age, Dependents
- Disposable Income, Desired Savings
- Monthly expenses (Groceries, Transport, Eating Out, Entertainment, etc.)
- Occupation dropdown (Professional, Retired, Self-Employed, Student)
- City Tier dropdown (Tier_1, Tier_2, Tier_3)

### Results Display

- Predicted savings amount with confidence score
- Expense breakdown pie chart
- Savings comparison bar chart
- Financial profile summary cards

### Chatbot

- Floating button in bottom-right corner
- Context-aware responses based on prediction data
- Graceful error handling for unavailable service
- Clean, modern chat interface

## Color System

- **Primary**: Cyan (#06B6D4)
- **Secondary**: Dark Blue (#1F2937)
- **Accent**: Emerald (#10B981)
- **Background Dark**: #0F172A
- **Background Light**: #F8FAFC

## Error Handling

- API errors with user-friendly messages
- 502 Bad Gateway handling for chat service
- Form validation before submission
- Network error recovery

## Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:8001
```

The API base URL is configured in `lib/api.ts`

## Development

### Build

```bash
pnpm build
```

### Run Production Build

```bash
pnpm start
```

### Linting

```bash
pnpm lint
```

## Deployment

The application is ready for deployment on Vercel:

1. Push to GitHub repository
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT
