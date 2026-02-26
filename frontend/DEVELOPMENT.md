# FinSight AI - Development Guide

## Local Development Setup

### Prerequisites
- Node.js 18+ (LTS recommended)
- pnpm 8+
- Git
- A code editor (VS Code recommended)

### Initial Setup

```bash
# Clone repository
git clone https://github.com/yourusername/finsight-ai.git
cd finsight-ai

# Install dependencies
pnpm install

# Create .env.local
cp .env.local.example .env.local

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`

## Development Workflow

### Running the Dev Server

```bash
pnpm dev
```

- Hot module replacement enabled
- Fast refresh with TypeScript
- Automatic rebuild on file changes

### Code Structure

```
app/              # App Router pages
├── (auth)/       # Auth section (grouped route)
├── dashboard/    # Protected dashboard
└── layout.tsx    # Root layout

components/       # Reusable components
├── ui/          # shadcn/ui components
├── chatbot.tsx
└── prediction-results.tsx

lib/              # Utilities & helpers
├── api.ts       # API client
└── auth.ts      # Auth utilities
```

## Making Changes

### Adding a New Page

1. Create directory structure:
```bash
mkdir -p app/newpage
touch app/newpage/page.tsx
touch app/newpage/layout.tsx
```

2. Create page component:
```typescript
'use client'

export default function NewPage() {
  return (
    <main className="min-h-screen">
      {/* Your content */}
    </main>
  )
}
```

### Adding a New Component

1. Create component file:
```bash
touch components/my-component.tsx
```

2. Template:
```typescript
interface MyComponentProps {
  title: string
  children?: React.ReactNode
}

export function MyComponent({ title, children }: MyComponentProps) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  )
}
```

3. Export from components if reusable

### Styling Components

Use Tailwind CSS classes:
```typescript
<div className="p-6 rounded-lg bg-card border border-border/50">
  <h3 className="font-bold text-foreground mb-2">Title</h3>
  <p className="text-muted-foreground">Description</p>
</div>
```

### Using Semantic Colors

Instead of direct colors, use design tokens:

```typescript
// Good ✅
<button className="bg-primary text-primary-foreground">
  Click me
</button>

// Avoid ❌
<button className="bg-cyan-500 text-white">
  Click me
</button>
```

Available colors:
- `primary` / `primary-foreground`
- `secondary` / `secondary-foreground`
- `accent` / `accent-foreground`
- `muted` / `muted-foreground`
- `destructive` / `destructive-foreground`
- `background` / `foreground`
- `card` / `card-foreground`
- `border`

## API Integration

### Adding a New API Endpoint

1. Add function to `lib/api.ts`:
```typescript
export async function myNewFunction(token: string, params: any) {
  const response = await fetch(`${API_BASE}/api/my-endpoint/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || 'Request failed')
  }

  return response.json()
}
```

2. Use in component:
```typescript
import { myNewFunction } from '@/lib/api'

const result = await myNewFunction(token, params)
```

### Error Handling

Always handle errors gracefully:

```typescript
try {
  const result = await myApiCall()
  setData(result)
} catch (err) {
  const message = err instanceof Error ? err.message : 'Unknown error'
  setError(message)
  console.error('[API Error]', message)
}
```

## State Management

### Using React Hooks

For simple state:
```typescript
const [data, setData] = useState(null)
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')
```

### Form State

Use React Hook Form:
```typescript
import { useForm } from 'react-hook-form'

const { register, handleSubmit, watch } = useForm({
  defaultValues: { email: '' }
})

const onSubmit = (data) => console.log(data)

return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <input {...register('email')} />
    <button type="submit">Submit</button>
  </form>
)
```

## Testing Locally

### Manual Testing

1. **Auth Flow**:
   - Register new user
   - Verify token in localStorage
   - Login with credentials
   - Logout and verify token removal

2. **Prediction Flow**:
   - Fill form with test data
   - Submit and verify results
   - Check chart rendering
   - Test responsive on mobile

3. **Chat Flow**:
   - Open chatbot
   - Send test message
   - Verify response
   - Test error handling

### Browser DevTools

**Console Tab**:
- Check for errors
- Review API calls

**Network Tab**:
- Monitor API requests
- Check response times
- Verify response data

**Application Tab**:
- Check localStorage tokens
- View cookies if using them

## TypeScript Development

### Type Safety

Define interfaces for data:
```typescript
interface User {
  id: number
  username: string
  email: string
}

