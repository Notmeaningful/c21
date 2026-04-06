// Shared in-memory reset tokens store
// In production, store in a database with expiration
export const resetTokens: Record<string, { username: string; expires: number }> = {};
