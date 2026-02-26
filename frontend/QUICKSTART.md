# FinSight AI - Quick Start Guide

## Setup in 5 Minutes

### Step 1: Install Dependencies
```bash
pnpm install
```

### Step 2: Ensure Backend is Running
Make sure your Django backend is running on `http://localhost:8001` with these endpoints:
- POST `/api/auth/register/`
- POST `/api/auth/login/`
- POST `/api/predict/`
- POST `/api/chat/`

See `docs/API.md` for detailed endpoint specifications.

### Step 3: Start the Development Server
```bash
pnpm dev
```

The application will open at `http://localhost:3000`

### Step 4: Create an Account
1. Click on "Register" tab
2. Fill in username, email, and password
3. Click "Create Account"
4. You'll be automatically logged in and redirected to the dashboard

### Step 5: Make Your First Prediction
1. Fill in the prediction form with your financial data
2. Click "Get Prediction"
3. See results with charts and visualizations
4. Click "Ask AI for Financial Advice" to open the chatbot

## Architecture Overview

```
Frontend (Next.js) ←→ Backend (Django)
                   ↓
            FinSight AI
```

### Three Main Sections

**1. Authentication** (`/(auth)/page.tsx`)
- Register new users
- Login with credentials
- JWT token management

**2. Dashboard** (`/dashboard/page.tsx`)
- Prediction form with 14 input fields
- Select dropdowns for Occupation and City Tier
- Real-time form submission

**3. Results + Chat** (`/components/`)
- Beautiful charts (Pie & Bar)
- KPI cards with predictions
- Floating AI chatbot widget

## Form Fields

### Income & Savings
- Income
- Disposable Income
- Desired Savings

### Personal Info
- Age
- Dependents
- Occupation (dropdown)
- City Tier (dropdown)

### Monthly Expenses
- Groceries
- Transport
- Eating Out
- Entertainment
- Utilities
- Healthcare
- Education
- Miscellaneous

## Colors & Branding

- **Primary Color**: Cyan (#06B6D4) - For CTAs and highlights
- **Secondary**: Dark Blue (#1F2937) - For text and accents
- **Background**: Very dark (#0F172A) - Dark mode default
- **Success**: Green (#10B981) - For positive indicators

## Key Features

### Authentication
- ✅ Register with email
- ✅ Login with username/password
- ✅ JWT token storage
- ✅ Automatic logout
- ✅ Protected routes

### Prediction System
- ✅ 14 financial input fields
- ✅ 2 dropdown selections
- ✅ AI-powered predictions
- ✅ Confidence scoring

### Visualizations
- ✅ Expense breakdown pie chart
- ✅ Savings comparison bar chart
- ✅ KPI cards with metrics
- ✅ Financial profile summary

### AI Assistant
- ✅ Floating chatbot widget
- ✅ Context-aware responses
- ✅ Error handling
- ✅ Chat history

## File Organization

```
App Structure:
/app/(auth)/page.tsx        → Login/Register
/app/dashboard/page.tsx      → Main dashboard
/components/prediction-results.tsx  → Charts & results
/components/chatbot.tsx     → AI chatbot widget
/lib/api.ts                 → API client
/lib/auth.ts                → Token management
```

## API Flow

```
1. Register/Login
   ↓
2. Get JWT Token
   ↓
3. Store Token in localStorage
   ↓
4. Send Token in Authorization Header
   ↓
5. Make Predictions
   ↓
6. Display Results
   ↓
7. Chat with AI
```

## Environment Setup

The app is configured to use:
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:8001`

To change backend URL, edit `lib/api.ts`:
```typescript
const API_BASE = 'http://your-backend-url'
```

## Testing the API

### Test Register
```bash
curl -X POST http://localhost:8001/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:8001/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

Copy the returned `access` token and use it for authenticated requests.

### Test Prediction
```bash
curl -X POST http://localhost:8001/api/predict/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "Income": 50000,
    "Age": 30,
    "Dependents": 0,
    "Disposable_Income": 10000,
    "Desired_Savings": 5000,
    "Groceries": 300,
    "Transport": 200,
    "Eating_Out": 150,
    "Entertainment": 100,
    "Utilities": 150,
    "Healthcare": 100,
    "Education": 50,
    "Miscellaneous": 50,
    "Occupation": "Professional",
    "City_Tier": "Tier_1"
  }'
```

## Troubleshooting

### "Cannot connect to backend"
- Check if Django server is running on `http://localhost:8001`
- Check `lib/api.ts` for correct API_BASE URL
- Check network tab in browser DevTools

### "Login failed"
- Verify username and password are correct
- Check backend logs for errors
- Ensure user account exists

### "Prediction failed"
- Verify all form fields are filled
- Check token is valid
- Check backend is receiving correct data format

### "Chat service unavailable"
- Backend `/api/chat/` endpoint may be down
- Check backend logs
- Try again in a few moments

## Next Steps

1. **Customize Colors**: Edit `app/globals.css` CSS variables
2. **Add Features**: Create new components in `/components/`
3. **Deploy**: Push to GitHub and deploy on Vercel
4. **Optimize**: Run `pnpm build` and check bundle size

## Commands

```bash
# Development
pnpm dev              # Start dev server

# Production
pnpm build            # Build for production
pnpm start            # Start production server

# Quality
pnpm lint             # Run linter
```

## Support

- See `README.md` for full documentation
- See `docs/API.md` for API details
- See `PROJECT_STRUCTURE.md` for file organization

## License

MIT
