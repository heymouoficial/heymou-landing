# 🚀 Deployment Guide for HeyMou Landing Page

## Vercel Deployment with Supabase Integration

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Supabase Project**: Set up at [supabase.com](https://supabase.com)
3. **Git Repository**: Push your code to GitHub/GitLab

### Environment Variables Setup

#### In Vercel Dashboard:
Navigate to your project settings and add these environment variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app

# Optional: Analytics & Monitoring
GOOGLE_SITE_VERIFICATION=your-google-verification-code
```

#### Local Development (.env.local):
```bash
# Copy from .env.local.example
cp .env.local.example .env.local

# Add your values
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Deployment Steps

#### 1. Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run vercel:build` or `pnpm build`
   - **Output Directory**: `.next` (leave default)

#### 2. Environment Variables

Add all required environment variables in the Vercel dashboard under "Project Settings" > "Environment Variables".

#### 3. Build Settings

The `vercel.json` file is already configured with optimal settings:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 10
    }
  }
}
```

#### 4. Domain Configuration

1. In Vercel dashboard, go to "Project Settings" > "Domains"
2. Add your custom domain (e.g., `heymou.com`)
3. Configure DNS records as instructed

### Supabase Configuration

#### 1. Database Setup

Run the SQL schema from `lib/supabase/schema.sql`:

```sql
-- Execute in Supabase SQL Editor
-- This creates the necessary tables for your application
```

#### 2. Row Level Security (RLS)

Enable RLS on your tables and create appropriate policies:

```sql
-- Example for contact_submissions table
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON contact_submissions
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated reads" ON contact_submissions
FOR SELECT USING (auth.role() = 'authenticated');
```

#### 3. CDN Optimization

Supabase automatically provides CDN for your data. The application is configured to use optimal caching strategies.

### Security Features Implemented

#### ✅ Implemented Security Measures:

1. **Content Security Policy (CSP)**: Prevents XSS attacks
2. **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
3. **Input Validation**: Zod schemas for API validation
4. **Rate Limiting**: Basic rate limiting on API endpoints
5. **Environment Validation**: Runtime checks for required variables
6. **HTTPS Enforcement**: Automatic HTTPS redirects

#### 🔒 Security Headers Applied:

```javascript
// From next.config.ts
{
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': 'default-src \'self\'; ...'
}
```

### Performance Optimizations

#### ✅ Vercel-Specific Optimizations:

1. **Image Optimization**: Automatic WebP/AVIF conversion
2. **Edge Network**: Global CDN distribution
3. **Build Caching**: Intelligent build caching
4. **Function Optimization**: Serverless function optimization

#### 📊 Performance Features:

- **Next.js Image Optimization**: Automatic format conversion
- **Font Optimization**: Self-hosted Google Fonts
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Lazy Loading**: Components and images lazy loaded

### Monitoring & Analytics

#### Application Monitoring:

1. **Error Tracking**: Integrated error monitoring
2. **Performance Monitoring**: Core Web Vitals tracking
3. **Analytics**: Google Analytics 4 integration
4. **Uptime Monitoring**: Vercel provides built-in uptime monitoring

### Troubleshooting

#### Common Issues:

1. **Build Failures**:
   ```bash
   # Check build logs in Vercel dashboard
   npm run build  # Test locally first
   ```

2. **Environment Variables**:
   ```bash
   # Ensure all required variables are set
   # Check Vercel dashboard for variable names
   ```

3. **Supabase Connection**:
   ```bash
   # Verify Supabase URL and keys
   # Check Supabase project status
   ```

#### Debug Commands:

```bash
# Local testing
npm run dev
npm run build
npm run start

# Vercel deployment check
npm run deploy:check

# Clean build
npm run clean
npm run build
```

### Post-Deployment Checklist

- [ ] Domain configured and SSL certificate active
- [ ] Environment variables properly set
- [ ] Supabase connection working
- [ ] Analytics tracking active
- [ ] Error monitoring configured
- [ ] Performance monitoring active
- [ ] Security headers verified
- [ ] SEO meta tags correct
- [ ] Sitemap accessible
- [ ] Robots.txt configured

### Maintenance

#### Regular Tasks:

1. **Monitor Performance**: Check Vercel analytics regularly
2. **Update Dependencies**: Keep packages updated for security
3. **Review Logs**: Monitor for errors and security issues
4. **Backup Data**: Regular Supabase backups
5. **SSL Renewal**: Automatic with Vercel

#### Security Updates:

1. **Dependency Updates**: Regular `npm audit` checks
2. **Security Headers**: Review and update as needed
3. **Access Logs**: Monitor for suspicious activity
4. **Rate Limiting**: Adjust limits based on traffic

---

## 🚨 Security Notes

- **Never commit secrets** to version control
- **Use environment variables** for all sensitive data
- **Enable 2FA** on all accounts (Vercel, Supabase, Git)
- **Regular security audits** recommended
- **Monitor access logs** for suspicious activity

## 📞 Support

For deployment issues:
1. Check Vercel build logs
2. Verify environment variables
3. Test Supabase connection
4. Review security configurations

---

**Deployment completed successfully! 🎉**