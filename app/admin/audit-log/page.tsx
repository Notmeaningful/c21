'use client';

import { useState, useEffect } from 'react';
import { AuditLogEntry, getAuditLogs } from '@/lib/store/audit-store';

const ACTION_COLORS: Record<string, string> = {
  login: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  logout: 'text-gray-500 bg-gray-50 border-gray-200',
  create: 'text-blue-600 bg-blue-50 border-blue-200',
  update: 'text-amber-600 bg-amber-50 border-amber-200',
  delete: 'text-red-600 bg-red-50 border-red-200',
  export: 'text-purple-600 bg-purple-50 border-purple-200',
  password_change: 'text-orange-600 bg-orange-50 border-orange-200',
  user_create: 'text-blue-600 bg-blue-50 border-blue-200',
  user_delete: 'text-red-600 bg-red-50 border-red-200',
};

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    setLogs(getAuditLogs());
  }, []);

  const filtered = filter === 'all' ? logs : logs.filter(l => l.action === filter);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <h1 className="text-heading-md">Audit Log</h1>
          <p className="text-gray-500 text-sm mt-1">Track all admin activity</p>
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="text-sm border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 bg-white dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-c21-gold/20 focus:border-c21-gold/40"
        >
          <option value="all">All Actions</option>
          <option value="login">Logins</option>
          <option value="create">Creates</option>
          <option value="update">Updates</option>
          <option value="delete">Deletes</option>
          <option value="export">Exports</option>
          <option value="password_change">Password Changes</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl">
          <p className="text-gray-400">No audit logs yet</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50 dark:divide-gray-700">
            {filtered.map(entry => (
              <div key={entry.id} className="px-4 sm:px-6 py-4 flex items-start gap-3 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex-shrink-0 mt-0.5">
                  <span className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-medium rounded-md border ${ACTION_COLORS[entry.action] || 'text-gray-500 bg-gray-50 border-gray-200'}`}>
                    {entry.action.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{entry.user}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {entry.action.replace('_', ' ')} {entry.resource}
                      {entry.resourceId ? ` (${entry.resourceId.slice(0, 8)}...)` : ''}
                    </span>
                  </div>
                  {entry.details && (
                    <p className="text-xs text-gray-500 mt-0.5">{entry.details}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1 sm:hidden">
                    {new Date(entry.timestamp).toLocaleString('en-AU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="hidden sm:block flex-shrink-0 text-xs text-gray-400">
                  {new Date(entry.timestamp).toLocaleString('en-AU', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
