import bcrypt from 'bcryptjs';

// Pre-computed bcrypt hash for admin password
const ADMIN_HASH = '$2b$10$JggJ2H7CiFwqWsb17zfDAeS7R5aSv2HyNCD0gEjDt1SFiMwoR3wsW';

let _users: Record<string, { password: string; role: string; createdAt: string; email?: string }> | null = null;

export function getUsers() {
  if (!_users) {
    _users = {
      ahmad123: { password: ADMIN_HASH, role: 'admin', createdAt: new Date().toISOString(), email: process.env.ADMIN_EMAIL },
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
