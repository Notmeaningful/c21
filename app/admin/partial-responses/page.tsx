'use client';

import { useState, useEffect } from 'react';
import { getResponses, getTemplates } from '@/lib/store/questionnaire-store';
import type { QuestionnaireResponse, QuestionnaireTemplate } from '@/lib/types/questionnaire';
import Link from 'next/link';

interface PartialResponse extends QuestionnaireResponse {
  templateTitle: string;
  totalQuestions: number;
  answeredQuestions: number;
  completionPercent: number;
  timeSinceUpdate: string;
}

function getTimeSince(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function PartialResponsesPage() {
  const [partials, setPartials] = useState<PartialResponse[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const responses = getResponses();
    const templates = getTemplates();
    const templateMap = new Map<string, QuestionnaireTemplate>();
    templates.forEach(t => templateMap.set(t.id, t));

    const inProgress = responses
      .filter(r => r.status === 'in-progress')
      .map(r => {
        const tpl = templateMap.get(r.questionnaireId);
        const totalQuestions = tpl
          ? tpl.sections.reduce((sum, s) => sum + s.questions.length, 0)
          : 0;
        const answeredQuestions = Object.keys(r.answers).filter(
          k => r.answers[k] !== '' && r.answers[k] !== null && r.answers[k] !== undefined
        ).length;

        return {
          ...r,
          templateTitle: tpl?.title || 'Unknown',
          totalQuestions,
          answeredQuestions,
          completionPercent: totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0,
          timeSinceUpdate: getTimeSince(r.updatedAt),
        };
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    setPartials(inProgress);
  }, []);

  const templateNames = [...new Set(partials.map(p => p.templateTitle))];
  const filtered = filter === 'all' ? partials : partials.filter(p => p.templateTitle === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Partial Responses</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {partials.length} incomplete submission{partials.length !== 1 ? 's' : ''}
          </p>
        </div>
        {templateNames.length > 1 && (
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="form-input w-auto text-sm"
          >
            <option value="all">All Templates</option>
            {templateNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium">No partial responses</p>
          <p className="text-sm mt-1">All submissions are complete</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(p => (
            <div
              key={p.id}
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{p.respondentName || 'Anonymous'}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {p.respondentEmail || 'No email'} &middot; {p.templateTitle}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 dark:text-gray-500">{p.timeSinceUpdate}</span>
                  <div className="mt-1">
                    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${
                      p.completionPercent < 25
                        ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                        : p.completionPercent < 75
                          ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                      {p.completionPercent}% complete
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      p.completionPercent < 25
                        ? 'bg-red-400'
                        : p.completionPercent < 75
                          ? 'bg-yellow-400'
                          : 'bg-green-400'
                    }`}
                    style={{ width: `${p.completionPercent}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                  {p.answeredQuestions}/{p.totalQuestions} questions
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                <span>Started: {new Date(p.createdAt).toLocaleDateString()}</span>
                <span>&middot;</span>
                <span>Last active: {new Date(p.updatedAt).toLocaleDateString()}</span>
                <Link
                  href={`/admin/questionnaires/${p.questionnaireId}/responses`}
                  className="ml-auto text-c21-gold hover:underline text-xs font-medium"
                >
                  View Responses &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
