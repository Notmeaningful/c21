# Quick Start Guide

Get the Century 21 Property Questionnaire System up and running in 5 minutes.

## Requirements

- Node.js 18+
- npm or yarn
- A Supabase account (free at supabase.com)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment

Create `.env.local` file:

```env
# Get these from Supabase (Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Email (use Gmail for testing - see note below)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
SMTP_FROM=noreply@gmail.com

# Basic settings
NEXTAUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@century21.com
```

### Note on Gmail SMTP

For testing with Gmail:
1. Enable 2FA on Gmail
2. Create App Password (not regular password)
3. Use the 16-character app password

## Step 3: Database Setup

1. Create a Supabase project at supabase.com
2. Go to SQL Editor
3. Paste contents of `database.sql`
4. Execute

## Step 4: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Step 5: Test the Form

1. Click "Start Questionnaire"
2. Fill out the multi-step form
3. Submit
4. Check your email for confirmation

## Admin Dashboard

1. Navigate to http://localhost:3000/admin/login
2. Enter any email/password (demo mode)
3. View submissions and export data

## What's Next?

- Read [README.md](README.md) for detailed documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Customize colors, text, and form fields in `lib/constants.ts`
- Configure email templates in `lib/email.ts`

## Common Issues

**Can't connect to Supabase?**
- Check your URL and API keys
- Verify Supabase project is running
- Check for typos in `.env.local`

**Emails not sending?**
- For Gmail: Make sure app password is used (not regular password)
- For other services: Check SMTP credentials are correct
- Look for errors in terminal output

**Form not saving data?**
- Open browser console (F12) for errors
- Check Supabase table exists
- Verify SUPABASE_SERVICE_ROLE_KEY is set

## Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

---

Need help? Contact: rentals@c21fairfield.com.au
