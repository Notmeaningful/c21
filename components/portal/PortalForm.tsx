'use client';

import { useState, useEffect, useCallback } from 'react';
import { QuestionnaireTemplate, QuestionnaireSection, QuestionDefinition, QuestionnaireResponse } from '@/lib/types/questionnaire';
import { saveResponse, getResponseByToken } from '@/lib/store/questionnaire-store';
import { addAuditLog } from '@/lib/store/audit-store';

interface PortalFormProps {
  template: QuestionnaireTemplate;
  existingResponse?: QuestionnaireResponse | null;
  portalToken?: string;
  respondentName?: string;
  respondentEmail?: string;
}

export default function PortalForm({ template, existingResponse, portalToken, respondentName, respondentEmail }: PortalFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>(existingResponse?.answers || {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(existingResponse?.status === 'submitted');
  const [responseId, setResponseId] = useState(existingResponse?.id || '');
  const [saving, setSaving] = useState(false);
  const STORAGE_KEY = `c21_portal_${template.id}_draft`;

  // Load saved progress
  useEffect(() => {
    if (existingResponse) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setAnswers(data.answers || {});
        setCurrentStep(data.currentStep || 0);
      }
    } catch {}
  }, [STORAGE_KEY, existingResponse]);

  // Auto-save
  useEffect(() => {
    if (submitted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, currentStep }));
    } catch {}
  }, [answers, currentStep, submitted, STORAGE_KEY]);

  const section = template.sections[currentStep];

  const isQuestionVisible = (q: QuestionDefinition): boolean => {
    if (!q.conditionalOn) return true;
    return String(answers[q.conditionalOn.questionId]) === String(q.conditionalOn.value);
  };

  const validateStep = (): boolean => {
    const stepErrors: Record<string, string> = {};
    section.questions.forEach(q => {
      if (!isQuestionVisible(q)) return;
      if (q.required) {
        const val = answers[q.id];
        if (val === undefined || val === null || val === '' || val === false) {
          stepErrors[q.id] = 'This field is required';
        }
      }
    });
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < template.sections.length - 1) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!validateStep()) return;
    setSaving(true);
    try {
      const response = saveResponse({
        id: responseId || undefined,
        questionnaireId: template.id,
        questionnaireTitle: template.title,
        respondentName: answers.signatory_full_names || respondentName || '',
        respondentEmail: answers.email_addresses || respondentEmail || '',
        answers,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
      });
      setResponseId(response.id);
      setSubmitted(true);
      localStorage.removeItem(STORAGE_KEY);

      // Log to audit trail
      addAuditLog(
        response.respondentName || response.respondentEmail || 'Anonymous',
        'create',
        'response',
        response.id,
        `Submitted "${template.title}"`
      );

      if (portalToken) {
        const { markPortalLinkUsed } = await import('@/lib/store/questionnaire-store');
        markPortalLinkUsed(portalToken, response.id);
      }

      // Send email notifications (fire and forget)
      fetch('/api/notifications/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responseId: response.id,
          respondentName: response.respondentName,
          respondentEmail: response.respondentEmail,
          questionnaireTitle: template.title,
        }),
      }).catch(() => {});
    } finally {
      setSaving(false);
    }
  }, [answers, template, responseId, respondentName, respondentEmail, portalToken, STORAGE_KEY]);

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-lg w-full text-center animate-fadeInUp">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 sm:p-12">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-serif font-bold text-gray-900 mb-3">Submission Complete</h1>
            <p className="text-gray-500 mb-8">{template.settings.confirmationMessage}</p>
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500 border border-gray-100">
              <p>Reference: <span className="text-gray-700 font-mono font-medium">{responseId.slice(0, 12)}</span></p>
              <p className="mt-1">Submitted: {new Date().toLocaleDateString('en-AU')}</p>
            </div>
            <a href="/portal" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-c21-gold transition-colors mt-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
              Back to Portal
            </a>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentStep + 1) / template.sections.length) * 100;

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Top accent bar */}
      <div className="h-2 bg-c21-gold" />

      {/* Header card */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {/* Gold accent top */}
          <div className="h-2 bg-gradient-to-r from-c21-gold via-amber-400 to-c21-gold" />
          <div className="p-5 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <a href="/">
                <img src="/c21-logo.svg" alt="Century 21 Vasco Group" className="h-10" />
              </a>
            </div>
            <a href="/portal" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-c21-gold transition-colors mb-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
              Back to Portal
            </a>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mb-1">{template.title}</h1>
            {template.description && (
              <p className="text-sm text-gray-500 mb-4">{template.description}</p>
            )}
            {/* Progress */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-c21-gold rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs font-medium text-gray-400 whitespace-nowrap">
                {currentStep + 1} / {template.sections.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section title card */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 mt-3">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6 border-t-4 border-t-c21-gold">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{section.title}</h2>
          {section.description && <p className="text-sm text-gray-500 mt-1">{section.description}</p>}
          <p className="text-xs text-red-400 mt-3">* Required</p>
        </div>
      </div>

      {/* Questions — each in its own card like Google Forms */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 mt-3 space-y-3 pb-6">
        {section.questions.filter(q => isQuestionVisible(q)).map((q, visibleIdx) => {
          const value = answers[q.id];
          const error = errors[q.id];

          return (
            <div
              key={q.id}
              className={`bg-white border rounded-2xl shadow-sm p-5 sm:p-6 transition-all duration-200 ${
                error ? 'border-red-300 bg-red-50/30' : 'border-gray-100'
              }`}
            >
              <label className="block text-sm sm:text-[15px] font-medium text-gray-800 mb-1">
                {q.label}
                {q.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              {q.helpText && (
                <p className="text-xs text-gray-400 mb-3">{q.helpText}</p>
              )}

              {q.type === 'text' || q.type === 'email' || q.type === 'phone' || q.type === 'number' ? (
                <input
                  type={q.type === 'phone' ? 'tel' : q.type}
                  value={value || ''}
                  onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                  placeholder={q.placeholder || 'Your answer'}
                  className={`w-full border-0 border-b-2 bg-transparent px-0 py-2 text-sm sm:text-base text-gray-900 placeholder-gray-300 focus:outline-none focus:border-c21-gold transition-colors ${
                    error ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
              ) : q.type === 'textarea' ? (
                <textarea
                  value={value || ''}
                  onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                  placeholder={q.placeholder || 'Your answer'}
                  rows={3}
                  className={`w-full border-0 border-b-2 bg-transparent px-0 py-2 text-sm sm:text-base text-gray-900 placeholder-gray-300 focus:outline-none focus:border-c21-gold resize-none transition-colors ${
                    error ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
              ) : q.type === 'date' ? (
                <input
                  type="date"
                  value={value || ''}
                  onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                  className={`w-full border-0 border-b-2 bg-transparent px-0 py-2 text-sm sm:text-base text-gray-900 focus:outline-none focus:border-c21-gold transition-colors ${
                    error ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
              ) : q.type === 'radio' ? (
                <div className="space-y-1 mt-2">
                  {(q.options || []).map(opt => (
                    <label
                      key={opt.value}
                      onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt.value }))}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 -mx-1 ${
                        value === opt.value
                          ? 'bg-c21-gold/[0.08]'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        value === opt.value ? 'border-c21-gold' : 'border-gray-300'
                      }`}>
                        {value === opt.value && <div className="w-[10px] h-[10px] rounded-full bg-c21-gold" />}
                      </div>
                      <span className="text-sm text-gray-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
              ) : q.type === 'select' ? (
                <select
                  value={value || ''}
                  onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                  className={`w-full border-0 border-b-2 bg-transparent px-0 py-2 text-sm sm:text-base text-gray-900 focus:outline-none focus:border-c21-gold transition-colors ${
                    error ? 'border-red-300' : 'border-gray-200'
                  }`}
                >
                  <option value="">Select...</option>
                  {(q.options || []).map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : q.type === 'checkbox' ? (
                <label
                  onClick={() => setAnswers(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 mt-1 -mx-1 ${
                    value ? 'bg-c21-gold/[0.08]' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-[18px] h-[18px] rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    value ? 'border-c21-gold bg-c21-gold' : 'border-gray-300'
                  }`}>
                    {value && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-700">I acknowledge and accept</span>
                </label>
              ) : null}

              {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
            </div>
          );
        })}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-4 pb-8">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-5 py-2.5 text-sm font-semibold text-c21-gold hover:bg-c21-gold/[0.06] rounded-lg disabled:opacity-0 disabled:pointer-events-none transition-all"
          >
            Back
          </button>

          <div className="flex items-center gap-3">
            {currentStep === template.sections.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="btn-primary text-sm flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                    Submitting...
                  </>
                ) : 'Submit'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="btn-primary text-sm"
              >
                Next
              </button>
            )}
          </div>
        </div>

        {/* Auto-save notice */}
        <p className="text-center text-xs text-gray-400 pb-6 flex items-center justify-center gap-1.5">
          <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
          Progress saved automatically
        </p>
      </div>
    </div>
  );
}
