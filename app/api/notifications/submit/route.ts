import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.NOTIFY_FROM || 'C21 Vasco Group <noreply@c21fairfield.com.au>';

export async function POST(request: NextRequest) {
  try {
    const { responseId, respondentName, respondentEmail, questionnaireTitle } = await request.json();

    const submittedDate = new Date().toLocaleDateString('en-AU');

    // Confirmation to respondent
    if (respondentEmail) {
      await resend.emails.send({
        from: FROM,
        to: respondentEmail,
        subject: `Century 21: Your ${questionnaireTitle} has been received`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px;">
            <h1 style="color: #1a1a1a; font-size: 20px; margin: 0 0 4px;">Century 21 Vasco Group</h1>
            <p style="color: #b5985a; font-size: 13px; margin: 0 0 30px;">Property Management</p>
            <h2 style="color: #1a1a1a; font-size: 17px;">Thank you, ${respondentName || 'Valued Client'}</h2>
            <p style="color: #555; line-height: 1.6;">We have received your <strong>${questionnaireTitle}</strong> on ${submittedDate}. Our team will be in touch shortly.</p>
            <div style="background: #f9f9f9; border-left: 4px solid #b5985a; padding: 14px; margin: 24px 0; border-radius: 2px;">
              <p style="margin: 0; color: #666; font-size: 13px;"><strong>Reference:</strong> ${responseId}</p>
              <p style="margin: 6px 0 0; color: #666; font-size: 13px;"><strong>Date:</strong> ${submittedDate}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;" />
            <p style="color: #aaa; font-size: 12px;">Century 21 Vasco Group &nbsp;·&nbsp; 02 9727 6677 &nbsp;·&nbsp; rentals@c21fairfield.com.au</p>
          </div>
        `,
      }).catch(e => console.error('Respondent email failed:', e));
    }

    // Notification to admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      await resend.emails.send({
        from: FROM,
        to: adminEmail,
        subject: `New Response: ${questionnaireTitle} — ${respondentName || 'Anonymous'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px;">
            <h1 style="color: #1a1a1a; font-size: 18px; margin: 0 0 20px;">New Questionnaire Response</h1>
            <div style="background: #fdf6e8; border-left: 4px solid #b5985a; padding: 14px; border-radius: 2px; margin-bottom: 24px;">
              <p style="margin: 0; font-weight: bold; color: #1a1a1a;">${questionnaireTitle}</p>
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px; color: #666;">Respondent</td><td style="padding: 10px;">${respondentName || 'Anonymous'}</td></tr>
              <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px; color: #666;">Email</td><td style="padding: 10px;">${respondentEmail || 'Not provided'}</td></tr>
              <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px; color: #666;">Reference</td><td style="padding: 10px; font-family: monospace;">${responseId}</td></tr>
              <tr><td style="padding: 10px; color: #666;">Date</td><td style="padding: 10px;">${submittedDate}</td></tr>
            </table>
          </div>
        `,
      }).catch(e => console.error('Admin email failed:', e));
    }

    return NextResponse.json({ message: 'Notifications sent' });
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json({ message: 'Notification attempt completed' });
  }
}

