'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { QuestionnaireTemplate } from '@/lib/types/questionnaire';
import { getPublishedTemplates, seedOfficeQuestionnaire, seedDemoResponsesOnce } from '@/lib/store/questionnaire-store';

export default function PortalHomePage() {
  const [templates, setTemplates] = useState<QuestionnaireTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedOfficeQuestionnaire();
    seedDemoResponsesOnce();
    setTemplates(getPublishedTemplates());
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-c21-gold/30 border-t-c21-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="max-w-xl mx-auto px-4 sm:px-6 pt-12 pb-16">

        {/* Header */}
        <div className="mb-10">
          <a href="/">
            <img src="/c21-logo.svg" alt="Century 21 Vasco Group" className="h-9 mb-6" />
          </a>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Customer Portal</h1>
          <p className="text-sm text-gray-500 mt-1">Select a questionnaire below to get started. Your progress is saved automatically.</p>
        </div>

        {/* Questionnaire list */}
        <div className="space-y-3">
          {templates.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-gray-400">No questionnaires available. Check back later or contact our office.</p>
            </div>
          ) : (
            templates.map(t => (
              <Link
                key={t.id}
                href={`/q/${t.slug}`}
                className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-5 py-4 hover:border-c21-gold/40 hover:shadow-sm transition-all duration-150 group"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-c21-gold transition-colors">{t.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {t.sections.length} sections · {t.sections.reduce((n, s) => n + s.questions.length, 0)} questions
                  </p>
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-c21-gold ml-4 shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))
          )}
        </div>

        {/* Help */}
        <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4 text-sm text-gray-400">
          <span>Need help?</span>
          <a href="tel:0297276677" className="hover:text-c21-gold transition-colors">02 9727 6677</a>
          <a href="mailto:rentals@c21fairfield.com.au" className="hover:text-c21-gold transition-colors">rentals@c21fairfield.com.au</a>
        </div>

      </div>
    </div>
  );
}
