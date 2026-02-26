# FinSight AI - Deployment Guide

## Vercel Deployment (Recommended)

### Prerequisites
- GitHub account with repository
- Vercel account (free or paid)

### Steps

#### 1. Push to GitHub
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: FinSight AI"
git branch -M main
git remote add origin https://github.com/yourusername/finsight-ai.git
git push -u origin main
```

#### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select "Import Git Repository"
4. Paste your GitHub repository URL
5. Click "Continue"

#### 3. Configure Environment Variables
In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add variable: `NEXT_PUBLIC_API_URL`
3. Value: Your production backend URL
   ```
   https://api.yourdomain.com
   ```

#### 4. Deploy
1. Vercel automatically detects Next.js
2. Click "Deploy"
3. Wait for build to complete
4. Your app is live at `your-project.vercel.app`

### Custom Domain
1. Go to Vercel project settings
2. Domains section
3. Add your custom domain
4. Follow DNS configuration instructions

## Self-Hosted Deployment

### Option 1: Docker

#### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy source code
COPY . .

# Build app
RUN pnpm build

# Expose port
EXPOSE 3000

# Start app
CMD ["pnpm", "start"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend
  
  backend:
    # Your Django configuration here
    ports:
      - "8001:8000"
```

#### Build and Run
```bash
docker build -t finsight-ai .
docker run -p 3000:3000 finsight-ai
```

### Option 2: AWS EC2

#### Requirements
- EC2 instance (t3.micro or larger)
- Node.js 18+ installed
- PM2 for process management

#### Setup
```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Clone repository
git clone https://github.com/yourusername/finsight-ai.git
cd finsight-ai

# Install dependencies
pnpm install

# Build
pnpm build

# Install PM2
sudo npm install -g pm2

# Start with PM2
pm2 start pnpm --name "finsight" -- start

# Configure to restart on boot
pm2 startup
pm2 save
```

#### Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 3: DigitalOcean App Platform

1. Push code to GitHub
2. Go to DigitalOcean App Platform
3. Click "Create App"
4. Select your GitHub repository
5. Configure environment variables
6. Deploy

### Option 4: Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Select repository
5. Add environment variable: `NEXT_PUBLIC_API_URL`
6. Deploy

## Environment Configuration

### Production Variables
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NODE_ENV=production
```

### Backend URL Configuration
If you need to change the backend URL in production:

**Option 1: Update Environment Variable**
In `lib/api.ts`, you could modify to use environment variable:
```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'
```

**Option 2: Build-time Configuration**
Set environment variable before build:
```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com pnpm build
```

## SSL/TLS Certificate

### Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
```

### Vercel Automatic
Vercel automatically provides SSL certificates for all deployments.

## CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - run: pnpm install
      
      - run: pnpm build
      
      - run: pnpm lint
      
      - name: Deploy to Vercel
        uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Database & Backend

### Deploy Django Backend
The frontend requires Django backend at your API URL.

For Django on Heroku:
```bash
# Create Procfile
web: gunicorn yourapp.wsgi

# Deploy
heroku create
git push heroku main
```

For Django on AWS:
- Use Elastic Beanstalk
- Or EC2 with Gunicorn + Nginx

## Monitoring & Logging

### Vercel Analytics
```typescript
// In app/layout.tsx
import { Analytics } from "@vercel/analytics/react"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Sentry Error Tracking
```bash
npm install @sentry/nextjs
```

Configure in `next.config.mjs`:
```javascript
import withSentry from '@sentry/nextjs/withSentry'

export default withSentry(nextConfig, {
  org: 'your-org',
  project: 'finsight-ai',
  authToken: process.env.SENTRY_AUTH_TOKEN,
})
```

## Performance Optimization

### Image Optimization
Already included with Next.js `Image` component.

### Code Splitting
Next.js automatically code-splits at route level.

### Caching
Add cache headers in `next.config.mjs`:
```javascript
headers: async () => [
  {
    source: '/:path*',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=3600, stale-while-revalidate',
      },
    ],
  },
]
```

## Security Checklist

Before production deployment:
- [ ] Remove all console.log debug statements
- [ ] Update API_BASE to production URL
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS on backend
- [ ] Set secure cookie flags
- [ ] Enable rate limiting on backend
- [ ] Add input validation on backend
- [ ] Use strong JWT secret on backend
- [ ] Monitor API logs
- [ ] Set up error tracking (Sentry)

## Rollback Plan

### Vercel Rollback
1. Go to Vercel Deployments
2. Find previous successful deployment
3. Click "Promote to Production"

### Manual Rollback
```bash
git revert HEAD
git push
# Redeploy automatically triggers
```

## Support & Debugging

### Check Deployment Status
- Vercel: Dashboard shows deployment status
- Check logs in Vercel or your platform

### Debug Logs
```bash
# Vercel logs
vercel logs

# View browser console (F12)
# Check Network tab for API calls
# Check Application tab for stored tokens
```

### Common Issues

**Issue**: "Cannot connect to API"
- **Solution**: Verify NEXT_PUBLIC_API_URL is set correctly
- Check backend is running and accessible
- Check CORS configuration

**Issue**: "Auth token invalid"
- **Solution**: Clear localStorage and login again
- Verify JWT secret matches between frontend and backend

**Issue**: "Chat service unavailable"
- **Solution**: Check backend chat endpoint
- Verify backend is running

## Maintenance

### Regular Updates
```bash
# Update dependencies
pnpm update

# Check for security vulnerabilities
pnpm audit

# Run linter
pnpm lint
```

### Monitoring Checklist
- [ ] Monitor API response times
- [ ] Check error rates
- [ ] Review usage statistics
- [ ] Update dependencies monthly
- [ ] Test backups

## Cost Estimates

### Vercel (Recommended)
- Free tier: 100GB/month bandwidth
- Pro: $20/month (includes all features)
- Enterprise: Custom pricing

### DigitalOcean
- Basic droplet: $5/month
- App Platform: $5+/month

### AWS EC2
- t3.micro free tier eligible
- Production: $5-20/month

## Support Resources

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Railway Docs](https://docs.railway.app)
- [AWS Docs](https://docs.aws.amazon.com)
