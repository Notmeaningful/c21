'use client';

import { useState, useEffect } from 'react';
import { QuestionnaireTemplate, QuestionnaireResponse } from '@/lib/types/questionnaire';
import { getTemplates, getResponses, seedOfficeQuestionnaire } from '@/lib/store/questionnaire-store';
import Link from 'next/link';

interface Analytics {
  totalTemplates: number;
  totalResponses: number;
  submittedCount: number;
  inProgressCount: number;
  completionRate: number;
  avgCompletionTime: string;
  responsesPerTemplate: { name: string; count: number; submitted: number; inProgress: number }[];
  responsesByDay: { date: string; count: number }[];
  responsesByMonth: { month: string; count: number }[];
}

function computeAnalytics(templates: QuestionnaireTemplate[], allResponses: QuestionnaireResponse[]): Analytics {
  const submittedResponses = allResponses.filter(r => r.status === 'submitted');
  const inProgressResponses = allResponses.filter(r => r.status === 'in-progress');

  // Average completion time (from createdAt to submittedAt)
  const completionTimes = submittedResponses
    .filter(r => r.submittedAt && r.createdAt)
    .map(r => new Date(r.submittedAt!).getTime() - new Date(r.createdAt).getTime());
  const avgMs = completionTimes.length > 0 ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length : 0;

  let avgCompletionTime = 'N/A';
  if (avgMs > 0) {
    const mins = Math.round(avgMs / 60000);
    if (mins < 60) avgCompletionTime = `${mins} min`;
    else avgCompletionTime = `${Math.round(mins / 60)}h ${mins % 60}m`;
  }

  // Per template
  const responsesPerTemplate = templates.map(t => {
    const tResponses = allResponses.filter(r => r.questionnaireId === t.id);
    return {
      name: t.title,
      count: tResponses.length,
      submitted: tResponses.filter(r => r.status === 'submitted').length,
      inProgress: tResponses.filter(r => r.status === 'in-progress').length,
    };
  });

  // Responses by day (last 30 days)
  const now = new Date();
  const days: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days[d.toISOString().slice(0, 10)] = 0;
  }
  allResponses.forEach(r => {
    const day = r.createdAt.slice(0, 10);
    if (days[day] !== undefined) days[day]++;
  });
  const responsesByDay = Object.entries(days).map(([date, count]) => ({ date, count }));

  // Responses by month (last 12 months)
  const months: Record<string, number> = {};
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleDateString('en-AU', { month: 'short', year: '2-digit' });
    months[key] = 0;
  }
  allResponses.forEach(r => {
    const d = new Date(r.createdAt);
    const key = d.toLocaleDateString('en-AU', { month: 'short', year: '2-digit' });
    if (months[key] !== undefined) months[key]++;
  });
  const responsesByMonth = Object.entries(months).map(([month, count]) => ({ month, count }));

  return {
    totalTemplates: templates.length,
    totalResponses: allResponses.length,
    submittedCount: submittedResponses.length,
    inProgressCount: inProgressResponses.length,
    completionRate: allResponses.length > 0 ? Math.round((submittedResponses.length / allResponses.length) * 100) : 0,
    avgCompletionTime,
    responsesPerTemplate,
    responsesByDay,
    responsesByMonth,
  };
}

function BarChart({ data, labelKey, valueKey, maxHeight = 120 }: { data: any[]; labelKey: string; valueKey: string; maxHeight?: number }) {
  const maxVal = Math.max(...data.map(d => d[valueKey]), 1);
  return (
    <div className="flex items-end gap-[2px] h-full" style={{ height: maxHeight }}>
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center flex-1 min-w-0 group relative">
          <div
            className="w-full bg-c21-gold/20 hover:bg-c21-gold/40 rounded-t transition-all duration-300 min-h-[2px]"
            style={{ height: `${Math.max((d[valueKey] / maxVal) * maxHeight, 2)}px` }}
          />
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-700 px-1 rounded shadow-sm border border-gray-100 dark:border-gray-600 whitespace-nowrap z-10">
            {d[valueKey]}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    async function load() {
      seedOfficeQuestionnaire();
      const templates = getTemplates();

      // Fetch real server-side responses, merge with localStorage
      let serverResponses: QuestionnaireResponse[] = [];
      try {
        const res = await fetch('/api/responses');
        if (res.ok) serverResponses = await res.json();
      } catch {}

      const merged = new Map<string, QuestionnaireResponse>();
      getResponses().forEach(r => merged.set(r.id, r));
      serverResponses.forEach(r => merged.set(r.id, r));

      setAnalytics(computeAnalytics(templates, Array.from(merged.values())));
    }
    load();
  }, []);

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-c21-gold/30 border-t-c21-gold"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-heading-md">Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Overview of questionnaire activity</p>
        </div>
        <Link href="/admin/questionnaires" className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-sm transition-colors">
          ← Back
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Questionnaires', value: analytics.totalTemplates, color: 'text-c21-gold' },
          { label: 'Total Responses', value: analytics.totalResponses, color: 'text-gray-900' },
          { label: 'Submitted', value: analytics.submittedCount, color: 'text-emerald-600' },
          { label: 'In Progress', value: analytics.inProgressCount, color: 'text-amber-600' },
          { label: 'Completion Rate', value: `${analytics.completionRate}%`, color: 'text-blue-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Responses over last 30 days */}
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Responses — Last 30 Days</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Daily response count</p>
          <BarChart data={analytics.responsesByDay} labelKey="date" valueKey="count" maxHeight={100} />
          <div className="flex justify-between mt-2 text-[10px] text-gray-400">
            <span>{analytics.responsesByDay[0]?.date.slice(5)}</span>
            <span>{analytics.responsesByDay[analytics.responsesByDay.length - 1]?.date.slice(5)}</span>
          </div>
        </div>

        {/* Monthly trend */}
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Monthly Trend</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Last 12 months</p>
          <BarChart data={analytics.responsesByMonth} labelKey="month" valueKey="count" maxHeight={100} />
          <div className="flex justify-between mt-2 text-[10px] text-gray-400">
            {analytics.responsesByMonth.filter((_, i) => i % 3 === 0).map(d => (
              <span key={d.month}>{d.month}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Per template breakdown */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-6 mb-8">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Responses per Questionnaire</h3>
        <div className="space-y-3">
          {analytics.responsesPerTemplate.map(t => (
            <div key={t.name} className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-gray-100 font-medium truncate">{t.name}</p>
                <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  <span>{t.submitted} submitted</span>
                  <span>{t.inProgress} in progress</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-32 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-c21-gold rounded-full transition-all"
                    style={{ width: `${t.count > 0 ? Math.max((t.submitted / t.count) * 100, 5) : 0}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 w-8 text-right">{t.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extra stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Average Completion Time</h3>
          <p className="text-3xl font-bold text-c21-gold">{analytics.avgCompletionTime}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">From start to submission</p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Completion Rate</h3>
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="currentColor" strokeWidth="3"
                  className="text-gray-200 dark:text-gray-600"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="#b5985a" strokeWidth="3"
                  strokeDasharray={`${analytics.completionRate}, 100`}
                  className="transition-all duration-1000"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900 dark:text-gray-100">
                {analytics.completionRate}%
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-900 dark:text-gray-100">{analytics.submittedCount} of {analytics.totalResponses} completed</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{analytics.inProgressCount} still in progress</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
