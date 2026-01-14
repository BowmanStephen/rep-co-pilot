# Vercel Deployment Guide

This guide covers deploying Rep Co-Pilot to Vercel with production-ready optimizations.

---

## Quick Deploy

### 1. Push to GitHub

```bash
git add .
git commit -m "Add Vercel optimizations"
git push origin main
```

### 2. Import in Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js configuration

### 3. Configure Environment Variables

In Vercel Project Settings → Environment Variables, add:

**Required:**
```
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

**Optional (recommended for production):**
```
NEXT_PUBLIC_APP_ENV=production
AI_MODEL_CHAT=anthropic/claude-3.5-sonnet
AI_MODEL_ENHANCE=openai/gpt-4o-mini
NEXT_PUBLIC_COACHING_MODE_DEFAULT=true
NEXT_PUBLIC_COMPLIANCE_CHECK_STRICT_MODE=strict
```

### 4. Deploy

Click "Deploy" and Vercel will:
- Build your Next.js app
- Run optimizations from `vercel.json`
- Deploy to Edge Network (global CDN)
- Provide a `*.vercel.app` URL

---

## Vercel-Specific Optimizations

### vercel.json

Your `vercel.json` file includes:

#### Security Headers
- `X-Content-Type-Options: nosniff` - Prevent MIME type sniffing
- `X-Frame-Options: DENY` - Prevent clickjacking
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Control referrer info
- `Permissions-Policy` - Restrict camera/microphone/geolocation

#### Caching Strategy
- **Static Assets:** 1 year cache (images, fonts, icons)
- **API Routes:** 60s cache with 5min stale-while-revalidate
- **Pages:** Server-side rendering with automatic ISR

#### Regional Deployment
- Default region: `iad1` (US East)
- Change in `vercel.json` → `regions` array for multi-region deployment

---

### next.config.ts Optimizations

```typescript
// Standalone output for smaller Docker images
output: 'standalone'

// Icon tree-shaking (smaller bundles)
modularizeImports: {
  'lucide-react': {
    transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
  },
}

// Remove console.logs in production
compiler: {
  removeConsole: process.env.NODE_ENV === 'production',
}

// CSS optimization for Edge Runtime
experimental: {
  optimizeCss: true,
}
```

---

### Vercel Analytics

**Installed:** `@vercel/analytics` in `src/app/layout.tsx`

Automatically tracks:
- Page views
- Core Web Vitals (CLS, FID, LCP)
- Device types
- Geographic data

**View analytics:** Vercel Dashboard → Analytics tab

---

## Performance Monitoring

### Core Web Vitals

Your app targets these Vercel performance metrics:

| Metric | Target | Status |
|--------|--------|--------|
| First Contentful Paint (FCP) | <1.8s | ✅ Configured |
| Largest Contentful Paint (LCP) | <2.5s | ✅ Configured |
| Cumulative Layout Shift (CLS) | <0.1 | ✅ Zero CLS with Framer Motion |
| First Input Delay (FID) | <100ms | ✅ Edge Runtime |

**View real data:** Vercel Dashboard → Analytics → Core Web Vitals

---

## Environment-Specific Configuration

### Development (local)
```bash
NEXT_PUBLIC_APP_ENV=development
```
- Source maps enabled
- Verbose logging
- Hot reload

### Staging (Vercel preview)
```bash
NEXT_PUBLIC_APP_ENV=staging
```
- Production-like build
- Source maps enabled for debugging
- Staging database connections

### Production (Vercel main branch)
```bash
NEXT_PUBLIC_APP_ENV=production
```
- Optimized bundles
- Source maps disabled
- Console logs removed
- Strict compliance mode

---

## Custom Domains

### Add Custom Domain

1. Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., `copilot.astrazeneca.com`)
3. Configure DNS records:
   ```
   A    copilot    76.76.21.21
   A    copilot    76.76.21.21
   CNAME www       cname.vercel-dns.com
   ```

### SSL Certificates

Vercel automatically provisions:
- SSL certificates (Let's Encrypt)
- HTTPS redirects
- HSTS headers

---

## Preview Deployments

Every pull request gets a unique preview URL:

```
https://rep-copilot-<branch-name>-<username>.vercel.app
```

**Features:**
- Live testing before merging
- Comment with preview URL on PR
- Automatic deployments on push

---

## Rollbacks

### Quick Rollback

1. Vercel Dashboard → Deployments
2. Click "..." on previous deployment
3. Select "Promote to Production"

### Git-Based Rollback

```bash
# Revert commit
git revert HEAD

# Push to trigger rollback
git push origin main
```

---

## Scaling & Pricing

### Vercel Hobby (Free)
- 100GB bandwidth/month
- 6,000 minutes of execution time
- Unlimited deployments
- Best for: Development, staging

### Vercel Pro ($20/month)
- 1TB bandwidth/month
- 50,000 minutes of execution time
- Team collaboration
- Best for: Production deployment

### Vercel Enterprise
- Custom limits
- SSO/SAML
- Dedicated support
- Best for: Enterprise (AstraZeneca)

---

## Monitoring & Alerts

### Vercel Dashboard

**Deployments:** View build logs, deployment history
**Analytics:** Traffic, Core Web Vitals, device breakdown
**Functions:** API route performance, execution time
**Logs:** Real-time log streaming

### Alerting

Configure alerts in Vercel Dashboard:
- Deployment failures
- Error rate spikes
- Performance degradation
- SSL certificate expiration

---

## Troubleshooting

### Build Failures

**Issue:** Build fails in Vercel but works locally

**Solution:**
```bash
# Test build locally
npm run build

# Check build output
ls -la .next
```

**Common causes:**
- Missing environment variables
- Node.js version mismatch
- Dependency conflicts

---

### Environment Variables Not Working

**Issue:** `process.env` returns `undefined`

**Solution:**
1. Check variable name has `NEXT_PUBLIC_` prefix (if used in client code)
2. Restart deployment after adding variables
3. Check "Expose" checkbox in Vercel settings

---

### API Routes Timeout

**Issue:** API routes timeout after 10 seconds

**Solution:**
Move long-running tasks to:
- Vercel Cron Jobs (scheduled tasks)
- Background jobs (using a queue)
- Serverless Functions (max 60s on Pro)

---

## Best Practices

### 1. Always Test Preview Deployments

Before merging to main:
1. Open preview URL from PR
2. Test core flows (chat, compliance, magic wand)
3. Check console for errors
4. Verify environment variables loaded

### 2. Use Branch Protection

In GitHub repository settings:
- Require PR reviews before merge
- Require status checks to pass
- Enable "Require branches to be up to date"

### 3. Monitor Analytics Weekly

Check Vercel Analytics for:
- Traffic spikes
- Performance regression
- Error rate changes
- Device/browser breakdown

### 4. Keep Dependencies Updated

```bash
# Check for updates
npm outdated

# Update packages
npm update

# Test thoroughly before deploying
npm run build && npm run lint
```

---

## Advanced: Custom Build Scripts

### Before Build Hook

```bash
# In Vercel Project Settings → Git → Ignored Build Step
# Skip build if no changes in rep-copilot/
if git diff --quiet HEAD~1 HEAD -- rep-copilot/; then
  exit 0
fi
```

### After Build Hook

```bash
# In package.json scripts
"postbuild": "node scripts/verify-build.js"
```

---

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Analytics](https://vercel.com/docs/analytics)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)

---

**Version:** 1.0.0
**Last Updated:** January 14, 2026
**Maintained By:** Stephen Bowman
