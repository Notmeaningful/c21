# Deployment Guide

This guide explains how to deploy the Century 21 Property Questionnaire System to production.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Supabase Setup](#supabase-setup)
3. [Email Configuration](#email-configuration)
4. [Vercel Deployment](#vercel-deployment)
5. [Custom Domain](#custom-domain)
6. [Monitoring & Maintenance](#monitoring--maintenance)

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All environment variables are configured
- [ ] Supabase database is set up and tested
- [ ] Email service is configured and tested
- [ ] Security policies are implemented
- [ ] Admin authentication is secure
- [ ] reCAPTCHA keys are configured (optional)
- [ ] SSL certificate is ready (if self-hosting)
- [ ] Backups are configured
- [ ] Error tracking is set up (e.g., Sentry)

## Supabase Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create new project
4. Choose region closest to your users
5. Set a strong password
6. Wait for database to be provisioned

### 2. Configure Database

1. Go to SQL Editor
2. Run the schema from `database.sql`:
   ```sql
   -- Copy entire contents of database.sql
   -- Paste into SQL Editor
   -- Execute
   ```

3. Verify tables are created:
   - `submissions` - Main table for form responses
   - `submission_audit_log` - Audit trail

### 3. Get Connection Credentials

1. Go to Project Settings → API
2. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Configure Row Level Security (RLS)

For public submissions (recommended):

```sql
-- Allow public INSERT
CREATE POLICY "Enable public insert" ON submissions
  FOR INSERT WITH CHECK (true);

-- Allow public SELECT
CREATE POLICY "Enable public select" ON submissions
  FOR SELECT USING (true);
```

For admin-only access:
- Implement proper authentication
- Use authenticated user checks in RLS policies

## Email Configuration

### Using Gmail (Development/Small Scale)

1. **Enable 2FA on your Gmail account**
   - Go to myaccount.google.com
   - Security → 2-Step Verification

2. **Generate App Password**
   - Security → App password
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password

3. **Configure .env.local**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx  # 16-char app password
   SMTP_FROM=noreply@your-email.com
   ```

### Using SendGrid (Production Recommended)

1. **Sign up at sendgrid.com**
2. **Verify Sender Identity**
3. **Get API Key and SMTP credentials**
4. **Configure .env.local**
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=SG.xxxxxxxxxxxx  # Your SendGrid API Key
   SMTP_FROM=noreply@yourdomain.com
   ```

### Using AWS SES (High Volume)

1. **Set up AWS account**
2. **Request sending limit increase**
3. **Create SMTP credentials**
4. **Configure .env.local**
   ```env
   SMTP_HOST=email-smtp.region.amazonaws.com
   SMTP_PORT=587
   SMTP_USER=your-smtp-user
   SMTP_PASS=your-smtp-password
   SMTP_FROM=noreply@yourdomain.com
   ```

## Vercel Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Century 21 questionnaire"
git branch -M main
git remote add origin https://github.com/yourusername/c21-questionnaire.git
git push -u origin main
```

### 2. Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
npm install -g vercel
vercel
```

**Option B: GitHub Integration**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import the repository
4. Add environment variables
5. Deploy

### 3. Configure Environment Variables on Vercel

1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `SMTP_FROM`
   - `ADMIN_EMAIL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to your domain)

### 4. Deploy

```bash
vercel --prod
```

## Custom Domain

### With Vercel

1. **Add domain to Vercel**
   - Project Settings → Domains
   - Add your domain
   - Follow DNS configuration steps

2. **Update Nameservers**
   - Go to your domain registrar
   - Update nameservers to Vercel's servers
   - Wait for propagation (24-48 hours)

3. **Update Environment Variables**
   - Set `NEXTAUTH_URL=https://yourdomain.com`
   - Redeploy

### SSL Certificate

- Vercel automatically provides SSL via Let's Encrypt
- No additional configuration needed
- Renews automatically

## Monitoring & Maintenance

### Set Up Error Tracking

**Sentry Integration:**
```bash
npm install @sentry/nextjs
```

### Database Backups

**Supabase automatic backups:**
- Free tier: 7-day backups
- Pro tier: 30-day backups
- Configure in Supabase dashboard

### Monitor Email Delivery

1. Check SMTP service logs
2. Verify email reputation
3. Monitor deliverability rates
4. Set up email alerts for failures

### Performance Monitoring

- Use Vercel Analytics
- Monitor Core Web Vitals
- Check database query performance
- Set up alerts for errors

## Troubleshooting Deployment

### Issue: "Module not found" error

**Solution:**
```bash
rm -rf node_modules
npm install
npm run build
```

### Issue: Environment variables not loading

**Solution:**
- Verify variables are set on Vercel
- Restart deployment
- Check variable names exactly match code

### Issue: Email not sending in production

**Solution:**
- Verify SMTP credentials work with tool like Telnet
- Check IP whitelisting requirements
- Enable "less secure apps" for Gmail if applicable
- Review email service logs

### Issue: Database connection timeout

**Solution:**
- Check Supabase service status
- Verify connection string is correct
- Increase connection timeout in code

## Post-Deployment

1. **Test the application**
   - Complete a test submission
   - Verify email received
   - Check admin dashboard access
   - Test export functionality

2. **Set up monitoring**
   - Enable error tracking
   - Set up uptime monitoring
   - Configure email alerts

3. **Document the deployment**
   - Keep records of configuration
   - Document any customizations
   - Create runbook for common issues

4. **Plan for scaling**
   - Monitor database usage
   - Set up auto-scaling alerts
   - Plan load testing

## Security Hardening for Production

1. **Enable RLS properly:**
   ```sql
   ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
   ```

2. **Use strong secrets:**
   - Generate with: `openssl rand -base64 32`
   - Store in secure vault
   - Rotate periodically

3. **Enable CORS properly:**
   - Restrict to specific domains
   - Never allow `*` in production

4. **Rate limiting:**
   - Implement on API routes
   - Use Vercel's built-in rate limiting

5. **Input validation:**
   - Sanitize all inputs (already done)
   - Validate schema strictly
   - Use TypeScript types

---

For issues or questions, contact: rentals@c21fairfield.com.au
