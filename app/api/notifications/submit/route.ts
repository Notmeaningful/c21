import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || '',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

export async function POST(request: NextRequest) {
  try {
    const { responseId, respondentName, respondentEmail, questionnaireTitle, answers } = await request.json();

    if (!respondentEmail && !process.env.ADMIN_EMAIL) {
      return NextResponse.json({ message: 'No email recipients configured' });
    }

    const submittedDate = new Date().toLocaleDateString('en-AU');

    // Send confirmation to respondent
    if (respondentEmail) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'noreply@c21fairfield.com.au',
          to: respondentEmail,
          subject: `Century 21: Your ${questionnaireTitle} has been received`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; padding: 40px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1a1a1a; margin: 0; font-size: 20px;">Century 21 Vasco Group</h1>
                <p style="color: #b5985a; font-size: 13px; margin: 5px 0;">Property Management</p>
              </div>
              <h2 style="color: #1a1a1a; font-size: 18px;">Thank You, ${respondentName || 'Valued Client'}</h2>
              <p style="color: #333; line-height: 1.6;">We have received your <strong>${questionnaireTitle}</strong> submission on ${submittedDate}.</p>
              <div style="background: #f9f9f9; border-left: 4px solid #b5985a; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #666; font-size: 13px;"><strong>Reference:</strong> ${responseId}</p>
                <p style="margin: 5px 0 0; color: #666; font-size: 13px;"><strong>Date:</strong> ${submittedDate}</p>
              </div>
              <p style="color: #333; line-height: 1.6;">Our team will review your submission and be in touch shortly.</p>
              <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;" />
              <p style="color: #999; font-size: 12px;">Century 21 Vasco Group | 02 9727 6677 | rentals@c21fairfield.com.au</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('Failed to send respondent email:', emailErr);
      }
    }

    // Send notification to admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'noreply@c21fairfield.com.au',
          to: adminEmail,
          subject: `New Response: ${questionnaireTitle} — ${respondentName || 'Anonymous'}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff; padding: 40px;">
              <h1 style="color: #1a1a1a; font-size: 18px; margin: 0 0 20px;">New Questionnaire Response</h1>
              <div style="background: #f0d9b5; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <p style="margin: 0; font-weight: bold; color: #1a1a1a;">${questionnaireTitle}</p>
              </div>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 10px; color: #666;"><strong>Respondent:</strong></td>
                  <td style="padding: 10px;">${respondentName || 'Anonymous'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 10px; color: #666;"><strong>Email:</strong></td>
                  <td style="padding: 10px;">${respondentEmail || 'Not provided'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 10px; color: #666;"><strong>Reference:</strong></td>
                  <td style="padding: 10px;">${responseId}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; color: #666;"><strong>Date:</strong></td>
                  <td style="padding: 10px;">${submittedDate}</td>
                </tr>
              </table>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error('Failed to send admin notification:', emailErr);
      }
    }

    return NextResponse.json({ message: 'Notifications sent' });
  } catch (error) {
    console.error('Notification error:', error);
    // Don't fail the submission if email fails
    return NextResponse.json({ message: 'Notification attempt completed' });
  }
}
