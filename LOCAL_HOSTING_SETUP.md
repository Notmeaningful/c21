# 🚀 Local Hosting Setup Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 18+ or 20+ ([Download here](https://nodejs.org/))
- ✅ npm (comes with Node.js)
- ✅ This project folder

## Quick Start (5 minutes)

### Step 1: Install Node.js
1. Go to https://nodejs.org/
2. Download LTS version
3. Run installer and follow prompts
4. Verify installation:
   ```bash
   node --version  # Should show v18.x.x or higher
   npm --version   # Should show 9.x.x or higher
   ```

### Step 2: Navigate to Project
```bash
cd "/Users/ahmadalameri/Downloads/centry21 questioneer"
```

### Step 3: Install Dependencies
```bash
npm install
```
This downloads all required packages (takes 2-3 minutes first time).

### Step 4: Configure Environment (Optional)
The `.env.local` file has placeholder values that work for local testing.

For email features, update `.env.local`:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@youremail.com
```

For database (Supabase):
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

### Step 5: Start Local Server
```bash
npm run dev
```

### Step 6: Open in Browser
Visit: **http://localhost:3000**

You should see:
- ✅ Landing page with Century 21 branding
- ✅ "Start Questionnaire" button
- ✅ Navigation bar

## Testing the Application Locally

### Test the Form (No Credentials Needed)
1. Click "Start Questionnaire"
2. Fill out the form sections
3. Auto-saves as you type (check browser storage)
4. Submit (will show success even without email/database)

### Test Admin Dashboard (No Auth Needed Locally)
1. Go to: http://localhost:3000/admin/login
2. Enter any email/password (localhost doesn't validate)
3. You'll see empty submission list (no database data without Supabase)

### What Works Without Setup
- ✅ Form navigation
- ✅ Form validation
- ✅ Auto-save to browser
- ✅ UI/Design preview
- ✅ All pages load correctly

### What Needs Configuration
- ❌ Email notifications (requires SMTP credentials)
- ❌ Database storage (requires Supabase)
- ❌ Admin dashboard data (requires database)

## Quick Configuration for Full Testing

### Gmail Setup (Free, 10 minutes)
1. Enable 2FA on Gmail
2. Go to: myaccount.google.com → Security → App passwords
3. Generate app password (16 characters)
4. Update `.env.local`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx
   SMTP_FROM=your-email@gmail.com
   ```
5. Restart dev server: Press Ctrl+C, then `npm run dev`

### Supabase Setup (Free tier, 15 minutes)
1. Go to https://supabase.com
2. Sign up / login
3. Create new project
4. In Settings → API Keys, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY`
5. Go to SQL Editor
6. Create new query
7. Paste entire contents of `database.sql`
8. Execute
9. Update `.env.local` with credentials
10. Restart dev server

## Troubleshooting

### Port 3000 Already in Use
```bash
# Use a different port
npm run dev -- -p 3001
# Then visit: http://localhost:3001
```

### Module Not Found Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Environment Variables Not Loading
```bash
# Make sure .env.local exists in project root
# Restart the dev server after changes
# Changes to .env.local require server restart
```

### CORS or API Errors
- Supabase CORS: Check Settings → API → CORS on Supabase dashboard
- SMTP errors: Verify email credentials in .env.local

## Available Commands

```bash
npm run dev       # Start development server (http://localhost:3000)
npm run build     # Build for production
npm start         # Start production server (after build)
npm run lint      # Check code quality
```

## File Structure for Local Hosting

```
project-root/
├── app/                 # Next.js pages & API routes
│   ├── page.tsx         # Landing page
│   ├── form/page.tsx    # Questionnaire form
│   ├── admin/           # Admin dashboard
│   ├── api/             # API endpoints
│   └── globals.css      # Styling
├── components/          # React components
├── lib/                 # Utilities & config
├── public/              # Static assets
├── .env.local           # Your configuration (LOCAL)
├── .env.example         # Configuration template
├── package.json         # Dependencies
├── next.config.js       # Next.js config
├── tailwind.config.js   # Styling config
└── tsconfig.json        # TypeScript config
```

## Access Points

### Local Development
- **Landing Page:** http://localhost:3000
- **Questionnaire:** http://localhost:3000/form
- **Submission Success:** http://localhost:3000/submission/[id]
- **Admin Login:** http://localhost:3000/admin/login
- **Admin Dashboard:** http://localhost:3000/admin/dashboard

### API Endpoints (Local)
- **Create Submission:** `POST /api/submissions`
- **Get Submissions:** `GET /api/submissions`
- **Get Submission:** `GET /api/submissions/[id]`
- **Update Submission:** `PATCH /api/submissions/[id]`
- **Delete Submission:** `DELETE /api/submissions/[id]`
- **Export Submissions:** `GET /api/submissions/export?format=csv`
- **Admin Login:** `POST /api/auth/admin-login`

## Development Tips

### Hot Reload
Changes to files automatically reload in browser (no restart needed for most changes).

### Browser DevTools
- F12 to open DevTools
- Console tab shows errors
- Application tab shows stored data (localStorage)
- Network tab shows API calls

### Testing Forms Locally
1. Open DevTools → Application → Local Storage
2. Look for key: `c21_questionnaire_draft`
3. See real-time form data being saved

## Next Steps

1. ✅ Install Node.js
2. ✅ Run `npm install`
3. ✅ Run `npm run dev`
4. ✅ Visit http://localhost:3000
5. ✅ Explore the application
6. (Optional) Configure email/database for full features

## Production Deployment

When ready to go live:
- See `DEPLOYMENT.md` for Vercel deployment
- See `README.md` for complete documentation
- See `CUSTOMIZATION.md` for making changes

---

**Ready to host locally?** Install Node.js and run: `npm install && npm run dev`
