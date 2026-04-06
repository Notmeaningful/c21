'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { QuestionnaireTemplate } from '@/lib/types/questionnaire';
import { getTemplateBySlug, seedOfficeQuestionnaire } from '@/lib/store/questionnaire-store';
import PortalForm from '@/components/portal/PortalForm';

export default function PublicQuestionnairePage() {
  const params = useParams();
  const [template, setTemplate] = useState<QuestionnaireTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    seedOfficeQuestionnaire();
    const slug = params.slug as string;
    const t = getTemplateBySlug(slug);
    if (t) {
      setTemplate(t);
    } else {
      setNotFound(true);
    }
    setLoading(false);
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-c21-gold/30 border-t-c21-gold mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading questionnaire...</p>
        </div>
      </div>
    );
  }

  if (notFound || !template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5] px-4">
        <div className="text-center max-w-md bg-white border border-gray-100 rounded-2xl shadow-sm p-12">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-3">Questionnaire Not Found</h1>
          <p className="text-gray-500">This questionnaire may have been removed or the link is incorrect.</p>
        </div>
      </div>
    );
  }

  return <PortalForm template={template} />;
}
