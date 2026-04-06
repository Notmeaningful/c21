import nodemailer from 'nodemailer';
import { SubmissionData } from './supabase';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendSubmissionEmail = async (
  to: string,
  submissionData: SubmissionData,
  submissionId: string
): Promise<void> => {
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a1a1a; margin: 0;">Century 21</h1>
            <p style="color: #b5985a; font-size: 14px; margin: 5px 0;">Real Estate Solutions</p>
          </div>
          
          <h2 style="color: #1a1a1a; font-size: 20px; margin-bottom: 20px;">
            Thank You for Your Submission
          </h2>
          
          <p style="color: #333; font-size: 14px; line-height: 1.6;">
            Dear ${submissionData.owner_names},
          </p>
          
          <p style="color: #333; font-size: 14px; line-height: 1.6;">
            We have successfully received your property information questionnaire. 
            Our team will review your submission and contact you shortly with next steps.
          </p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-left: 4px solid #b5985a; margin: 20px 0;">
            <p style="color: #666; font-size: 13px; margin: 0;">
              <strong>Submission ID:</strong> ${submissionId}
            </p>
            <p style="color: #666; font-size: 13px; margin: 5px 0;">
              <strong>Property:</strong> ${submissionData.property_address}
            </p>
            <p style="color: #666; font-size: 13px; margin: 5px 0;">
              <strong>Date Submitted:</strong> ${new Date().toLocaleDateString('en-AU')}
            </p>
          </div>
          
          <h3 style="color: #1a1a1a; font-size: 14px; margin-top: 25px; margin-bottom: 10px;">
            Your Submission Details:
          </h3>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 10px; color: #666;"><strong>Property Address:</strong></td>
              <td style="padding: 10px; color: #333;">${submissionData.property_address}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 10px; color: #666;"><strong>Owner(s):</strong></td>
              <td style="padding: 10px; color: #333;">${submissionData.owner_names}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 10px; color: #666;"><strong>Contact Email:</strong></td>
              <td style="padding: 10px; color: #333;">${submissionData.email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; color: #666;"><strong>Contact Phone:</strong></td>
              <td style="padding: 10px; color: #333;">${submissionData.phone_numbers.split('\n')[0]}</td>
            </tr>
          </table>
          
          <p style="color: #333; font-size: 14px; line-height: 1.6; margin-top: 20px;">
            If you need to make any changes or have questions, please contact us:
          </p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="color: #666; font-size: 13px; margin: 0;">
              <strong>Century 21 Vasco Group</strong><br>
              Phone: 02 9727 6677<br>
              Email: rentals@c21fairfield.com.au<br>
              Address: 1/95-97 Ware Street, Fairfield NSW 2165
            </p>
          </div>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 20px;">
            This is an automated message. Please do not reply to this email. 
            If you have any questions, please contact us using the information above.
          </p>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `Century 21: Your Questionnaire Received - Ref: ${submissionId}`,
    html: htmlContent,
  });
};

export const sendAdminNotificationEmail = async (
  submissionData: SubmissionData,
  submissionId: string
): Promise<void> => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@century21.com';

  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a1a1a; margin: 0;">New Property Questionnaire Submission</h1>
          </div>
          
          <div style="background-color: #f0d9b5; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="color: #1a1a1a; font-weight: bold; margin: 0;">
              Submission ID: ${submissionId}
            </p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 10px; color: #666; width: 30%;"><strong>Property:</strong></td>
              <td style="padding: 10px; color: #333;">${submissionData.property_address}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 10px; color: #666;"><strong>Owner:</strong></td>
              <td style="padding: 10px; color: #333;">${submissionData.owner_names}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 10px; color: #666;"><strong>Email:</strong></td>
              <td style="padding: 10px; color: #333;">${submissionData.email}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 10px; color: #666;"><strong>Phone:</strong></td>
              <td style="padding: 10px; color: #333;">${submissionData.phone_numbers.split('\n')[0]}</td>
            </tr>
            <tr>
              <td style="padding: 10px; color: #666;"><strong>Status:</strong></td>
              <td style="padding: 10px; color: #333;">Pending Review</td>
            </tr>
          </table>
          
          <div style="margin-top: 20px; text-align: center;">
            <a href="${process.env.NEXTAUTH_URL}/admin/submissions/${submissionId}" 
               style="display: inline-block; background-color: #b5985a; color: #1a1a1a; padding: 10px 20px; text-decoration: none; border-radius: 3px; font-weight: bold;">
              View in Dashboard
            </a>
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: adminEmail,
    subject: `New Submission: ${submissionData.property_address} - ${submissionId}`,
    html: htmlContent,
  });
};
