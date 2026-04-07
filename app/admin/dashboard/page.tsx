'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/contexts/AdminAuthContext';
import { getResponses, deleteResponse, getTemplates, seedDemoResponsesOnce } from '@/lib/store/questionnaire-store';
import { QuestionnaireResponse } from '@/lib/types/questionnaire';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, adminUsername, logout, isLoading: authLoading } = useAdminAuth();
  const [responses, setResponses] = useState<QuestionnaireResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadResponses();
    }
  }, [isAuthenticated, filter]);

  const loadResponses = async () => {
    setIsLoading(true);
    try {
      seedDemoResponsesOnce();

      // Fetch server-side responses (real submissions from any device)
      let serverResponses: QuestionnaireResponse[] = [];
      try {
        const res = await fetch('/api/responses');
        if (res.ok) {
          serverResponses = await res.json();
        }
      } catch {}

      // Merge server + localStorage, server takes priority (dedup by id)
      const merged = new Map<string, QuestionnaireResponse>();
      getResponses().forEach(r => merged.set(r.id, r));
      serverResponses.forEach(r => merged.set(r.id, r));

      let all = Array.from(merged.values());
      if (filter !== 'all') {
        all = all.filter(r => r.status === filter);
      }
      // Sort newest first
      all.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setResponses(all);
    } catch {
      toast.error('Failed to load responses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this response?')) return;
    deleteResponse(id);
    setResponses(responses.filter(r => r.id !== id));
    toast.success('Response deleted');
  };

  const handleExport = (format: 'csv' | 'json') => {
    try {
      const data = getResponses();
      if (format === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        downloadBlob(blob, `responses-${Date.now()}.json`);
      } else {
        const headers = ['ID', 'Questionnaire', 'Respondent', 'Email', 'Status', 'Submitted'];
        const rows = data.map(r => [
          r.id,
          r.questionnaireTitle,
          r.respondentName,
          r.respondentEmail,
          r.status,
          r.submittedAt || r.updatedAt,
        ]);
        const csv = [headers, ...rows].map(row => row.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        downloadBlob(blob, `responses-${Date.now()}.csv`);
      }
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch {
      toast.error('Export failed');
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const filteredResponses = responses.filter(r =>
    searchTerm === ''
      ? true
      : (r.respondentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.respondentEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.questionnaireTitle || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-c21-gold mx-auto mb-4"></div>
          <p className="text-c21-gold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-c21-light-gray dark:bg-gray-900">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm border border-gray-100 dark:border-gray-700 rounded-t-2xl">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">{adminUsername}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-c21-gold text-c21-black font-semibold rounded hover:opacity-90 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card dark:bg-gray-800 dark:border-gray-700 p-6 text-center">
            <p className="text-3xl font-bold text-c21-gold">{responses.length}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Total Responses</p>
          </div>
          <div className="card dark:bg-gray-800 dark:border-gray-700 p-6 text-center">
            <p className="text-3xl font-bold text-c21-gold">{responses.filter((r) => r.status === 'in-progress').length}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">In Progress</p>
          </div>
          <div className="card dark:bg-gray-800 dark:border-gray-700 p-6 text-center">
            <p className="text-3xl font-bold text-c21-gold">{responses.filter((r) => r.status === 'submitted').length}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Submitted</p>
          </div>
          <div className="card dark:bg-gray-800 dark:border-gray-700 p-6 text-center">
            <p className="text-3xl font-bold text-c21-gold">{getTemplates().length}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Questionnaires</p>
          </div>
        </div>

        {/* Controls */}
        <div className="card dark:bg-gray-800 dark:border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-gray-200">Search</label>
              <input
                type="text"
                placeholder="Search by name, email, or questionnaire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-gray-200">Filter by Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="form-input"
              >
                <option value="all">All Responses</option>
                <option value="in-progress">In Progress</option>
                <option value="submitted">Submitted</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={() => handleExport('csv')}
                className="btn-secondary flex-1 text-sm"
              >
                Export CSV
              </button>
              <button
                onClick={() => handleExport('json')}
                className="btn-secondary flex-1 text-sm"
              >
                Export JSON
              </button>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="card dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-c21-gold mx-auto mb-4"></div>
              <p className="text-gray-600">Loading submissions...</p>
            </div>
          ) : filteredResponses.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <p>No responses found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Questionnaire</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Respondent</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-c21-gray">
                  {filteredResponses.map((response) => (
                    <tr key={response.id} className="hover:bg-c21-light-gray dark:hover:bg-gray-700/50 transition">
                      <td className="px-6 py-3 text-sm dark:text-gray-200">{response.questionnaireTitle}</td>
                      <td className="px-6 py-3 text-sm dark:text-gray-200">{response.respondentName || '—'}</td>
                      <td className="px-6 py-3 text-sm dark:text-gray-200">{response.respondentEmail || '—'}</td>
                      <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(response.submittedAt || response.updatedAt).toLocaleDateString('en-AU')}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            response.status === 'submitted'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}
                        >
                          {response.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-center">
                        <Link
                          href={`/admin/questionnaires/${response.questionnaireId}/responses`}
                          className="text-c21-gold hover:opacity-80 mr-3"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(response.id)}
                          className="text-red-600 hover:opacity-80"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
