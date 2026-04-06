import { SubmissionData } from './supabase';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateBSB = (bsb: string): boolean => {
  return /^[0-9]{6}$/.test(bsb);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

export const validateACN = (acn: string): boolean => {
  return /^[0-9]{11}$/.test(acn);
};

export const validateForm = (data: Partial<SubmissionData>): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.property_address?.trim()) {
    errors.property_address = 'Property address is required';
  }

  if (!data.owner_names?.trim()) {
    errors.owner_names = 'Owner names are required';
  }

  if (!data.owner_address?.trim()) {
    errors.owner_address = 'Owner address is required';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Invalid email format';
  }

  if (!data.phone_numbers?.trim()) {
    errors.phone_numbers = 'Phone numbers are required';
  }

  if (!data.emergency_contact?.trim()) {
    errors.emergency_contact = 'Emergency contact is required';
  }

  if (!data.bank_account_name?.trim()) {
    errors.bank_account_name = 'Bank account name is required';
  }

  if (!data.bank_name?.trim()) {
    errors.bank_name = 'Bank name is required';
  }

  if (!data.bank_bsb?.trim()) {
    errors.bank_bsb = 'BSB is required';
  } else if (!validateBSB(data.bank_bsb)) {
    errors.bank_bsb = 'BSB must be 6 digits';
  }

  if (!data.bank_account_number?.trim()) {
    errors.bank_account_number = 'Account number is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const generateSubmissionId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 9);
  return `C21-${timestamp}-${randomStr}`.toUpperCase();
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(amount);
};

export const submissionToCSV = (submissions: SubmissionData[]): string => {
  const headers = [
    'ID',
    'Date',
    'Property Address',
    'Owner Names',
    'Email',
    'Phone',
    'Bank Account',
    'Status',
  ];

  const rows = submissions.map((sub) => [
    sub.id || '',
    formatDate(sub.created_at || new Date()),
    sub.property_address,
    sub.owner_names,
    sub.email,
    sub.phone_numbers.replace(/\n/g, ' | '),
    `${sub.bank_account_name} - ${sub.bank_name}`,
    sub.status || 'pending',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((cell) => {
          const escaped = String(cell).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    ),
  ].join('\n');

  return csvContent;
};

export const downloadCSV = (csv: string, filename: string = 'submissions.csv'): void => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
