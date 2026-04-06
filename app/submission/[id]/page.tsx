'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BRANCH_PHONE, BRANCH_EMAIL } from '@/lib/constants';

export default function SubmissionSuccess() {
  const params = useParams();
  const submissionId = params.id as string;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-c21-light-gray">
      <div className="max-w-2xl w-full animate-fadeInUp">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-c21-gold text-white p-12 text-center">
            <div className="text-5xl mb-4">✓</div>
            <h1 className="text-heading-md mb-2">Submission Successful</h1>
            <p className="text-white/80">Your questionnaire has been received</p>
          </div>

          {/* Content */}
          <div className="p-12">
            <p className="text-body-lg text-gray-600 mb-8 text-center">
              Thank you for completing the Century 21 Property Questionnaire. We've sent a confirmation email to your address on file.
            </p>

            {/* Submission Details Card */}
            <div className="card-premium mb-8 bg-blue-50 border-l-blue-500">
              <h3 className="text-heading-sm mb-4">Your Reference Number</h3>
              <p className="text-sm text-gray-600 mb-2">Save this for your records:</p>
              <p className="font-mono text-2xl font-bold text-c21-gold break-all">{submissionId}</p>
            </div>

            {/* Next Steps */}
            <div className="mb-8">
              <h3 className="text-heading-sm mb-4">What Happens Next</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-c21-gold rounded-full flex items-center justify-center text-c21-black font-bold">1</div>
                  <div>
                    <p className="font-semibold text-c21-black">Review</p>
                    <p className="text-sm text-gray-600">Our team will review your submission</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-c21-gold rounded-full flex items-center justify-center text-c21-black font-bold">2</div>
                  <div>
                    <p className="font-semibold text-c21-black">Verification</p>
                    <p className="text-sm text-gray-600">We'll verify the information provided</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-c21-gold rounded-full flex items-center justify-center text-c21-black font-bold">3</div>
                  <div>
                    <p className="font-semibold text-c21-black">Contact</p>
                    <p className="text-sm text-gray-600">We'll be in touch with next steps</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-c21-dark-gray text-white p-6 rounded-lg mb-8">
              <h3 className="text-heading-sm mb-4">Questions?</h3>
              <p className="mb-4 text-sm">Feel free to reach out to our team:</p>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Phone:</strong>{' '}
                  <a href={`tel:${BRANCH_PHONE}`} className="text-c21-gold hover:opacity-80 transition-opacity">
                    {BRANCH_PHONE}
                  </a>
                </p>
                <p>
                  <strong>Email:</strong>{' '}
                  <a href={`mailto:${BRANCH_EMAIL}`} className="text-c21-gold hover:opacity-80 transition-opacity">
                    {BRANCH_EMAIL}
                  </a>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <Link href="/" className="btn-secondary text-center">
                ← Back to Home
              </Link>
              <button
                onClick={() => window.print()}
                className="btn-ghost border border-c21-gold text-center"
              >
                🖨️ Print Reference
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>
            For assistance or updates, visit our{' '}
            <Link href="/" className="text-c21-gold hover:opacity-80 transition-opacity font-semibold">
              main website
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
