'use client';

import { useEffect, useState } from 'react';
import { useForm } from '@/lib/contexts/FormContext';
import { FORM_SECTIONS } from '@/lib/constants';
import { ProgressBar, StepIndicator } from './Progress';
import { FormInput, FormTextarea, FormRadio, FormCheckbox, FormSelect } from './FormInputs';
import { SubmissionData } from '@/lib/supabase';
import { validateForm } from '@/lib/utils';
import Link from 'next/link';

interface FormStepProps {
  onNext: () => void;
  onPrev: () => void;
  onSubmit: (data: SubmissionData) => Promise<void>;
  isSubmitting: boolean;
}

export function MultiStepForm({ onNext, onPrev, onSubmit, isSubmitting }: FormStepProps) {
  const { formData, currentStep, setCurrentStep, updateField, updateMultipleFields, saveToLocalStorage, loadFromLocalStorage } = useForm();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showReview, setShowReview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on mount
    const hasData = loadFromLocalStorage();
    setIsLoading(false);
  }, []);

  // Auto-save on data change
  useEffect(() => {
    if (!isLoading) {
      saveToLocalStorage();
    }
  }, [formData, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-c21-gold mx-auto mb-4"></div>
          <p className="text-c21-gold">Loading form...</p>
        </div>
      </div>
    );
  }

  const section = FORM_SECTIONS[currentStep];

  const validateCurrentStep = (): boolean => {
    const stepErrors: Record<string, string> = {};
    const currentSectionQuestions = section.questions;

    currentSectionQuestions.forEach((question) => {
      if (question.required) {
        const value = (formData as any)[question.id];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          stepErrors[question.id] = `${question.label} is required`;
        }
      }
    });

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < FORM_SECTIONS.length - 1) {
        setCurrentStep(currentStep + 1);
        onNext();
      } else {
        setShowReview(true);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      onPrev();
    }
  };

  const handleSubmit = async () => {
    if (validateCurrentStep() && formData.all_owners_disclosed) {
      try {
        await onSubmit(formData as SubmissionData);
      } catch (error) {
        console.error('Submission failed:', error);
      }
    }
  };

  const getQuestionVisibility = (question: any): boolean => {
    if (!question.condition) return true;
    return question.condition(formData);
  };

  const renderQuestion = (question: any) => {
    if (!getQuestionVisibility(question)) return null;

    const value = (formData as any)[question.id];
    const error = errors[question.id];

    switch (question.type) {
      case 'text':
      case 'email':
      case 'date':
        return (
          <FormInput
            key={question.id}
            label={question.label}
            type={question.type}
            value={value || ''}
            onChange={(e) => updateField(question.id, e.target.value)}
            required={question.required}
            error={error}
            pattern={question.pattern}
          />
        );

      case 'textarea':
        return (
          <FormTextarea
            key={question.id}
            label={question.label}
            value={value || ''}
            onChange={(e) => updateField(question.id, e.target.value)}
            required={question.required}
            error={error}
            rows={5}
          />
        );

      case 'radio':
        return (
          <FormRadio
            key={question.id}
            label={question.label}
            name={question.id}
            options={question.options}
            value={value}
            onChange={(v) => updateField(question.id, v)}
            error={error}
          />
        );

      case 'checkbox':
        return (
          <FormCheckbox
            key={question.id}
            label={question.label}
            checked={value || false}
            onChange={(v) => updateField(question.id, v)}
            error={error}
          />
        );

      case 'select':
        return (
          <FormSelect
            key={question.id}
            label={question.label}
            options={question.options}
            value={value || ''}
            onChange={(e) => updateField(question.id, e.target.value)}
            required={question.required}
            error={error}
          />
        );

      default:
        return null;
    }
  };

  if (showReview) {
    return (
      <div className="min-h-[600px]">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="text-center mb-12">
            <h1 className="text-heading-md mb-3">Review Your Information</h1>
            <p className="text-body-lg text-gray-600">
              Please review your details before submitting. You can go back to make changes if needed.
            </p>
          </div>

          <div className="space-y-8">
            {FORM_SECTIONS.map((sec, idx) => (
              <div key={idx} className="card p-6 overflow-hidden">
                <h3 className="text-heading-sm mb-4 pb-3 border-b border-c21-gold">{sec.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sec.questions.map((q) => {
                    if (!getQuestionVisibility(q)) return null;
                    const value = (formData as any)[q.id];
                    if (!value || (Array.isArray(value) && value.length === 0)) return null;

                    return (
                      <div key={q.id} className="text-sm">
                        <p className="text-c21-dark-gray font-semibold">{q.label}</p>
                        <p className="text-c21-black mt-1 whitespace-pre-wrap">
                          {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={formData.all_owners_disclosed || false}
                onChange={(e) => updateField('all_owners_disclosed', e.target.checked)}
                className="w-5 h-5 mt-1 text-c21-gold rounded cursor-pointer"
              />
              <span className="ml-3 text-sm text-gray-700">
                I confirm that all the information listed in regard to ownership is true and correct and ALL legal owners of the property have been disclosed.
              </span>
            </label>
          </div>

          <div className="mt-8 flex gap-4 justify-between">
            <button
              onClick={() => setShowReview(false)}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              ← Back to Edit
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.all_owners_disclosed}
              className={`btn-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Questionnaire'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[600px]">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Step Indicator */}
        <StepIndicator
          steps={FORM_SECTIONS.map((s) => ({ id: s.id, title: s.title }))}
          currentStep={currentStep}
          onStepClick={(step) => {
            if (validateCurrentStep()) {
              setCurrentStep(step);
            }
          }}
        />

        {/* Progress Bar */}
        <ProgressBar current={currentStep} total={FORM_SECTIONS.length} />

        {/* Section Title */}
        <div className="mb-10 animate-slideUp">
          <h1 className="text-heading-md mb-2">{section.title}</h1>
          <p className="text-body-lg text-gray-600">{section.description}</p>
          <div className="h-1 w-20 bg-c21-gold mt-4 rounded-full"></div>
        </div>

        {/* Questions */}
        <div className="mb-10 space-y-6">
          {section.questions.map((question) => renderQuestion(question))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-between mt-12 pt-8 border-t border-c21-gray animate-slideUp">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0 || isSubmitting}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <div className="flex gap-2 text-sm text-gray-600">
            <button
              onClick={saveToLocalStorage}
              className="px-4 py-2 text-c21-gold hover:opacity-80 transition-opacity"
              disabled={isSubmitting}
            >
              Save Progress
            </button>
          </div>

          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className={`btn-primary disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {currentStep === FORM_SECTIONS.length - 1 ? 'Review →' : 'Next →'}
          </button>
        </div>

        {/* Auto-save indicator */}
        <p className="text-xs text-gray-500 text-center mt-4">
          ✓ Auto-saving your progress
        </p>
      </div>
    </div>
  );
}
