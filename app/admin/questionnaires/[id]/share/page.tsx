'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { QuestionnaireTemplate, CustomerPortalLink } from '@/lib/types/questionnaire';
import { getTemplate, getPortalLinks, createPortalLink } from '@/lib/store/questionnaire-store';

export default function ShareQuestionnairePage() {
  const params = useParams();
  const [template, setTemplate] = useState<QuestionnaireTemplate | null>(null);
  const [links, setLinks] = useState<CustomerPortalLink[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [expiry, setExpiry] = useState('30');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    const t = getTemplate(id);
    setTemplate(t);
    if (t) setLinks(getPortalLinks(t.id));
    setLoading(false);
  }, [params.id]);

  const handleCreateLink = () => {
    if (!template || !name.trim() || !email.trim()) {
      alert('Please enter recipient name and email');
      return;
    }
    const link = createPortalLink(template.id, name, email, parseInt(expiry) || undefined);
    setLinks(getPortalLinks(template.id));
    setName('');
    setEmail('');
  };

  const getPortalUrl = (token: string) => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/portal/${token}`;
  };

  const copyLink = (token: string) => {
    navigator.clipboard.writeText(getPortalUrl(token));
    setCopiedId(token);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-c21-gold/30 border-t-c21-gold"></div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-gray-500">Questionnaire not found</h2>
      </div>
    );
  }

  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/q/${template.slug}`
    : '';

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-caption text-c21-gold mb-1">Share</p>
          <h1 className="text-heading-md">{template.title}</h1>
          <p className="text-gray-500 text-sm mt-1">Generate portal links to send to your clients</p>
        </div>
        <Link
          href="/admin/questionnaires"
          className="px-4 py-2 text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          Back
        </Link>
      </div>

      {/* Public Link */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-6 mb-4">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-3">Public Link</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Anyone with this link can fill out the questionnaire:</p>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={publicUrl}
            readOnly
            className="form-input flex-1 font-mono text-sm"
          />
          <button
            onClick={() => { navigator.clipboard.writeText(publicUrl); setCopiedId('public'); setTimeout(() => setCopiedId(null), 2000); }}
            className="btn-primary whitespace-nowrap"
          >
            {copiedId === 'public' ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Create Personal Link */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-6 mb-4">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-3">Send Personal Link</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Create a personalized link for a specific client.</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Recipient name"
            className="form-input"
          />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Recipient email"
            className="form-input"
          />
          <select
            value={expiry}
            onChange={e => setExpiry(e.target.value)}
            className="form-input"
          >
            <option value="7">Expires in 7 days</option>
            <option value="14">Expires in 14 days</option>
            <option value="30">Expires in 30 days</option>
            <option value="90">Expires in 90 days</option>
            <option value="">No expiry</option>
          </select>
          <button
            onClick={handleCreateLink}
            className="btn-primary"
          >
            Create Link
          </button>
        </div>
      </div>

      {/* Existing Links */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-4">Generated Links ({links.length})</h2>
        {links.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-sm">No links generated yet.</p>
        ) : (
          <div className="space-y-2">
            {links.map(link => {
              const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date();
              return (
                <div key={link.id} className="flex items-center justify-between border border-gray-100 dark:border-gray-700 rounded-xl p-4 bg-gray-50/50 dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{link.recipientName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{link.recipientEmail}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs">
                      {link.usedAt ? (
                        <span className="text-emerald-400">✓ Completed</span>
                      ) : isExpired ? (
                        <span className="text-red-400">Expired</span>
                      ) : (
                        <span className="text-amber-400">Pending</span>
                      )}
                      <span className="text-gray-600">
                        Created {new Date(link.createdAt).toLocaleDateString('en-AU')}
                      </span>
                      {link.expiresAt && (
                        <span className="text-gray-600">
                          Expires {new Date(link.expiresAt).toLocaleDateString('en-AU')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyLink(link.token)}
                      className="btn-secondary text-sm"
                    >
                      {copiedId === link.token ? '✓ Copied!' : 'Copy Link'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
