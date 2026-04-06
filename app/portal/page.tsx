'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { QuestionnaireTemplate } from '@/lib/types/questionnaire';
import { getPublishedTemplates, seedOfficeQuestionnaire } from '@/lib/store/questionnaire-store';

export default function PortalHomePage() {
  const [templates, setTemplates] = useState<QuestionnaireTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedOfficeQuestionnaire();
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
      {/* Top accent */}
      <div className="h-2 bg-c21-gold" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* Header card */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-c21-gold via-amber-400 to-c21-gold" />
          <div className="p-5 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <a href="/">
                <img src="/c21-logo.svg" alt="Century 21 Vasco Group" className="h-10" />
              </a>
            </div>
            <a href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-c21-gold transition-colors mb-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
              Back to Home
            </a>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mb-1">Customer Portal</h1>
            <p className="text-sm text-gray-500">
              Complete the questionnaires below to get started with Century 21 Vasco Group.
              Your progress is saved automatically.
            </p>
          </div>
        </div>

        {/* Questionnaire list */}
        <div className="mt-3 space-y-3 pb-8">
          {templates.length === 0 ? (
            <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-700 mb-1">No questionnaires available</h3>
              <p className="text-sm text-gray-400">Check back later or contact our office.</p>
            </div>
          ) : (
            templates.map(t => (
              <Link
                key={t.id}
                href={`/q/${t.slug}`}
                className="block bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6 hover:border-c21-gold/30 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-c21-gold transition-colors">
                      {t.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-1">{t.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                      <span>{t.sections.length} sections</span>
                      <span>{t.sections.reduce((n, s) => n + s.questions.length, 0)} questions</span>
                      <span>~15-20 min</span>
                    </div>
                  </div>
                  <div className="ml-4 w-10 h-10 rounded-xl bg-c21-gold/[0.08] flex items-center justify-center group-hover:bg-c21-gold/[0.15] transition-all">
                    <svg className="w-4 h-4 text-c21-gold group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))
          )}

          {/* Contact card */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6 mt-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Need Help?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-c21-gold mb-1">Address</p>
                <p className="text-gray-500">1/95-97 Ware Street, Fairfield NSW 2165</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-c21-gold mb-1">Phone</p>
                <a href="tel:0297276677" className="text-gray-500 hover:text-c21-gold transition-colors">02 9727 6677</a>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-c21-gold mb-1">Email</p>
                <a href="mailto:rentals@c21fairfield.com.au" className="text-gray-500 hover:text-c21-gold transition-colors break-all">rentals@c21fairfield.com.au</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
