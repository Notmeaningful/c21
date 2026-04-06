'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/contexts/AdminAuthContext';
import { SubmissionData } from '@/lib/supabase';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, adminUsername, logout, isLoading: authLoading } = useAdminAuth();
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
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
      fetchSubmissions();
    }
  }, [isAuthenticated, filter]);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams();
      if (filter !== 'all') {
        query.append('status', filter);
      }

      const response = await fetch(`/api/submissions?${query.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch');

      const { data } = await response.json();
      setSubmissions(data || []);
    } catch (error) {
      toast.error('Failed to fetch submissions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    try {
      const response = await fetch(`/api/submissions/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');

      setSubmissions(submissions.filter((s) => s.id !== id));
      toast.success('Submission deleted');
    } catch (error) {
      toast.error('Failed to delete submission');
    }
  };

  const handleExport = async (format: 'csv' | 'json') => {
    try {
      const response = await fetch(`/api/submissions/export?format=${format}`);
      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.headers.get('content-disposition')?.split('filename=')[1] || `export.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const filteredSubmissions = submissions.filter((sub) =>
    searchTerm === ''
      ? true
      : sub.property_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.owner_names.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchTerm.toLowerCase())
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
            <p className="text-3xl font-bold text-c21-gold">{submissions.length}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Total Submissions</p>
          </div>
          <div className="card dark:bg-gray-800 dark:border-gray-700 p-6 text-center">
            <p className="text-3xl font-bold text-c21-gold">{submissions.filter((s) => s.status === 'pending').length}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Pending Review</p>
          </div>
          <div className="card dark:bg-gray-800 dark:border-gray-700 p-6 text-center">
            <p className="text-3xl font-bold text-c21-gold">{submissions.filter((s) => s.status === 'approved').length}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Approved</p>
          </div>
          <div className="card dark:bg-gray-800 dark:border-gray-700 p-6 text-center">
            <p className="text-3xl font-bold text-c21-gold">{submissions.filter((s) => s.status === 'rejected').length}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Rejected</p>
          </div>
        </div>

        {/* Controls */}
        <div className="card dark:bg-gray-800 dark:border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-gray-200">Search</label>
              <input
                type="text"
                placeholder="Search by property, owner, or email..."
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
                <option value="all">All Submissions</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
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
          ) : filteredSubmissions.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <p>No submissions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Property</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Owner</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-c21-gray">
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-c21-light-gray transition">
                      <td className="px-6 py-3 text-sm font-mono text-c21-gold">{submission.id?.slice(0, 10)}...</td>
                      <td className="px-6 py-3 text-sm">{submission.property_address.slice(0, 30)}...</td>
                      <td className="px-6 py-3 text-sm">{submission.owner_names.slice(0, 20)}</td>
                      <td className="px-6 py-3 text-sm">{submission.email}</td>
                      <td className="px-6 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(submission.created_at || '').toLocaleDateString('en-AU')}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            submission.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : submission.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {submission.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-center">
                        <Link
                          href={`/admin/submissions/${submission.id}`}
                          className="text-c21-gold hover:opacity-80 mr-3"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(submission.id!)}
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
