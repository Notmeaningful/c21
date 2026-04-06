# Century 21 Property Questionnaire System

A modern, luxury web application for Century 21 real estate questionnaire management. Built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

✨ **Core Features**
- 🎯 Multi-step form wizard with progress tracking
- 💾 Auto-save & resume functionality
- ✅ Input validation and error handling
- 🔄 Conditional logic for dynamic form fields
- 📧 Email confirmation to users and admins
- 🗄️ Secure database storage (Supabase)
- 📊 Admin dashboard with analytics
- 📥 CSV/JSON export functionality
- 🎨 Responsive luxury design (mobile-first)
- 🛡️ reCAPTCHA bot protection
- ♿ WCAG accessibility compliance

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Email**: Nodemailer (SMTP)
- **Authentication**: Simple token-based (extend with NextAuth.js)
- **Deployment**: Vercel, Netlify, or self-hosted

## Project Structure

```
.
├── app/
│   ├── api/                          # API routes
│   │   ├── auth/                     # Authentication endpoints
│   │   ├── submissions/              # Submission endpoints
│   │   │   ├── route.ts              # POST/GET submissions
│   │   │   ├── [id]/route.ts         # Individual submission operations
│   │   │   └── export/route.ts       # CSV/JSON export
│   ├── admin/                        # Admin panel
│   │   ├── login/page.tsx            # Admin login
│   │   ├── dashboard/page.tsx        # Submissions dashboard
│   │   └── submissions/[id]/page.tsx # Submission details
│   ├── form/page.tsx                 # Main questionnaire form
│   ├── submission/[id]/page.tsx      # Success page
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Landing page
│   └── globals.css                   # Global styles
├── components/
│   ├── Navbar.tsx                    # Navigation bar
│   └── form/                         # Form components
│       ├── FormInputs.tsx            # Input components
│       ├── Progress.tsx              # Progress indicators
│       └── MultiStepForm.tsx         # Main form component
├── lib/
│   ├── contexts/                     # React contexts
│   │   ├── FormContext.tsx           # Form state management
│   │   └── AdminAuthContext.tsx      # Admin authentication
│   ├── supabase.ts                   # Supabase client setup
│   ├── constants.ts                  # Form sections & questions
│   ├── utils.ts                      # Utility functions
│   └── email.ts                      # Email sending
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── tailwind.config.js                # Tailwind configuration
├── next.config.js                    # Next.js configuration
└── database.sql                      # Database schema
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier available)
- SMTP credentials for email sending
- reCAPTCHA v3 keys (optional)

### Installation

1. **Clone the repository**
```bash
cd /Users/ahmadalameri/Downloads/centry21\ questioneer
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@century21.com

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Admin Configuration
ADMIN_EMAIL=admin@century21.com

# reCAPTCHA (optional)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key
```

### Database Setup (Supabase)

1. **Create a Supabase project**
   - Go to https://supabase.com
   - Create a new project
   - Copy your project URL and keys

2. **Run the database schema**
   - Go to Supabase dashboard → SQL Editor
   - Create a new query
   - Copy content from `database.sql`
   - Execute the query

3. **Enable RLS (Row Level Security)**
   - Configure appropriate policies for your use case
   - Default setup allows public submissions and requires auth for admin

### Email Setup

**Gmail (Recommended for development)**
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password
3. Use the app password in `SMTP_PASS`

**Other providers**
- SendGrid: Use SMTP credentials
- AWS SES: Use SMTP credentials
- Any SMTP-compatible service

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Public Form (Questionnaire)
1. Navigate to `http://localhost:3000`
2. Click "Start Questionnaire"
3. Complete the multi-step form
4. Review and submit
5. Receive email confirmation with submission ID

### Admin Dashboard
1. Navigate to `http://localhost:3000/admin/login`
2. Enter any email/password (demo mode)
3. View all submissions
4. Search, filter, and manage submissions
5. Export data as CSV or JSON
6. Update submission status

## API Endpoints

### Submissions
- `POST /api/submissions` - Create new submission
- `GET /api/submissions` - Get all submissions
- `GET /api/submissions/[id]` - Get specific submission
- `PATCH /api/submissions/[id]` - Update submission status
- `DELETE /api/submissions/[id]` - Delete submission
- `GET /api/submissions/export?format=csv` - Export submissions

### Authentication
- `POST /api/auth/admin-login` - Admin login

## Customization

### Changing Bank Details Field Names
Edit `lib/constants.ts` - Look for the "Financial Arrangements" section

### Customizing Email Templates
Edit `lib/email.ts` - `sendSubmissionEmail()` and `sendAdminNotificationEmail()` functions

### Changing Form Questions
Edit `lib/constants.ts` - Modify `FORM_SECTIONS` array

### Brand Customization
Edit `tailwind.config.js` for color scheme:
```javascript
colors: {
  c21: {
    black: '#1a1a1a',
    white: '#ffffff',
    gold: '#d4af37',
    // ... other colors
  }
}
```

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables in Production
1. Go to your deployment platform (Vercel, Netlify, etc.)
2. Add environment variables from `.env.local`
3. Deploy

## Security Considerations

⚠️ **Important**: This is a demo application. For production:

1. **Implement proper authentication** - Use NextAuth.js, Firebase Auth, or Supabase Auth
2. **Add admin dashboard RLS policies** - Prevent unauthorized access
3. **Implement rate limiting** - Prevent form spam
4. **Use HTTPS everywhere** - Enforce SSL/TLS
5. **Sanitize all inputs** - Already done in `lib/utils.ts`
6. **Enable reCAPTCHA** - Uncomment in form component
7. **Implement proper error handling** - Don't expose sensitive data
8. **Add CSRF protection** - Use SameSite cookie flags
9. **Encrypt sensitive fields** - Bank details in database
10. **Regular security audits** - Use tools like OWASP ZAP

## Performance Optimization

- ✅ Image optimization with Next.js Image component
- ✅ Code splitting and lazy loading
- ✅ Tailwind CSS purging
- ✅ API request caching
- ✅ Database indexes on frequently queried columns

## Accessibility

- ✅ ARIA labels on form inputs
- ✅ Proper heading hierarchy
- ✅ Color contrast WCAG AA compliant
- ✅ Keyboard navigation support
- ✅ Semantic HTML

## Testing

```bash
# Run linter
npm run lint

# Run tests (add your test files)
npm test

# Build for production
npm run build
```

## Troubleshooting

### Emails not sending
- Check SMTP credentials
- Verify firewall allows SMTP port
- Check email service logs
- Enable "Less secure apps" for Gmail

### Supabase connection issues
- Verify `NEXT_PUBLIC_SUPABASE_URL` and keys
- Check Supabase project is running
- Verify Row Level Security policies

### Form not saving data
- Check browser console for errors
- Verify Supabase table exists
- Check `SUPABASE_SERVICE_ROLE_KEY` is set

## Future Enhancements

- [ ] Advanced admin analytics dashboard
- [ ] SMS notifications
- [ ] Webhook integrations
- [ ] Document upload support
- [ ] Multi-language support
- [ ] Advanced form builder UI
- [ ] Submission templates
- [ ] Automated workflows
- [ ] Integration with CRM systems

## License

© 2024 Century 21 Vasco Group. All rights reserved.

## Support

For issues or questions:
- 📞 02 9727 6677
- ✉️ rentals@c21fairfield.com.au
- 📍 1/95-97 Ware Street, Fairfield NSW 2165

---

**Built with ❤️ for Century 21**
