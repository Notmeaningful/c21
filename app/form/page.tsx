'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FormProvider, useForm } from '@/lib/contexts/FormContext';
import { MultiStepForm } from '@/components/form/MultiStepForm';
import { SubmissionData } from '@/lib/supabase';
import toast, { Toaster } from 'react-hot-toast';

function FormPageContent() {
  const router = useRouter();
  const { clearForm } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async (data: SubmissionData) => {
    setIsSubmitting(true);
    const toastId = toast.loading('Submitting your questionnaire...');

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      const result = await response.json();
      
      toast.success('Questionnaire submitted successfully!', { id: toastId });
      
      // Clear the form and redirect to success page
      clearForm();
      setTimeout(() => {
        router.push(`/submission/${result.id}`);
      }, 1500);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit questionnaire. Please try again.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  }, [router, clearForm]);

  return (
    <>
      <Toaster position="top-right" />
      <MultiStepForm
        onNext={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onPrev={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
}

export default function FormPage() {
  return (
    <FormProvider>
      <FormPageContent />
    </FormProvider>
  );
}
