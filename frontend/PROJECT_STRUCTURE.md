# FinSight AI - Project Structure

## Overview

FinSight AI is a premium fintech AI platform for personal finance management with intelligent savings predictions and AI-powered financial advice.

## Directory Structure

```
/
├── app/
│   ├── layout.tsx                    # Root layout with theme provider
│   ├── page.tsx                      # Home page (redirects based on auth)
│   ├── globals.css                   # Global styles with design tokens
│   ├── (auth)/
│   │   ├── layout.tsx               # Auth section layout
│   │   └── page.tsx                 # Login/Register page
│   └── dashboard/
│       ├── layout.tsx               # Dashboard layout
│       └── page.tsx                 # Main dashboard with prediction form
│
├── components/
│   ├── prediction-results.tsx        # Results display with charts
│   ├── chatbot.tsx                  # Floating AI chatbot widget
│   ├── theme-provider.tsx           # Next.js themes provider
│   └── ui/                          # shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       ├── select.tsx
│       ├── tabs.tsx
│       ├── spinner.tsx
│       ├── alert.tsx
│       └── ... (other components)
│
├── lib/
│   ├── api.ts                       # API client functions
│   ├── auth.ts                      # Authentication utilities
│   └── utils.ts                     # Utility functions
│
├── hooks/
│   └── use-toast.ts                 # Toast notifications hook
│
├── styles/
│   └── globals.css                  # Additional global styles
│
├── docs/
│   └── API.md                       # API documentation
│
├── .env.local                       # Environment configuration
├── tailwind.config.ts               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
├── next.config.mjs                  # Next.js configuration
├── package.json                     # Dependencies and scripts
└── README.md                        # Project documentation
```

## Key Files Created

### Authentication System
- `app/(auth)/page.tsx` - Login/Register interface with toggle tabs
- `lib/auth.ts` - Token management utilities

### Dashboard & Predictions
- `app/dashboard/page.tsx` - Main dashboard with prediction form
- `components/prediction-results.tsx` - Results visualization with charts

### Chat System
- `components/chatbot.tsx` - Floating AI chatbot widget

### API Integration
- `lib/api.ts` - Centralized API client with all endpoints

### Styling & Design
- `app/globals.css` - Premium color palette and design tokens
- Dark mode enabled by default with Tailwind CSS

## File Breakdown

### App Layout (`app/layout.tsx`)
- Root layout with HTML setup
- ThemeProvider for dark mode
- Global styling

### Auth Page (`app/(auth)/page.tsx`)
- 241 lines
- Tabs component for Login/Register
- Form validation and error handling
- Beautiful glassmorphism design

### Dashboard (`app/dashboard/page.tsx`)
- 318 lines
- Sticky header with logout button
- Prediction form with all required fields
- Grid layout for form and results

### Prediction Results (`components/prediction-results.tsx`)
- 182 lines
- Two KPI cards (Predicted Savings, Confidence)
- Pie chart for expense breakdown
- Bar chart for savings comparison
- Financial profile summary cards
- Chat button integration

### Chatbot (`components/chatbot.tsx`)
- 183 lines
- Floating button (bottom-right)
- Modal chat interface
- Message history
- Error handling for 502 responses
- Auto-scroll to latest message

### API Client (`lib/api.ts`)
- Register function
- Login function
- Predict function
- Chat function
- Type definitions
- Error handling

### Auth Utilities (`lib/auth.ts`)
- Token storage/retrieval
- Auth status checking
- Token removal on logout

## Design System

### Colors (CSS Variables)
```
Primary: #06B6D4 (Cyan)
Secondary: #1F2937 (Dark Gray)
Accent: #06B6D4 (Cyan)
Success: #10B981 (Emerald)
Error: #DC2626 (Red)
Background Dark: #0F172A
Background Light: #F8FAFC
```

### Typography
- Font: Geist Sans (default), Geist Mono
- Heading styles with consistent hierarchy
- Responsive text sizing

### Components Used
- Button with gradient support
- Input fields with focus states
- Card containers with glassmorphism
- Tabs for navigation
- Select dropdowns
- Spinner for loading states
- Alert boxes for messages
- Charts (Recharts)

## Features Implemented

1. **Authentication**
   - Registration with email validation
   - Login with JWT token
   - Logout with token removal
   - Auto-redirect based on auth status

2. **Prediction Form**
   - 14 input fields for financial data
   - 2 dropdown selects (Occupation, City Tier)
   - Form validation
   - Loading states

3. **Results Visualization**
   - Predicted savings amount
   - Confidence percentage
   - Expense breakdown pie chart
   - Savings comparison bar chart
   - Financial profile cards

4. **AI Chatbot**
   - Floating widget
   - Message history
   - Context-aware responses
   - Error handling (502 service unavailable)
   - Auto-scroll functionality

5. **User Experience**
   - Dark mode by default
   - Smooth animations
   - Responsive design
   - Loading indicators
   - Error messages
   - Success feedback

## API Endpoints

- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/predict/` - Get predictions
- `POST /api/chat/` - Chat with AI

## Dependencies

### Core
- next: ^16.1.6
- react: ^19.2.3
- react-dom: ^19.2.3
- typescript: ^5.7.3

### UI & Styling
- @radix-ui/* - Headless UI components
- tailwindcss: ^3.4.17
- lucide-react: ^0.544.0 - Icons
- recharts: ^2.15.0 - Charts

### Forms & Hooks
- react-hook-form: ^7.54.1
- zod: ^3.24.1 - Validation
- next-themes: ^0.4.6 - Theme management

### Animations
- tailwindcss-animate: ^1.0.7

## Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:8001
```

Backend API base URL configured in `lib/api.ts`

## Running the Application

1. Install dependencies: `pnpm install`
2. Start dev server: `pnpm dev`
3. Open `http://localhost:3000`
4. Django backend must be running on `http://localhost:8001`

## Build & Deployment

- Build: `pnpm build`
- Start production: `pnpm start`
- Deploy to Vercel: Push to GitHub and connect Vercel

## Performance Optimizations

- Next.js 16 with Turbopack
- Image optimization
- Code splitting
- CSS-in-JS with Tailwind
- Lazy loading of components

## Accessibility Features

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus states
- Color contrast compliance
- Screen reader support

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Measures

- JWT authentication
- Secure token storage
- Password validation
- CORS-ready (configure on backend)
- Input validation
- Error message sanitization

## Future Enhancements

- [ ] Profile page
- [ ] Transaction history
- [ ] Budget planning tools
- [ ] Export reports (PDF)
- [ ] Dark/light theme toggle (currently dark only)
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Recurring expense tracking
- [ ] Goal setting
- [ ] Investment recommendations
