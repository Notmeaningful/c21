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
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">All done!</h1>
          <p className="text-gray-500 text-sm mb-6">{template.settings.confirmationMessage}</p>
          <p className="text-xs text-gray-400">Reference: <span className="font-mono">{responseId.slice(0, 12)}</span></p>
          <a href="/portal" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-c21-gold transition-colors mt-8">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            Back to Portal
          </a>
        </div>
      </div>
    );
  }

  const progress = ((currentStep + 1) / template.sections.length) * 100;
  const visibleQuestions = section.questions.filter(q => isQuestionVisible(q));

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-20 bg-[#faf8f5]/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <a href="/portal" className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </a>
          <div className="flex-1">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-c21-gold rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span className="text-xs text-gray-400 shrink-0">{currentStep + 1}/{template.sections.length}</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
        {/* Section heading */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-c21-gold mb-2">
            Step {currentStep + 1} of {template.sections.length}
          </p>
          <h1 className="text-2xl font-serif font-bold text-gray-900">{section.title}</h1>
          {section.description && (
            <p className="text-sm text-gray-500 mt-1.5">{section.description}</p>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-7">
          {visibleQuestions.map((q) => {
            const value = answers[q.id];
            const error = errors[q.id];

            return (
              <div key={q.id}>
                <label className="block text-sm font-medium text-gray-800 mb-1.5">
                  {q.label}
                  {q.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                {q.helpText && (
                  <p className="text-xs text-gray-400 mb-2">{q.helpText}</p>
                )}

                {(q.type === 'text' || q.type === 'email' || q.type === 'phone' || q.type === 'number') && (
                  <input
                    type={q.type === 'phone' ? 'tel' : q.type}
                    value={value || ''}
                    onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    placeholder={q.placeholder || ''}
                    className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none focus:ring-2 transition-all ${
                      error ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-c21-gold focus:ring-c21-gold/10'
                    }`}
                  />
                )}

                {q.type === 'textarea' && (
                  <textarea
                    value={value || ''}
                    onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    placeholder={q.placeholder || ''}
                    rows={4}
                    className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none focus:ring-2 resize-none transition-all ${
                      error ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-c21-gold focus:ring-c21-gold/10'
                    }`}
                  />
                )}

                {q.type === 'date' && (
                  <input
                    type="date"
                    value={value || ''}
                    onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 transition-all ${
                      error ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-c21-gold focus:ring-c21-gold/10'
                    }`}
                  />
                )}

                {q.type === 'select' && (
                  <select
                    value={value || ''}
                    onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:ring-2 transition-all ${
                      error ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-c21-gold focus:ring-c21-gold/10'
                    }`}
                  >
                    <option value="">Select an option</option>
                    {(q.options || []).map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                )}

                {q.type === 'radio' && (
                  <div className="space-y-2">
                    {(q.options || []).map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt.value }))}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-all ${
                          value === opt.value
                            ? 'border-c21-gold bg-c21-gold/5 text-gray-900'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          value === opt.value ? 'border-c21-gold' : 'border-gray-300'
                        }`}>
                          {value === opt.value && <div className="w-2 h-2 rounded-full bg-c21-gold" />}
                        </div>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                {q.type === 'checkbox' && (
                  <button
                    type="button"
                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-all ${
                      value ? 'border-c21-gold bg-c21-gold/5 text-gray-900' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      value ? 'border-c21-gold bg-c21-gold' : 'border-gray-300'
                    }`}>
                      {value && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    I acknowledge and accept
                  </button>
                )}

                {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="text-sm font-medium text-gray-400 hover:text-gray-700 disabled:opacity-0 disabled:pointer-events-none transition-colors"
          >
            ← Back
          </button>

          {currentStep === template.sections.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="btn-primary text-sm px-8 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Submitting...
                </>
              ) : 'Submit'}
            </button>
          ) : (
            <button onClick={handleNext} className="btn-primary text-sm px-8">
              Continue →
            </button>
          )}
        </div>

        <p className="text-center text-xs text-gray-300 mt-6">Progress saved automatically</p>
      </div>
    </div>
  );
}
