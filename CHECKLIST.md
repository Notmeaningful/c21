# ✅ Installation & Deployment Checklist

## Pre-Installation Requirements

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (optional but recommended)
- [ ] A Supabase account (free at supabase.com)
- [ ] Email credentials (Gmail, SendGrid, or AWS SES)

---

## Local Development Setup

### Step 1: Create Environment File
- [ ] Copy `.env.example` to `.env.local`
- [ ] Do NOT commit `.env.local` to version control
- [ ] Verify `.gitignore` includes `.env.local`

### Step 2: Get Supabase Credentials
- [ ] Create account at supabase.com
- [ ] Create new project
- [ ] Go to Settings → API
- [ ] Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Copy `anon key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Copy `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Paste into `.env.local`

### Step 3: Set Up Database
- [ ] Log into Supabase dashboard
- [ ] Go to SQL Editor
- [ ] Create new query
- [ ] Copy entire contents of `database.sql`
- [ ] Paste into SQL editor
- [ ] Execute query
- [ ] Verify tables created:
  - [ ] `submissions` table exists
  - [ ] `submission_audit_log` table exists
- [ ] Enable Row Level Security:
  - [ ] Check both tables have RLS enabled

### Step 4: Configure Email (SMTP)

**Option A: Gmail (for testing)**
- [ ] Enable 2-Factor Authentication on Gmail account
- [ ] Go to myaccount.google.com → Security → App passwords
- [ ] Generate app password
- [ ] Set in `.env.local`:
  - `SMTP_HOST=smtp.gmail.com`
  - `SMTP_PORT=587`
  - `SMTP_USER=your-email@gmail.com`
  - `SMTP_PASS=xxxx xxxx xxxx xxxx` (16-char app password)
  - `SMTP_FROM=noreply@your-email.com`

**Option B: SendGrid (for production)**
- [ ] Create SendGrid account
- [ ] Verify sender identity
- [ ] Create API key
- [ ] Set in `.env.local`:
  - `SMTP_HOST=smtp.sendgrid.net`
  - `SMTP_PORT=587`
  - `SMTP_USER=apikey`
  - `SMTP_PASS=SG.xxxxx` (your API key)
  - `SMTP_FROM=noreply@yourdomain.com`

**Option C: AWS SES**
- [ ] Set up AWS account
- [ ] Request sending limit increase
- [ ] Create SMTP credentials
- [ ] Set in `.env.local`:
  - `SMTP_HOST=email-smtp.region.amazonaws.com`
  - `SMTP_PORT=587`
  - `SMTP_USER=your-smtp-user`
  - `SMTP_PASS=your-smtp-password`
  - `SMTP_FROM=noreply@yourdomain.com`

### Step 5: Generate Secrets
- [ ] Generate `NEXTAUTH_SECRET`:
  ```bash
  openssl rand -base64 32
  ```
- [ ] Paste into `.env.local`
- [ ] Set `NEXTAUTH_URL=http://localhost:3000`

### Step 6: Install Dependencies
- [ ] Run: `npm install`
- [ ] Wait for completion
- [ ] Verify no critical errors

### Step 7: Test Locally
- [ ] Run: `npm run dev`
- [ ] Open browser to http://localhost:3000
- [ ] Verify landing page loads
- [ ] Click "Start Questionnaire"
- [ ] TEST: Fill out form partially, close, return - should have saved data
- [ ] TEST: Complete form and submit
- [ ] TEST: Check email for confirmation
- [ ] Go to admin: http://localhost:3000/admin/login
- [ ] TEST: Login with any email/password
- [ ] TEST: See submission in dashboard
- [ ] TEST: Export as CSV
- [ ] TEST: Export as JSON

---

## Pre-Deployment Checks

- [ ] All environment variables configured
- [ ] Database is set up and tables verified
- [ ] Email sending tested successfully
- [ ] Form submission tested end-to-end
- [ ] Admin dashboard accessible
- [ ] No console errors in browser (F12)
- [ ] No errors in terminal output
- [ ] Build succeeds: `npm run build`

---

## Production Deployment (Vercel)

### Step 1: Prepare GitHub Repository
- [ ] Initialize git: `git init`
- [ ] Add all files: `git add .`
- [ ] Initial commit: `git commit -m "Initial commit"`
- [ ] Rename branch: `git branch -M main`
- [ ] Add remote: `git remote add origin https://github.com/yourusername/repo`
- [ ] Push: `git push -u origin main`

### Step 2: Deploy to Vercel
- [ ] Go to vercel.com
- [ ] Sign up/login with GitHub
- [ ] Click "New Project"
- [ ] Import your repository
- [ ] Click "Import"

