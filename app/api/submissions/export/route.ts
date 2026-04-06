import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, SubmissionData } from '@/lib/supabase';
import { submissionToCSV } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check for admin

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');

    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured');
    }

    let query = supabaseAdmin
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'No submissions found' },
        { status: 404 }
      );
    }

    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'csv') {
      content = submissionToCSV(data as SubmissionData[]);
      filename = `submissions_${new Date().toISOString().split('T')[0]}.csv`;
      mimeType = 'text/csv;charset=utf-8;';
    } else if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      filename = `submissions_${new Date().toISOString().split('T')[0]}.json`;
      mimeType = 'application/json';
    } else {
      return NextResponse.json(
        { error: 'Invalid format' },
        { status: 400 }
      );
    }

    return new NextResponse(content, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export submissions' },
      { status: 500 }
    );
  }
}
