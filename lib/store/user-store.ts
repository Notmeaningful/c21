import bcrypt from 'bcryptjs';

function getAdminHash(): string {
  const pwd = process.env.ADMIN_PASSWORD;
  if (process.env.NODE_ENV === 'production' && !pwd) {
    throw new Error('[SECURITY] ADMIN_PASSWORD environment variable must be set in production.');
  }
  return bcrypt.hashSync(pwd || 'dev-local-only', 10);
}

let _users: Record<string, { password: string; role: string; createdAt: string; email?: string }> | null = null;

export function getUsers() {
  if (!_users) {
    _users = {
      ahmad: { password: getAdminHash(), role: 'admin', createdAt: new Date().toISOString(), email: process.env.ADMIN_EMAIL },
    };
  }
  return _users;
}

export function verifyPassword(plainText: string, hash: string): boolean {
  return bcrypt.compareSync(plainText, hash);
}

export function hashPassword(plainText: string): string {
  return bcrypt.hashSync(plainText, 10);
}