### Step 3: Configure Environment on Vercel
- [ ] Project Settings → Environment Variables
- [ ] Add each variable from `.env.local`:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `SMTP_HOST`
  - [ ] `SMTP_PORT`
  - [ ] `SMTP_USER`
  - [ ] `SMTP_PASS`
  - [ ] `SMTP_FROM`
  - [ ] `NEXTAUTH_SECRET`
  - [ ] `NEXTAUTH_URL` (set to your domain or keep as default)
  - [ ] `ADMIN_EMAIL`

### Step 4: Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Verify no build errors
- [ ] Click on the deployment URL

### Step 5: Verify Production
- [ ] Domain loads successfully
- [ ] Landing page displays correctly
- [ ] Form loads and functions
- [ ] Form submission works
- [ ] Admin dashboard accessible
- [ ] Email confirmation received

---

## Production Setup (Custom Domain)

- [ ] Purchase domain if needed
- [ ] In Vercel: Settings → Domains
- [ ] Add your domain
- [ ] Follow DNS configuration steps
- [ ] Update domain nameservers
- [ ] Wait 24-48 hours for DNS propagation
- [ ] Verify domain works
- [ ] Update `NEXTAUTH_URL=https://yourdomain.com` on Vercel
- [ ] Redeploy

---

## Post-Deployment Monitoring

- [ ] Set up email alerts for errors
- [ ] Monitor form submissions
- [ ] Check database usage
- [ ] Verify email delivery
- [ ] Set up uptime monitoring
- [ ] Configure error tracking (Sentry optional)
- [ ] Test admin dashboard regularly
- [ ] Review submissions periodically

---

## Customization (Before or After Launch)

- [ ] Update branch name in `lib/constants.ts`
- [ ] Update branch phone/email
- [ ] Customize form sections if needed
- [ ] Update email templates if needed
- [ ] Change colors in `tailwind.config.js`
- [ ] Update landing page content in `app/page.tsx`

---

## Backup & Security

- [ ] Enable Supabase automated backups
- [ ] Set backup retention to 30 days
- [ ] Test backup restoration process
- [ ] Enable RLS on all tables
- [ ] Verify no sensitive data in logs
- [ ] Use strong passwords
- [ ] Rotate API keys quarterly
- [ ] Enable 2FA on all admin accounts

---

## Launch Readiness

- [ ] Testing completed successfully
- [ ] All documentation reviewed
- [ ] Team trained on usage
- [ ] Backup procedures documented
- [ ] Monitoring configured
- [ ] Support process defined
- [ ] Go/No-Go decision made
- [ ] Launch date set

---

## Post-Launch

- [ ] Monitor for errors in first 24 hours
- [ ] Test all functionality in production
- [ ] Verify email confirmations working
- [ ] Monitor submission volume
- [ ] Check database performance
- [ ] Gather user feedback
- [ ] Plan for scaling if needed
- [ ] Schedule maintenance window if needed

---

## Troubleshooting Checklist

**Can't connect to Supabase?**
- [ ] Verify URL format is correct
- [ ] Check API keys are not truncated
- [ ] Verify Supabase project is running
- [ ] Check firewall settings

**Emails not sending?**
- [ ] Verify SMTP credentials are correct
- [ ] For Gmail: Ensure App Password is used (not regular password)
- [ ] Check email service logs
- [ ] Test SMTP connection with Telnet or online tool

**Database errors?**
- [ ] Verify all tables exist
- [ ] Check Row Level Security is enabled
- [ ] Verify service role key is set
- [ ] Check database is not at capacity

**Form not saving?**
- [ ] Check browser console for errors (F12)
- [ ] Verify Supabase connection
- [ ] Check network tab for failed requests
- [ ] Verify `SUPABASE_SERVICE_ROLE_KEY` is set

**Admin dashboard won't load?**
- [ ] Check admin authentication context
- [ ] Verify localhost token storage
- [ ] Clear browser cache/cookies
- [ ] Try in incognito window

---

## Quick Reference Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm start                      # Start production server
npm run lint                   # Run linter

# Utilities
npm install                    # Install dependencies
npm update                     # Update packages
npm list                       # List installed packages

# Database
psql "your-connection-string"  # Connect to database

# Git
git status                     # Check git status
git add .                      # Stage all changes
git commit -m "message"        # Commit changes
git push                       # Push to remote
```

---

## Support Resources

- 📖 Documentation: README.md
- ⚡ Quick Start: QUICKSTART.md
- 🚀 Deployment: DEPLOYMENT.md
- 🎨 Customization: CUSTOMIZATION.md
- 📋 Files: PROJECT_FILES.md
- 💡 Start: START_HERE.md

---

## Final Verification

Before launching to production, verify:

- [ ] All items in this checklist are complete
- [ ] No critical errors in logs
- [ ] All tests passed
- [ ] Documentation is up to date
- [ ] Team is trained
- [ ] Backups are configured
- [ ] Monitoring is active
- [ ] Go/No-Go approval received

---

**You're ready to launch! 🚀**

*Last updated: April 5, 2026*
