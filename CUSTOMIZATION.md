# Form Customization Guide

This guide explains how to customize the questionnaire form for different branches or requirements.

## Table of Contents

1. [Adding/Removing Questions](#addingremoving-questions)
2. [Creating New Sections](#creating-new-sections)
3. [Changing Question Types](#changing-question-types)
4. [Conditional Logic](#conditional-logic)
5. [Customizing Validation](#customizing-validation)
6. [Styling Changes](#styling-changes)

## Adding/Removing Questions

All questions are defined in `lib/constants.ts` → `FORM_SECTIONS` array.

### Adding a New Question

1. Open `lib/constants.ts`
2. Find the section where you want to add the question
3. Add to the `questions` array:

```typescript
{
  id: 'new_field_name',
  label: 'Your Question Text Here?',
  type: 'text', // or 'radio', 'checkbox', 'textarea', etc.
  required: true,
  helperText: 'Optional help text for users',
}
```

### Removing a Question

1. Simply delete the question object from the `questions` array
2. Note: You might need to update SubmissionData type in `lib/supabase.ts`

## Creating New Sections

1. Open `lib/constants.ts`
2. Add new section object to `FORM_SECTIONS`:

```typescript
{
  id: 'section-id',
  title: 'Section Title',
  description: 'Brief description users see',
  questions: [
    // Add your questions here
  ],
}
```

3. The form wizard will automatically display it

## Changing Question Types

Question types available:

### Text Input
```typescript
{
  id: 'phone',
  label: 'Phone Number',
  type: 'text',
  required: true,
  pattern: '^[0-9]{10}$', // Optional regex validation
}
```

### Email Input
```typescript
{
  id: 'email',
  label: 'Email Address',
  type: 'email',
  required: true,
}
```

### Textarea
```typescript
{
  id: 'comments',
  label: 'Additional Comments',
  type: 'textarea',
  required: false,
}
```

### Radio Buttons
```typescript
{
  id: 'rent_frequency',
  label: 'Select an option',
  type: 'radio',
  required: true,
  options: [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
  ],
}
```

### Checkbox
```typescript
{
  id: 'agree',
  label: 'I agree to the terms',
  type: 'checkbox',
  required: true,
}
```

### Date
```typescript
{
  id: 'date_of_inspection',
  label: 'Inspection Date',
  type: 'date',
  required: false,
}
```

## Conditional Logic

Show/hide questions based on previous answers:

```typescript
{
  id: 'council_rate_copy',
  label: 'Upload Council Rate Copy',
  type: 'file',
  required: false,
  // Only show if council_redirect is true
  condition: (data) => data.council_redirect === true,
}
```

Available in form data:
- `data.rent_payment_frequency`
- `data.council_redirect`
- `data.water_redirect`
- `data.strata_redirect`
- `data.insurance_request`
- etc.

## Customizing Validation

### Add Pattern Validation

```typescript
{
  id: 'bank_bsb',
  label: 'BSB',
  type: 'text',
  required: true,
  pattern: '^[0-9]{6}$', // Exactly 6 digits
}
```

### Add Custom Validation

Edit `lib/utils.ts` → `validateForm()` function:

```typescript
if (data.phone_numbers) {
  if (!validatePhoneNumber(data.phone_numbers)) {
    errors.phone_numbers = 'Invalid phone number format';
  }
}
```

## Styling Changes

### Change Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  c21: {
    black: '#1a1a1a',      // Main text color
    white: '#ffffff',      // Background
    gold: '#d4af37',       // Accent/primary buttons
    'gold-accent': '#f0d9b5', // Lighter accent
    gray: '#f5f5f5',       // Light backgrounds
    'dark-gray': '#2c2c2c',
    'light-gray': '#f9f9f9',
  },
}
```

### Change Form Field Appearance

Edit `app/globals.css` → `.form-input` class:

```css
.form-input {
  @apply w-full px-4 py-3 border border-c21-dark-gray rounded-lg 
         focus:outline-none focus:border-c21-gold focus:ring-2 
         focus:ring-c21-gold focus:ring-opacity-30 transition-all 
         duration-200 text-c21-black placeholder-c21-dark-gray 
         placeholder-opacity-50;
}
```

### Change Button Style

Edit button classes in `app/globals.css`:

```css
.btn-primary {
  @apply px-8 py-3 bg-c21-gold text-c21-black font-semibold 
         rounded-lg hover:bg-opacity-90 focus:outline-none 
         focus:ring-2 focus:ring-c21-gold focus:ring-offset-2 
         transition-all duration-200 disabled:opacity-50 
         disabled:cursor-not-allowed;
}
```

## Customizing Branch Information

Edit `lib/constants.ts`:

```typescript
export const BRANCH_NAME = 'Century 21 Your Branch Name';
export const BRANCH_ADDRESS = 'Your Address Here';
export const BRANCH_PHONE = 'Your Phone Number';
export const BRANCH_EMAIL = 'your-email@century21.com';
```

## Customizing Email Templates

Edit `lib/email.ts`:

### User Confirmation Email

```typescript
export async function sendSubmissionEmail(
  to: string,
  submissionData: SubmissionData,
  submissionId: string
): Promise<void> {
  // Customize the HTML template here
  const htmlContent = `... your HTML email ...`;
}
```

### Admin Notification Email

```typescript
export async function sendAdminNotificationEmail(
  submissionData: SubmissionData,
  submissionId: string
): Promise<void> {
  // Customize the admin notification here
}
```

## Adding New Form Sections

Complete example:

```typescript
{
  id: 'utilities',
  title: 'Utilities & Services',
  description: 'Information about utilities at the property',
  questions: [
    {
      id: 'utilities_included',
      label: 'Are utilities included in the rent?',
      type: 'radio',
      required: true,
      options: [
        { value: 'included', label: 'Yes, utilities included' },
        { value: 'separate', label: 'No, utilities are separate' },
      ],
    },
    {
      id: 'internet_available',
      label: 'Is internet available at the property?',
      type: 'radio',
      required: true,
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ],
    },
  ],
}
```

## Testing Your Changes

1. Save changes to `lib/constants.ts`
2. Restart dev server: `npm run dev`
3. Test in browser at http://localhost:3000/form
4. Check browser console for validation errors

## Database Schema Changes

If you add new fields with different names:

1. Update `SubmissionData` type in `lib/supabase.ts`
2. Update `database.sql` with new columns
3. Run migration in Supabase SQL Editor
4. Update validation logic if needed

---

For help with customization, refer to:
- React documentation: https://react.dev
- TypeScript handbook: https://www.typescriptlang.org/docs/
- Tailwind CSS: https://tailwindcss.com/docs
