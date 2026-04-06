# 🚀 Host Locally - Quick Start (2 Options)

## Option 1: Quick Start with Python (Works Right Now, No Installation)

### Start Hosting in 30 Seconds:

```bash
cd "/Users/ahmadalameri/Downloads/centry21 questioneer"
python3 serve-local.py
```

Then open your browser: **http://localhost:3000**

This serves the static files locally. Perfect for:
- ✅ Viewing the landing page
- ✅ Exploring the UI/Design  
- ✅ Testing the form interface
- ✅ Development and design iteration

### Limitations:
- ❌ No backend API (forms won't submit to database)
- ❌ No email notifications
- ❌ Admin dashboard won't work fully
- ✅ But you can see the entire UI and layout!

---

## Option 2: Full Setup with Node.js (For Production-Ready Features)

### Prerequisites:
- Install Node.js 18+ from https://nodejs.org/

### Quick Start (5 minutes):

```bash
cd "/Users/ahmadalameri/Downloads/centry21 questioneer"
npm install
npm run dev
```

Then open: **http://localhost:3000**

This provides:
- ✅ Full API functionality
- ✅ Form submission to database
- ✅ Email notifications
- ✅ Admin dashboard
- ✅ Complete application features

---

## Recommendation

- **Want to explore the UI now?** → Use **Option 1** (Python, 30 seconds)
- **Want full functionality?** → Use **Option 2** (Node.js, 5 minutes after installation)

---

## Switching Between Servers

### Stop Any Running Server:
Press **Ctrl+C** in the terminal

### Switch Servers:
If Python is running and you want to use Node.js:
1. Press Ctrl+C to stop Python server
2. Run: `npm run dev`
3. Visit: http://localhost:3000

### Port Already in Use?
If port 3000 is busy:
- **Python:** Edit serve-local.py, change `PORT = 3000` to `PORT = 3001`
- **Node.js:** Run `npm run dev -- -p 3001`

Then visit: `http://localhost:3001`

---

## What You'll See

### Landing Page (Works with Both Options)
```
┌─────────────────────────────────┐
│      Century 21 Logo            │
│  Premium Property Management    │
│                                 │
│  [Start Questionnaire Button]   │
│                                 │
│  Features section               │
│  Contact info                   │
└─────────────────────────────────┘
```

### Form Pages (Works Better with Node.js)
- 8 sections of property questionnaire
- Auto-save to browser storage
- Progress tracking
- Validation messages

### Admin Dashboard (Requires Node.js + Supabase)
- Login page
- Submission management
- Search and filtering
- Export capabilities

---

## Testing the Form Locally

### With Python Server (Data saved locally):
1. Open http://localhost:3000
2. Click "Start Questionnaire"
3. Fill out form sections
4. Data saves to browser storage
5. Close browser and reopen - data persists!

### With Node.js Server (Full features):
1. Open http://localhost:3000
2. Click "Start Questionnaire"  
3. Fill out and submit
4. Get confirmation email (if configured)
5. See data in admin dashboard

---

## Development Tips

### View Browser Storage (Both Options):
1. Open http://localhost:3000
2. Press F12 (Developer Tools)
3. Go to "Application" tab
4. Click "Local Storage"
5. Look for: `c21_questionnaire_draft`
6. See your form data in real-time!

### View Console Errors (Both Options):
1. Press F12
2. Click "Console" tab
3. See any JavaScript errors
4. Helps debug issues

### Hot Reload (Node.js Only):
- Changes to .tsx, .css, .ts files automatically reload browser
- No need to restart server
- Perfect for development

---

## Next Steps

1. **Right now:** Run `python3 serve-local.py` and explore the UI
2. **Later:** Install Node.js and run `npm run dev` for full features
3. **To customize:** Edit files in `app/`, `components/`, `lib/`
4. **To deploy:** Follow `DEPLOYMENT.md` for Vercel

---

## Troubleshooting

### Python Server Issues
```bash
# Check if port is in use:
lsof -i :3000

# Kill process on port 3000:
kill -9 $(lsof -t -i:3000)

# Use different port:
# Edit serve-local.py: change PORT = 3000 to PORT = 3001
```

### Node.js Not Found
```bash
# Install Node.js from https://nodejs.org/
# Then verify:
node --version
npm --version
```

### Module Not Found After npm install
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## File Structure

```
project/
├── app/                    # All pages and API
├── components/             # React components
├── lib/                    # Utilities
├── public/                 # Static files (images, etc)
├── serve-local.py         # Python server (Option 1)
├── package.json           # Node.js dependencies
├── tsconfig.json          # TypeScript config
├── tailwind.config.js     # Styling config
└── .env.local             # Your config
```

---

## Quick Commands

```bash
# Python option - start hosting NOW:
python3 serve-local.py

# Node.js option - full features:
npm install
npm run dev

# Stop server:
Ctrl+C

# Check what's running on port 3000:
lsof -i :3000

# Kill process on port 3000:
kill -9 $(lsof -t -i:3000)

# Use different port with Node.js:
npm run dev -- -p 3001

# Build for production:
npm run build
npm start
```

---

**Ready to start?** 

Pick one:
- 🐍 Quick UI preview: `python3 serve-local.py`
- 🚀 Full features: Install Node.js, then `npm install && npm run dev`

Both visit: **http://localhost:3000**
