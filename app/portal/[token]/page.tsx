'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { QuestionnaireTemplate, CustomerPortalLink, QuestionnaireResponse } from '@/lib/types/questionnaire';
import { getPortalLinkByToken, getTemplate, getResponse, seedOfficeQuestionnaire } from '@/lib/store/questionnaire-store';
import PortalForm from '@/components/portal/PortalForm';

export default function PortalPage() {
  const params = useParams();
  const [template, setTemplate] = useState<QuestionnaireTemplate | null>(null);
  const [link, setLink] = useState<CustomerPortalLink | null>(null);
  const [existingResponse, setExistingResponse] = useState<QuestionnaireResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedOfficeQuestionnaire();
    const token = params.token as string;
    const portalLink = getPortalLinkByToken(token);

    if (!portalLink) {
      setError('This link is invalid or has expired.');
      setLoading(false);
      return;
    }

    if (portalLink.expiresAt && new Date(portalLink.expiresAt) < new Date()) {
      setError('This link has expired. Please contact Century 21 Vasco Group for a new link.');
      setLoading(false);
      return;
    }

    const t = getTemplate(portalLink.questionnaireId);
    if (!t) {
      setError('The questionnaire associated with this link no longer exists.');
      setLoading(false);
      return;
    }

    setLink(portalLink);
    setTemplate(t);

    if (portalLink.responseId) {
      const existing = getResponse(portalLink.responseId);
      setExistingResponse(existing);
    }

    setLoading(false);
  }, [params.token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-c21-gold/30 border-t-c21-gold mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Loading your questionnaire...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5] px-4 sm:px-6">
        <div className="text-center max-w-md bg-white border border-gray-100 rounded-2xl shadow-sm p-10 sm:p-12">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-serif font-bold text-gray-900 mb-4">Access Error</h1>
          <p className="text-gray-500">{error}</p>
          <div className="mt-6 text-sm text-gray-400">
            <p>Century 21 Vasco Group</p>
            <p>02 9727 6677 | rentals@c21fairfield.com.au</p>
          </div>
        </div>
      </div>
    );
  }

  if (!template || !link) return null;

  return (
    <PortalForm
      template={template}
      existingResponse={existingResponse}
      portalToken={link.token}
      respondentName={link.recipientName}
      respondentEmail={link.recipientEmail}
    />
  );
}
