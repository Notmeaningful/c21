'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { QuestionnaireTemplate, QuestionnaireSection, QuestionDefinition, QuestionOption } from '@/lib/types/questionnaire';
import { saveTemplate } from '@/lib/store/questionnaire-store';

interface QuestionEditorProps {
  question: QuestionDefinition;
  onChange: (q: QuestionDefinition) => void;
  onDelete: () => void;
  allQuestionIds: string[];
}

function QuestionEditor({ question, onChange, onDelete, allQuestionIds }: QuestionEditorProps) {
  const hasOptions = ['radio', 'select'].includes(question.type);

  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            value={question.label}
            onChange={e => onChange({ ...question, label: e.target.value })}
            className="form-input text-sm md:col-span-2"
            placeholder="Question label"
          />
          <select
            value={question.type}
            onChange={e => onChange({ ...question, type: e.target.value as any })}
            className="form-input text-sm"
          >
            <option value="text">Short Text</option>
            <option value="textarea">Long Text</option>
            <option value="email">Email</option>
            <option value="number">Number</option>
            <option value="phone">Phone</option>
            <option value="date">Date</option>
            <option value="radio">Radio (Single Choice)</option>
            <option value="select">Dropdown</option>
            <option value="checkbox">Checkbox</option>
          </select>
        </div>
        <button onClick={onDelete} className="ml-3 text-red-400/60 hover:text-red-400 text-lg transition-colors" title="Delete question">
          ✕
        </button>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <input
          type="text"
          value={question.placeholder || ''}
          onChange={e => onChange({ ...question, placeholder: e.target.value })}
          className="form-input text-sm flex-1"
          placeholder="Placeholder text (optional)"
        />
        <input
          type="text"
          value={question.helpText || ''}
          onChange={e => onChange({ ...question, helpText: e.target.value })}
          className="form-input text-sm flex-1"
          placeholder="Help text (optional)"
        />
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-400">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={question.required}
            onChange={e => onChange({ ...question, required: e.target.checked })}
            className="w-4 h-4 text-c21-gold rounded bg-white/5 border-white/10"
          />
          Required
        </label>

        {question.conditionalOn ? (
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Show when</span>
            <select
              value={question.conditionalOn.questionId}
              onChange={e => onChange({
                ...question,
                conditionalOn: { ...question.conditionalOn!, questionId: e.target.value },
              })}
              className="form-input px-2 py-1 text-xs"
            >
              {allQuestionIds.filter(id => id !== question.id).map(id => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
            <span className="text-gray-600">=</span>
            <input
              type="text"
              value={String(question.conditionalOn.value)}
              onChange={e => onChange({
                ...question,
                conditionalOn: { ...question.conditionalOn!, value: e.target.value },
              })}
              className="form-input w-24 px-2 py-1 text-xs"
            />
            <button
              onClick={() => onChange({ ...question, conditionalOn: undefined })}
              className="text-red-400/60 hover:text-red-400 text-xs transition-colors"
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            onClick={() => onChange({
              ...question,
              conditionalOn: { questionId: '', value: '' },
            })}
            className="text-c21-gold/60 hover:text-c21-gold text-xs transition-colors"
          >
            + Add Condition
          </button>
        )}
      </div>

      {hasOptions && (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-gray-600 font-medium">Options:</p>
          {(question.options || []).map((opt, oi) => (
            <div key={oi} className="flex items-center gap-2">
              <input
                type="text"
                value={opt.value}
                onChange={e => {
                  const newOpts = [...(question.options || [])];
                  newOpts[oi] = { ...newOpts[oi], value: e.target.value };
                  onChange({ ...question, options: newOpts });
                }}
                className="form-input w-32 px-2 py-1 text-xs"
                placeholder="Value"
              />
              <input
                type="text"
                value={opt.label}
                onChange={e => {
                  const newOpts = [...(question.options || [])];
                  newOpts[oi] = { ...newOpts[oi], label: e.target.value };
                  onChange({ ...question, options: newOpts });
                }}
                className="form-input flex-1 px-2 py-1 text-xs"
                placeholder="Label"
              />
              <button
                onClick={() => {
                  const newOpts = (question.options || []).filter((_, i) => i !== oi);
                  onChange({ ...question, options: newOpts });
                }}
                className="text-red-400/60 hover:text-red-400 text-xs transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newOpts = [...(question.options || []), { value: '', label: '' }];
              onChange({ ...question, options: newOpts });
            }}
            className="text-sm text-c21-gold/60 hover:text-c21-gold transition-colors"
          >
            + Add Option
          </button>
        </div>
      )}
    </div>
  );
}

interface SectionEditorProps {
  section: QuestionnaireSection;
  onChange: (s: QuestionnaireSection) => void;
  onDelete: () => void;
  allQuestionIds: string[];
}

function SectionEditor({ section, onChange, onDelete, allQuestionIds }: SectionEditorProps) {
  const addQuestion = () => {
    const newQ: QuestionDefinition = {
      id: `q_${Date.now().toString(36)}`,
      label: '',
      type: 'text',
      required: false,
    };
    onChange({ ...section, questions: [...section.questions, newQ] });
  };

  const updateQuestion = (idx: number, q: QuestionDefinition) => {
    const newQuestions = [...section.questions];
    newQuestions[idx] = q;
    onChange({ ...section, questions: newQuestions });
  };

  const deleteQuestion = (idx: number) => {
    onChange({ ...section, questions: section.questions.filter((_, i) => i !== idx) });
  };

  const moveQuestion = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= section.questions.length) return;
    const newQuestions = [...section.questions];
    [newQuestions[idx], newQuestions[newIdx]] = [newQuestions[newIdx], newQuestions[idx]];
    onChange({ ...section, questions: newQuestions });
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={section.title}
            onChange={e => onChange({ ...section, title: e.target.value })}
            className="form-input font-semibold"
            placeholder="Section title"
          />
          <input
            type="text"
            value={section.description}
            onChange={e => onChange({ ...section, description: e.target.value })}
            className="form-input text-sm"
            placeholder="Section description"
          />
        </div>
        <button onClick={onDelete} className="ml-4 text-red-400/50 hover:text-red-400 transition-colors" title="Delete section">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
        </button>
      </div>

      <div className="space-y-3">
        {section.questions.map((q, qi) => (
          <div key={q.id} className="flex gap-2">
            <div className="flex flex-col gap-1 pt-2">
              <button
                onClick={() => moveQuestion(qi, -1)}
                className="text-gray-600 hover:text-gray-400 text-xs disabled:opacity-20 transition-colors"
                disabled={qi === 0}
              >
                ▲
              </button>
              <button
                onClick={() => moveQuestion(qi, 1)}
                className="text-gray-600 hover:text-gray-400 text-xs disabled:opacity-20 transition-colors"
                disabled={qi === section.questions.length - 1}
              >
                ▼
              </button>
            </div>
            <div className="flex-1">
              <QuestionEditor
                question={q}
                onChange={updated => updateQuestion(qi, updated)}
                onDelete={() => deleteQuestion(qi)}
                allQuestionIds={allQuestionIds}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addQuestion}
        className="mt-4 w-full py-2 border border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-c21-gold/30 hover:text-c21-gold transition-all duration-200"
      >
        + Add Question
      </button>
    </div>
  );
}

interface QuestionnaireBuilderProps {
  initialData?: QuestionnaireTemplate;
}

export default function QuestionnaireBuilder({ initialData }: QuestionnaireBuilderProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState<'draft' | 'published'>(initialData?.status === 'published' ? 'published' : 'draft');
  const [sections, setSections] = useState<QuestionnaireSection[]>(initialData?.sections || []);
  const [confirmationMessage, setConfirmationMessage] = useState(
    initialData?.settings.confirmationMessage || 'Thank you for completing the questionnaire.'
  );
  const [notifyEmail, setNotifyEmail] = useState(initialData?.settings.notifyEmail || 'rentals@c21fairfield.com.au');
  const [saving, setSaving] = useState(false);

  const allQuestionIds = sections.flatMap(s => s.questions.map(q => q.id));

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: `section_${Date.now().toString(36)}`,
        title: '',
        description: '',
        questions: [],
      },
    ]);
  };

  const updateSection = (idx: number, s: QuestionnaireSection) => {
    const updated = [...sections];
    updated[idx] = s;
    setSections(updated);
  };

  const deleteSection = (idx: number) => {
    if (confirm('Delete this section and all its questions?')) {
      setSections(sections.filter((_, i) => i !== idx));
    }
  };

  const moveSection = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= sections.length) return;
    const updated = [...sections];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    setSections(updated);
  };

  const handleSave = useCallback(() => {
    if (!title.trim()) {
      alert('Please enter a questionnaire title');
      return;
    }

    setSaving(true);
    try {
      saveTemplate({
        id: initialData?.id,
        title,
        description,
        slug: initialData?.slug,
        status,
        sections,
        branding: {
          primaryColor: '#b5985a',
          logoUrl: '/c21-logo.svg',
          companyName: 'Century 21 Vasco Group',
        },
        settings: {
          allowSave: true,
          requireSignature: true,
          confirmationMessage,
          notifyEmail,
        },
      });
      router.push('/admin/questionnaires');
    } finally {
      setSaving(false);
    }
  }, [title, description, status, sections, confirmationMessage, notifyEmail, initialData, router]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-caption text-c21-gold mb-1">Builder</p>
          <h1 className="text-heading-md">
            {initialData ? 'Edit Questionnaire' : 'New Questionnaire'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/questionnaires')}
            className="px-4 py-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { setStatus('draft'); handleSave(); }}
            className="btn-secondary"
            disabled={saving}
          >
            Save Draft
          </button>
          <button
            onClick={() => { setStatus('published'); handleSave(); }}
            className="btn-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-lg text-gray-900 mb-4">Basic Information</h2>
        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="form-input"
            placeholder="Questionnaire Title"
          />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="form-input"
            placeholder="Description (shown to respondents)"
            rows={2}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="email"
              value={notifyEmail}
              onChange={e => setNotifyEmail(e.target.value)}
              className="form-input"
              placeholder="Notification email"
            />
            <input
              type="text"
              value={confirmationMessage}
              onChange={e => setConfirmationMessage(e.target.value)}
              className="form-input"
              placeholder="Confirmation message"
            />
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section, si) => (
          <div key={section.id} className="relative">
            <div className="absolute -left-8 top-6 flex flex-col gap-1">
              <button
                onClick={() => moveSection(si, -1)}
                disabled={si === 0}
                className="text-gray-600 hover:text-gray-400 disabled:opacity-20 transition-colors"
              >
                ▲
              </button>
              <button
                onClick={() => moveSection(si, 1)}
                disabled={si === sections.length - 1}
                className="text-gray-600 hover:text-gray-400 disabled:opacity-20 transition-colors"
              >
                ▼
              </button>
            </div>
            <SectionEditor
              section={section}
              onChange={s => updateSection(si, s)}
              onDelete={() => deleteSection(si)}
              allQuestionIds={allQuestionIds}
            />
          </div>
        ))}
      </div>

      <button
        onClick={addSection}
        className="mt-6 w-full py-4 border border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-c21-gold/30 hover:text-c21-gold transition-all duration-200 text-lg"
      >
        + Add Section
      </button>

      <div className="mt-8 flex justify-end gap-3">
        <button
          onClick={() => { setStatus('draft'); handleSave(); }}
          className="btn-secondary"
          disabled={saving}
        >
          Save as Draft
        </button>
        <button
          onClick={() => { setStatus('published'); handleSave(); }}
          className="btn-primary"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Publish Questionnaire'}
        </button>
      </div>
    </div>
  );
}
