'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/lib/contexts/AdminAuthContext';
import toast, { Toaster } from 'react-hot-toast';

interface User {
  username: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const { adminUsername } = useAdminAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('admin');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editPassword, setEditPassword] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername, password: newPassword, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`User "${newUsername}" created`);
      setNewUsername('');
      setNewPassword('');
      setNewRole('admin');
      setShowAddForm(false);
      fetchUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create user');
    }
  };

  const handleDeleteUser = async (username: string) => {
    if (!confirm(`Delete user "${username}"? This cannot be undone.`)) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`User "${username}" deleted`);
      fetchUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete user');
    }
  };

  const handleUpdatePassword = async (username: string) => {
    if (!editPassword.trim()) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: editPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`Password updated for "${username}"`);
      setEditingUser(null);
      setEditPassword('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update password');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-c21-gold/30 border-t-c21-gold"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: '#fff', color: '#1a1a1a', border: '1px solid #e5e5e5', borderRadius: '12px' },
        }}
      />

      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-caption text-c21-gold mb-2">Access Control</p>
          <h1 className="text-heading-md">Users</h1>
          <p className="text-gray-500 mt-2">Manage who can access the admin panel</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={showAddForm ? 'btn-secondary' : 'btn-primary flex items-center gap-2'}
        >
          {showAddForm ? (
            'Cancel'
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add User
            </>
          )}
        </button>
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-6 mb-8 animate-fadeInUp">
          <h3 className="text-gray-900 dark:text-gray-100 font-semibold mb-5">New User</h3>
          <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Username</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
                className="form-input"
                placeholder="Username"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Password</label>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="form-input"
                placeholder="Password"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="form-input"
              >
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <button type="submit" className="btn-primary h-[46px]">
              Create
            </button>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.username}
            className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-5 hover:border-c21-gold/20 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-c21-gold/10 flex items-center justify-center">
                  <span className="text-c21-gold font-bold text-sm uppercase">
                    {user.username.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{user.username}</p>
                    {user.username === adminUsername && (
                      <span className="px-2 py-0.5 text-[10px] rounded-md bg-c21-gold/10 text-c21-gold border border-c21-gold/20 font-medium uppercase tracking-wider">You</span>
                    )}
                    <span className={`px-2 py-0.5 text-[10px] rounded-md font-medium uppercase tracking-wider ${
                      user.role === 'admin'
                        ? 'bg-purple-50 text-purple-600 border border-purple-200'
                        : 'bg-gray-50 text-gray-500 border border-gray-200'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    Created {new Date(user.createdAt).toLocaleDateString('en-AU')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {editingUser === user.username ? (
                  <div className="flex items-center gap-2 animate-fadeInUp">
                    <input
                      type="text"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      placeholder="New password"
                      className="form-input !py-2 !text-sm w-40"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdatePassword(user.username)}
                    />
                    <button
                      onClick={() => handleUpdatePassword(user.username)}
                      className="px-3 py-2 text-xs bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 border border-emerald-500/20 transition-all"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => { setEditingUser(null); setEditPassword(''); }}
                      className="px-3 py-2 text-xs bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100 border border-gray-200 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => { setEditingUser(user.username); setEditPassword(''); }}
                      className="px-3 py-2 text-xs bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 border border-gray-200 transition-all duration-200"
                    >
                      Change Password
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.username)}
                      disabled={user.username === adminUsername}
                      className="px-3 py-2 text-xs bg-red-50 text-red-500 rounded-lg hover:bg-red-100 hover:text-red-600 border border-red-200 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-red-50 disabled:hover:text-red-500"
                      title={user.username === adminUsername ? 'Cannot delete yourself' : 'Delete user'}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">Add your first admin user to get started</p>
        </div>
      )}
    </div>
  );
}
