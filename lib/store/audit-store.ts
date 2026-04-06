// Audit Log Store — localStorage-based audit trail

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'export' | 'password_change' | 'user_create' | 'user_delete';
  resource: string; // e.g. 'questionnaire', 'response', 'user', 'session'
  resourceId?: string;
  details?: string;
}

const AUDIT_KEY = 'c21_audit_log';

function getAll(): AuditLogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(AUDIT_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function save(entries: AuditLogEntry[]): void {
  if (typeof window === 'undefined') return;
  // Keep last 500 entries to prevent storage bloat
  const trimmed = entries.slice(-500);
  localStorage.setItem(AUDIT_KEY, JSON.stringify(trimmed));
}

export function addAuditLog(
  user: string,
  action: AuditLogEntry['action'],
  resource: string,
  resourceId?: string,
  details?: string,
): AuditLogEntry {
  const entry: AuditLogEntry = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 6),
    timestamp: new Date().toISOString(),
    user,
    action,
    resource,
    resourceId,
    details,
  };
  const all = getAll();
  all.push(entry);
  save(all);
  return entry;
}

export function getAuditLogs(limit?: number): AuditLogEntry[] {
  const all = getAll();
  const sorted = all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return limit ? sorted.slice(0, limit) : sorted;
}

export function getAuditLogsForResource(resource: string, resourceId?: string): AuditLogEntry[] {
  return getAll()
    .filter(e => e.resource === resource && (!resourceId || e.resourceId === resourceId))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
