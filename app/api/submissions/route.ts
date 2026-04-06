import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendSubmissionEmail, sendAdminNotificationEmail } from '@/lib/email';
import { generateSubmissionId, sanitizeInput } from '@/lib/utils';
import { SubmissionData } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Verify reCAPTCHA
async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!process.env.RECAPTCHA_SECRET_KEY) return true;

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const data = await response.json();
    return data.success && data.score > 0.5;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formData, recaptchaToken } = body;

    // Verify reCAPTCHA
    if (recaptchaToken && !(await verifyRecaptcha(recaptchaToken))) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!formData.email || !formData.property_address || !formData.owner_names) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate submission ID
    const submissionId = generateSubmissionId();

    // Get client IP and user agent
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Sanitize inputs
    const sanitizedData: SubmissionData = {
      ...formData,
      id: submissionId,
      property_address: sanitizeInput(formData.property_address),
      owner_names: sanitizeInput(formData.owner_names),
      email: sanitizeInput(formData.email),
      created_at: new Date().toISOString(),
      status: 'pending',
      user_ip: clientIp,
      user_agent: userAgent,
    };

    // Save to Supabase
    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured');
    }

    const { error: dbError } = await supabaseAdmin
      .from('submissions')
      .insert([sanitizedData]);

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save submission');
    }

    // Send emails
    try {
      await Promise.all([
        sendSubmissionEmail(formData.email, sanitizedData, submissionId),
        sendAdminNotificationEmail(sanitizedData, submissionId),
      ]);
    } catch (emailError) {
      console.error('Email error:', emailError);
      // Don't fail the submission if emails fail to send
    }

    return NextResponse.json({ id: submissionId, success: true });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for fetching submissions (with authentication)
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!supabaseAdmin) {
      throw new Error('Supabase admin client not configured');
    }

    const { data, error } = await supabaseAdmin
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);

    return NextResponse.json({ data, total: data?.length || 0 });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
