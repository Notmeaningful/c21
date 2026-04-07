'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { QuestionnaireTemplate } from '@/lib/types/questionnaire';
import { getTemplates, deleteTemplate, seedOfficeQuestionnaire, seedDemoResponsesOnce, getResponses } from '@/lib/store/questionnaire-store';

export default function QuestionnairesListPage() {
  const [templates, setTemplates] = useState<QuestionnaireTemplate[]>([]);
  const [responseCounts, setResponseCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    seedOfficeQuestionnaire();
    seedDemoResponsesOnce();
    const all = getTemplates();
    setTemplates(all);
    const counts: Record<string, number> = {};
    all.forEach(t => {
      counts[t.id] = getResponses(t.id).length;
    });
    setResponseCounts(counts);
    setLoading(false);
  }, []);

  const handleDelete = (id: string, title: string) => {
    if (confirmDeleteId === id) {
      deleteTemplate(id);
      setTemplates(getTemplates());
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      // Auto-reset after 3 seconds if not confirmed
      setTimeout(() => setConfirmDeleteId((prev) => (prev === id ? null : prev)), 3000);
    }
  };

  const handleDuplicate = (template: QuestionnaireTemplate) => {
    const { saveTemplate } = require('@/lib/store/questionnaire-store');
    saveTemplate({
      ...template,
      id: undefined,
      title: `${template.title} (Copy)`,
      slug: undefined,
      status: 'draft' as const,
    });
    setTemplates(getTemplates());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-c21-gold"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-6 sm:mb-10">
        <div>
          <p className="text-caption text-c21-gold mb-1 sm:mb-2">Management</p>
          <h1 className="text-heading-md">Questionnaires</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage questionnaires for your clients</p>
        </div>
        <Link
          href="/admin/questionnaires/new"
          className="btn-primary flex items-center gap-2 shrink-0 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">New Questionnaire</span>
          <span className="sm:hidden">New</span>
        </Link>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm">
          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No questionnaires yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Create your first questionnaire to get started</p>
          <Link href="/admin/questionnaires/new" className="btn-primary">
            Create Questionnaire
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {templates.map((template, index) => (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-6 hover:border-c21-gold/20 hover:shadow-md transition-all duration-200 group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-c21-gold transition-colors truncate">{template.title}</h3>
                    <span className={`px-2.5 py-1 text-[10px] rounded-lg font-semibold uppercase tracking-wider shrink-0 ${
                      template.status === 'published'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : template.status === 'draft'
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : 'bg-gray-50 text-gray-500 border border-gray-200'
                    }`}>
                      {template.status}
                    </span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-1">{template.description}</p>
                  <div className="flex items-center gap-5 text-xs text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"/></svg>
                      {template.sections.length} sections
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"/></svg>
                      {template.sections.reduce((acc, s) => acc + s.questions.length, 0)} questions
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>
                      {responseCounts[template.id] || 0} responses
                    </span>
                    <span className="text-gray-700 dark:text-gray-400">
                      Updated {new Date(template.updatedAt).toLocaleDateString('en-AU')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 ml-3 sm:ml-6 shrink-0 flex-wrap justify-end">
                  <Link
                    href={`/admin/questionnaires/${template.id}/edit`}
                    className="px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-200 dark:border-gray-600 transition-all duration-200"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/admin/questionnaires/${template.id}/responses`}
                    className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 border border-blue-200 transition-all duration-200"
                  >
                    Responses
                  </Link>
                  <Link
                    href={`/admin/questionnaires/${template.id}/share`}
                    className="px-3 py-1.5 text-xs bg-c21-gold/[0.08] text-c21-gold rounded-lg hover:bg-c21-gold/[0.15] border border-c21-gold/20 transition-all duration-200"
                  >
                    Share
                  </Link>
                  <button
                    onClick={() => handleDuplicate(template)}
                    className="px-3 py-1.5 text-xs bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 border border-gray-200 transition-all duration-200"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={() => handleDelete(template.id, template.title)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-all duration-200 ${
                      confirmDeleteId === template.id
                        ? 'bg-red-500 text-white border-red-500 animate-pulse'
                        : 'bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 border-red-200'
                    }`}
                  >
                    {confirmDeleteId === template.id ? 'Confirm Delete?' : 'Delete'}
                  </button>
                  {confirmDeleteId === template.id && (
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-3 py-1.5 text-xs bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100 border border-gray-200 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