interface ApiResponse<T> {
  data: T
  success: boolean
  error?: string
}
```

### Using Types

```typescript
async function fetchUser(id: number): Promise<User> {
  // Implementation
}

function UserCard({ user }: { user: User }) {
  return <div>{user.username}</div>
}
```

## Performance Optimization

### Image Optimization

Use Next.js Image component:
```typescript
import Image from 'next/image'

<Image
  src="/image.jpg"
  alt="Description"
  width={200}
  height={200}
/>
```

### Code Splitting

Components are automatically code-split at route level.

### Lazy Loading

```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./heavy'), {
  loading: () => <Spinner />,
})
```

## Debugging

### Console Logging

Use descriptive messages:
```typescript
console.log('[Auth] User logged in:', userId)
console.error('[API] Request failed:', error)
console.warn('[Performance] Slow operation:', duration)
```

### Browser DevTools

1. **Inspect Element**: Check HTML/CSS
2. **Console**: View logs and errors
3. **Network**: Monitor API calls
4. **Performance**: Profile app speed

### VS Code Debugging

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "console": "integratedTerminal"
    }
  ]
}
```

## Git Workflow

### Commit Messages

Use conventional commits:
```
feat: Add chatbot widget
fix: Fix prediction form validation
refactor: Extract prediction logic
docs: Update API documentation
```

### Branching

```bash
# Create feature branch
git checkout -b feature/chatbot-widget

# Make changes
git add .
git commit -m "feat: Add chatbot widget"

# Push to GitHub
git push origin feature/chatbot-widget

# Create pull request on GitHub
```

## Building for Production

### Build Process

```bash
pnpm build
```

Optimizes:
- Code minification
- Image optimization
- CSS purification
- JavaScript bundling

### Performance Check

```bash
# Analyze bundle size
pnpm build

# Check production size
ls -lah .next/static/
```

### Testing Production Build Locally

```bash
pnpm build
pnpm start
```

Visit `http://localhost:3000`

## Environment Variables

### Local Development

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8001
```

### Production

Set in deployment platform:
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Common Issues & Solutions

### "Cannot find module '@/components/...'"

- Check import path is correct
- Verify file exists
- Restart dev server

### "localhost:8001 refused to connect"

- Verify Django backend is running
- Check `lib/api.ts` for correct API_BASE
- Check CORS configuration on backend

### Hot reload not working

- Restart dev server: `pnpm dev`
- Check file is in `app/` or `components/` directory
- Verify no syntax errors

### Build fails with TypeScript errors

```bash
# Check for type errors
npx tsc --noEmit

# Fix errors and rebuild
pnpm build
```

## Code Quality

### Linting

```bash
pnpm lint
```

Checks:
- Code style
- Unused imports
- TypeScript errors

### Formatting

```bash
# Format code with Prettier (if installed)
pnpm format
```

## Useful Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run linter

# Database (when needed)
pnpm migrate          # Run migrations
pnpm seed             # Seed database

# Dependencies
pnpm add <pkg>        # Add dependency
pnpm remove <pkg>     # Remove dependency
pnpm update           # Update dependencies
pnpm audit            # Check vulnerabilities
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Recharts](https://recharts.org)

## Need Help?

1. Check existing documentation in `/docs` and root
2. Search GitHub issues
3. Check browser console for errors
4. Check network tab for API issues
5. Review TypeScript errors with `npx tsc --noEmit`

## Contributing

1. Create feature branch
2. Make changes
3. Test locally
4. Commit with clear messages
5. Push and create pull request
6. Wait for review
7. Merge when approved

Happy coding! 🚀
