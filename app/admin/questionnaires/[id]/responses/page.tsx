'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { QuestionnaireTemplate, QuestionnaireResponse } from '@/lib/types/questionnaire';
import { getTemplate, getResponses, deleteResponse } from '@/lib/store/questionnaire-store';

export default function ResponsesPage() {
  const params = useParams();
  const [template, setTemplate] = useState<QuestionnaireTemplate | null>(null);
  const [responses, setResponses] = useState<QuestionnaireResponse[]>([]);
  const [selectedResponse, setSelectedResponse] = useState<QuestionnaireResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    const t = getTemplate(id);
    setTemplate(t);
    if (t) setResponses(getResponses(t.id));
    setLoading(false);
  }, [params.id]);

  const handleDelete = (id: string) => {
    if (confirm('Delete this response?')) {
      deleteResponse(id);
      setResponses(prev => prev.filter(r => r.id !== id));
      if (selectedResponse?.id === id) setSelectedResponse(null);
      selectedIds.delete(id);
      setSelectedIds(new Set(selectedIds));
    }
  };

  const handleBulkDelete = () => {
    if (confirmBulkDelete) {
      selectedIds.forEach(id => deleteResponse(id));
      setResponses(prev => prev.filter(r => !selectedIds.has(r.id)));
      if (selectedResponse && selectedIds.has(selectedResponse.id)) setSelectedResponse(null);
      setSelectedIds(new Set());
      setConfirmBulkDelete(false);
    } else {
      setConfirmBulkDelete(true);
      setTimeout(() => setConfirmBulkDelete(false), 3000);
    }
  };

  const handleBulkExport = () => {
    if (!template || selectedIds.size === 0) return;
    const selected = responses.filter(r => selectedIds.has(r.id));
    const allQuestions = template.sections.flatMap(s => s.questions);
    const headers = ['ID', 'Respondent', 'Email', 'Status', 'Submitted', ...allQuestions.map(q => q.label)];
    const rows = selected.map(r => [
      r.id, r.respondentName, r.respondentEmail, r.status, r.submittedAt || '',
      ...allQuestions.map(q => String(r.answers[q.id] ?? '')),
    ]);
    const csv = [
      headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.slug}-selected-responses.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
    setConfirmBulkDelete(false);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === responses.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(responses.map(r => r.id)));
    }
    setConfirmBulkDelete(false);
  };

  const downloadPDF = (response: QuestionnaireResponse) => {
    if (!template) return;
    const win = window.open('', '_blank');
    if (!win) return;

    const sections = template.sections.map(section => {
      const qas = section.questions
        .map(q => {
          const answer = response.answers[q.id];
          if (answer === undefined || answer === null || answer === '') return null;
          let display = String(answer);
          if (typeof answer === 'boolean') display = answer ? 'Yes' : 'No';
          if (q.options) {
            const opt = q.options.find(o => o.value === answer);
            if (opt) display = opt.label;
          }
          return `<tr><td style="padding:8px 12px;color:#666;width:40%;border-bottom:1px solid #f0f0f0;font-size:13px;">${q.label}</td><td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:13px;">${display}</td></tr>`;
        })
        .filter(Boolean)
        .join('');

      if (!qas) return '';
      return `<div style="margin-bottom:24px;"><h3 style="color:#b5985a;font-size:14px;border-bottom:2px solid #b5985a;padding-bottom:6px;margin-bottom:12px;">${section.title}</h3><table style="width:100%;border-collapse:collapse;">${qas}</table></div>`;
    }).join('');

    win.document.write(`<!DOCTYPE html><html><head><title>${template.title} — ${response.respondentName || 'Response'}</title><style>body{font-family:Arial,sans-serif;max-width:800px;margin:0 auto;padding:40px;color:#1a1a1a;}@media print{body{padding:20px;}}</style></head><body>
      <div style="text-align:center;margin-bottom:30px;"><h1 style="font-size:22px;margin:0;">Century 21 Vasco Group</h1><p style="color:#b5985a;margin:5px 0;font-size:13px;">Property Management</p></div>
      <h2 style="font-size:18px;margin-bottom:5px;">${template.title}</h2>
      <div style="display:flex;gap:20px;margin-bottom:20px;font-size:13px;color:#666;"><span><strong>Respondent:</strong> ${response.respondentName || 'Anonymous'}</span><span><strong>Email:</strong> ${response.respondentEmail || 'N/A'}</span><span><strong>Date:</strong> ${response.submittedAt ? new Date(response.submittedAt).toLocaleDateString('en-AU') : 'In Progress'}</span><span><strong>Ref:</strong> ${response.id}</span></div>
      ${sections}
      <div style="margin-top:40px;text-align:center;color:#999;font-size:11px;border-top:1px solid #eee;padding-top:15px;">Generated on ${new Date().toLocaleDateString('en-AU')} | Century 21 Vasco Group | 02 9727 6677</div>
    </body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 300);
  };

  const exportCSV = () => {
    if (!template || responses.length === 0) return;

    const allQuestions = template.sections.flatMap(s => s.questions);
    const headers = ['ID', 'Respondent', 'Email', 'Status', 'Submitted', ...allQuestions.map(q => q.label)];
    const rows = responses.map(r => [
      r.id,
      r.respondentName,
      r.respondentEmail,
      r.status,
      r.submittedAt || '',
      ...allQuestions.map(q => String(r.answers[q.id] ?? '')),
    ]);

    const csv = [
      headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.slug}-responses.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-caption text-c21-gold mb-1">Responses</p>
          <h1 className="text-heading-md">{template.title}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{responses.length} response(s)</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            disabled={responses.length === 0}
            className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl hover:bg-emerald-100 disabled:opacity-30 transition-all"
          >
            Export All CSV
          </button>
          <Link
            href="/admin/questionnaires"
            className="px-4 py-2 text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            Back
          </Link>
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm">
          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V18z"/></svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No responses yet</h3>
          <p className="text-gray-500 dark:text-gray-400">Share this questionnaire to start collecting responses</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Response List */}
          <div className="lg:col-span-1 space-y-2">
            {/* Bulk actions bar */}
            {responses.length > 0 && (
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === responses.length && responses.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-c21-gold focus:ring-c21-gold/20"
                  />
                  Select All
                </label>
                {selectedIds.size > 0 && (
                  <div className="flex items-center gap-1.5 ml-auto">
                    <span className="text-xs text-gray-500">{selectedIds.size} selected</span>
                    <button
                      onClick={handleBulkExport}
                      className="px-2 py-1 text-[11px] bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-100"
                    >
                      Export
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className={`px-2 py-1 text-[11px] rounded-lg border transition-all ${
                        confirmBulkDelete
                          ? 'bg-red-500 text-white border-red-500 animate-pulse'
                          : 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100'
                      }`}
                    >
                      {confirmBulkDelete ? 'Confirm?' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            )}
            {responses.map(r => (
              <div key={r.id} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={selectedIds.has(r.id)}
                  onChange={() => toggleSelect(r.id)}
                  className="mt-4 rounded border-gray-300 text-c21-gold focus:ring-c21-gold/20 flex-shrink-0"
                />
                <button
                  onClick={() => setSelectedResponse(r)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                  selectedResponse?.id === r.id
                    ? 'border-c21-gold/30 bg-c21-gold/[0.05]'
                    : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{r.respondentName || 'Anonymous'}</p>
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                    r.status === 'submitted' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' :
                    r.status === 'reviewed' ? 'text-blue-600 border-blue-200 bg-blue-50' :
                    'text-amber-600 border-amber-200 bg-amber-50'
                  }`}>
                    {r.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{r.respondentEmail || 'No email'}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {r.submittedAt
                    ? `Submitted ${new Date(r.submittedAt).toLocaleDateString('en-AU')}`
                    : `Started ${new Date(r.createdAt).toLocaleDateString('en-AU')}`
                  }
                </p>
              </button>
              </div>
            ))}
          </div>

          {/* Response Detail */}
          <div className="lg:col-span-2">
            {selectedResponse ? (
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{selectedResponse.respondentName || 'Anonymous'}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedResponse.respondentEmail}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadPDF(selectedResponse)}
                      className="px-3 py-1.5 text-sm bg-c21-gold/[0.08] text-c21-gold border border-c21-gold/20 rounded-lg hover:bg-c21-gold/[0.15] transition-colors"
                    >
                      Download PDF
                    </button>
                    <button
                      onClick={() => handleDelete(selectedResponse.id)}
                      className="px-3 py-1.5 text-sm bg-red-50 text-red-500 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {template.sections.map(section => (
                    <div key={section.id}>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 pb-2 border-b border-c21-gold/20">
                        {section.title}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.questions.map(q => {
                          const answer = selectedResponse.answers[q.id];
                          if (answer === undefined || answer === null || answer === '') return null;

                          let displayValue = String(answer);
                          if (typeof answer === 'boolean') displayValue = answer ? 'Yes' : 'No';
                          if (q.options) {
                            const opt = q.options.find(o => o.value === answer);
                            if (opt) displayValue = opt.label;
                          }

                          return (
                            <div key={q.id} className="text-sm">
                              <p className="text-gray-500 dark:text-gray-400 font-medium">{q.label}</p>
                              <p className="text-gray-900 dark:text-gray-100 mt-1 whitespace-pre-wrap">{displayValue}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-xl shadow-sm">
                Select a response to view details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
