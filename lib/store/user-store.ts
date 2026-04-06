import bcrypt from 'bcryptjs';

// Password is controlled exclusively by the ADMIN_PASSWORD environment variable.
// Set it in .env.local (local) and in Netlify environment variables (production).
if (process.env.NODE_ENV === 'production' && !process.env.ADMIN_PASSWORD) {
  throw new Error('[SECURITY] ADMIN_PASSWORD environment variable must be set in production.');
}

const adminHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'dev-local-only', 10);

const users: Record<string, { password: string; role: string; createdAt: string; email?: string }> = {
  ahmad: { password: adminHash, role: 'admin', createdAt: new Date().toISOString(), email: process.env.ADMIN_EMAIL },
};

export function getUsers() {
  return users;
}

export function verifyPassword(plainText: string, hash: string): boolean {
  return bcrypt.compareSync(plainText, hash);
}

export function hashPassword(plainText: string): string {
  return bcrypt.hashSync(plainText, 10);
}
