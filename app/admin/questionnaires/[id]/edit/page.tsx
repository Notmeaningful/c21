'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getTemplate } from '@/lib/store/questionnaire-store';
import { QuestionnaireTemplate } from '@/lib/types/questionnaire';
import QuestionnaireBuilder from '@/components/admin/QuestionnaireBuilder';

export default function EditQuestionnairePage() {
  const params = useParams();
  const [template, setTemplate] = useState<QuestionnaireTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    const t = getTemplate(id);
    setTemplate(t);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-c21-gold/30 border-t-c21-gold"></div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-gray-500">Questionnaire not found</h2>
      </div>
    );
  }

  return <QuestionnaireBuilder initialData={template} />;
}
