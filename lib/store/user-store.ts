import bcrypt from 'bcryptjs';

// Users stored in module-level variable (persists across requests in dev)
// In production, use a database
const users: Record<string, { password: string; role: string; createdAt: string; email?: string }> = {
  ahmad: { password: bcrypt.hashSync('123', 10), role: 'admin', createdAt: new Date().toISOString(), email: 'maan@c21fairfield.com.au' },
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
