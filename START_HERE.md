# 🚀 START HERE

Welcome to the Century 21 Property Questionnaire System! This guide will get you up and running quickly.

## What You've Got

A complete, production-ready web application for managing property questionnaires with:
- ✅ Beautiful multi-step form
- ✅ Admin dashboard
- ✅ Email notifications
- ✅ Secure backend
- ✅ Data export
- ✅ Mobile responsive

## Quick Navigation

### 👤 I'm a Developer - I want to run this locally
**[QUICKSTART.md](QUICKSTART.md)** - 5 minute setup guide

### 🚀 I'm ready to deploy to production
**[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide for Vercel, Docker, etc.

### 🎨 I want to customize the form/branding
**[CUSTOMIZATION.md](CUSTOMIZATION.md)** - Learn how to modify everything

### 📖 I want detailed documentation
**[README.md](README.md)** - Complete technical documentation

### 📋 What's included in this project?
**[BUILD_SUMMARY.md](BUILD_SUMMARY.md)** - Everything that was built

---

## The Fastest Path to Production

### Step 1: Local Development (5 mins)
```bash
# 1. Get Supabase (free: supabase.com)
# 2. Copy .env.example to .env.local
# 3. Fill in your Supabase credentials
# 4. Fill in SMTP (use Gmail for testing)
npm install
npm run dev
# Open http://localhost:3000
```

### Step 2: Deploy to Vercel (3 mins)
```bash
# Push code to GitHub
# Go to vercel.com and import your repository
# Add environment variables
# Deploy
```

### Step 3: Customize
Edit `lib/constants.ts` to customize:
- Branch name and contact info
- Form sections and questions
- Email templates

---

## File Overview

| File | Purpose |
|------|---------|
| `.env.local` | Your configuration (create from .env.example) |
| `app/page.tsx` | Landing page |
| `app/form/page.tsx` | Questionnaire form |
| `app/admin/` | Admin dashboard |
| `lib/constants.ts` | All form questions |
| `lib/email.ts` | Email templates |
| `app/globals.css` | Styling and branding |

---

## Key Directories

```
app/                 - Pages and API routes
├── form/           - Questionnaire page
├── admin/          - Admin dashboard
├── api/            - Backend endpoints
└── submission/     - Success page

components/         - React components
├── form/           - Form-specific components
└── Navbar.tsx      - Navigation

lib/
├── contexts/       - State management
├── constants.ts    - Form configuration
├── supabase.ts     - Database setup
├── email.ts        - Email templates
└── utils.ts        - Utility functions
```

---

## Common Tasks

### Change the form questions
1. Edit `lib/constants.ts`
2. Modify the `FORM_SECTIONS` array
3. Restart dev server

### Change colors/branding
1. Edit `tailwind.config.js`
2. Change the color values
3. Update `BRANCH_NAME` in `lib/constants.ts`
4. Update email templates in `lib/email.ts`

### Change branch information
Edit `lib/constants.ts`:
```typescript
export const BRANCH_NAME = 'Your Branch';
export const BRANCH_PHONE = 'Your Phone';
export const BRANCH_EMAIL = 'your@email.com';
```

### Test email sending
1. Fill `.env.local` with SMTP details
2. Complete a form submission
3. Check your email inbox

---

## Troubleshooting

**Can't start the dev server?**
```bash
rm -rf node_modules
npm install
npm run dev
```

**No database connection?**
- Check `.env.local` has correct Supabase URL and keys
- Verify Supabase project is running
- Run `database.sql` in Supabase SQL editor

**Emails not working?**
- For Gmail: Use App Password, not regular password
- Check SMTP credentials in `.env.local`
- Look at terminal for error messages

**Form not showing up?**
- Check browser console (F12) for errors
- Verify you're at `http://localhost:3000/form`

---

## Next Steps

1. **[QUICKSTART.md](QUICKSTART.md)** - Get it running locally
2. **Test the form** - Fill it out end-to-end
3. **[CUSTOMIZATION.md](CUSTOMIZATION.md)** - Make it yours
4. **[DEPLOYMENT.md](DEPLOYMENT.md)** - Take it live

---

## File Checklist

Make sure you have these files:

- ✅ `.env.local` (from .env.example)
- ✅ `package.json`
- ✅ `tsconfig.json`
- ✅ `tailwind.config.js`
- ✅ `lib/constants.ts` (form configuration)
- ✅ `app/page.tsx` (landing page)
- ✅ `app/form/page.tsx` (questionnaire)
- ✅ `database.sql` (database schema)

---

## Support Resources

- 📚 **Complete Docs:** [README.md](README.md)
- 🚀 **Deployment:** [DEPLOYMENT.md](DEPLOYMENT.md)
- 🎨 **Customization:** [CUSTOMIZATION.md](CUSTOMIZATION.md)
- ⚡ **Quick Start:** [QUICKSTART.md](QUICKSTART.md)
- 📊 **What's Built:** [BUILD_SUMMARY.md](BUILD_SUMMARY.md)

---

## Need Help?

- 📞 **Phone:** 02 9727 6677
- ✉️ **Email:** rentals@c21fairfield.com.au
- 📍 **Address:** 1/95-97 Ware Street, Fairfield NSW 2165

---

## Ready? Let's Go! 🎉

👉 **Next:** Open [QUICKSTART.md](QUICKSTART.md) and follow the 5-minute setup!

---

*Built for Century 21 • Production-Ready • Fully Documented*
