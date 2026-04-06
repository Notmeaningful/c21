'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/contexts/AdminAuthContext';
import { SubmissionData } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function SubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAdminAuth();
  const [submission, setSubmission] = useState<SubmissionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingStatus, setEditingStatus] = useState(false);
  const id = params.id as string;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && id) {
      fetchSubmission();
    }
  }, [isAuthenticated, id]);

  const fetchSubmission = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/submissions/${id}`);
      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();
      setSubmission(data);
    } catch (error) {
      toast.error('Failed to load submission');
      router.push('/admin/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!submission) return;

    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update');

      const updated = await response.json();
      setSubmission(updated);
      setEditingStatus(false);
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-c21-gold mx-auto mb-4"></div>
          <p className="text-c21-gold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !submission) {
    return null;
  }

  return (
    <div className="min-h-screen bg-c21-light-gray pt-20">
      <Toaster position="top-right" />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin/dashboard" className="text-c21-gold hover:opacity-80 mb-4 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-heading-md">{submission.property_address}</h1>
            <p className="text-gray-600 mt-2">Submission ID: {submission.id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Submitted on</p>
            <p className="font-semibold">{formatDate(submission.created_at || '')}</p>
          </div>
        </div>

        {/* Status Section */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-heading-sm mb-2">Submission Status</h3>
              <p className="text-gray-600">Current status: <span className="font-semibold capitalize text-c21-gold">{submission.status}</span></p>
            </div>
            {editingStatus ? (
              <div className="flex gap-2">
                <select
                  value={submission.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  className="form-input py-2 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button
                  onClick={() => setEditingStatus(false)}
                  className="btn-ghost text-sm"
                >
                  Close
                </button>
              </div>
            ) : (
              <button onClick={() => setEditingStatus(true)} className="btn-secondary text-sm">
                Change Status
              </button>
            )}
          </div>
        </div>

        {/* Main Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="text-heading-sm mb-4">Owner Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Owner(s)</p>
                <p className="font-semibold">{submission.owner_names}</p>
              </div>
              <div>
                <p className="text-gray-600">Address</p>
                <p className="font-semibold">{submission.owner_address}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <a href={`mailto:${submission.email}`} className="font-semibold text-c21-gold hover:opacity-80">
                  {submission.email}
                </a>
              </div>
              <div>
                <p className="text-gray-600">Phone</p>
                <a href={`tel:${submission.phone_numbers.split('\n')[0]}`} className="font-semibold">
                  {submission.phone_numbers.split('\n')[0]}
                </a>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-heading-sm mb-4">Bank Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Account Name</p>
                <p className="font-semibold">{submission.bank_account_name}</p>
              </div>
              <div>
                <p className="text-gray-600">Bank</p>
                <p className="font-semibold">{submission.bank_name}</p>
              </div>
              <div>
                <p className="text-gray-600">BSB</p>
                <p className="font-mono font-semibold">{submission.bank_bsb}</p>
              </div>
              <div>
                <p className="text-gray-600">Account Number</p>
                <p className="font-mono font-semibold">••••{submission.bank_account_number?.slice(-4)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Sections */}
        <div className="space-y-6">
          {/* Property Details */}
          <div className="card p-6">
            <h3 className="text-heading-sm mb-4">Property & Payment Details</h3>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-gray-600">Rent Payment Frequency</p>
                <p className="font-semibold capitalize">
                  {submission.rent_payment_frequency === 'mid_and_end' ? 'Mid-month & End of Month' : 'End of Month Only'}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Council Rates Redirect</p>
                <p className="font-semibold">{submission.council_redirect ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-gray-600">Water Rates Redirect</p>
                <p className="font-semibold">{submission.water_redirect ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-gray-600">Strata Rates Redirect</p>
                <p className="font-semibold">{submission.strata_redirect ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>

          {/* Compliance */}
          <div className="card p-6">
            <h3 className="text-heading-sm mb-4">Compliance & Disclosures</h3>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-gray-600">Flood/Bushfire in 5 years</p>
                <p className="font-semibold">{submission.flooding_bushfire ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-gray-600">Contract of Sale Prepared</p>
                <p className="font-semibold">{submission.contract_prepared ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-gray-600">Violent Crime in 5 years</p>
                <p className="font-semibold">{submission.violent_crime ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-gray-600">Health/Safety Risks</p>
                <p className="font-semibold">{submission.health_safety_risks ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-gray-600">Swimming Pool</p>
                <p className="font-semibold capitalize">{submission.pool_info}</p>
              </div>
              <div>
                <p className="text-gray-600">Water Saving Devices</p>
                <p className="font-semibold capitalize">{submission.water_saving_devices}</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {submission.additional_comments && (
            <div className="card p-6">
              <h3 className="text-heading-sm mb-4">Additional Comments</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{submission.additional_comments}</p>
            </div>
          )}

          {/* System Information */}
          <div className="card p-6 bg-gray-50">
            <h3 className="text-heading-sm mb-4">System Information</h3>
            <div className="grid grid-cols-2 gap-6 text-xs text-gray-600">
              <div>
                <p className="font-semibold">Submission ID</p>
                <p className="font-mono">{submission.id}</p>
              </div>
              <div>
                <p className="font-semibold">Submitted</p>
                <p>{formatDate(submission.created_at || '')}</p>
              </div>
              <div>
                <p className="font-semibold">Last Updated</p>
                <p>{formatDate(submission.updated_at || submission.created_at || '')}</p>
              </div>
              <div>
                <p className="font-semibold">IP Address</p>
                <p>{submission.user_ip || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Link href="/admin/dashboard" className="btn-secondary">
            ← Back to Dashboard
          </Link>
          <button
            onClick={async () => {
              if (confirm('Are you sure you want to delete this submission?')) {
                try {
                  const response = await fetch(`/api/submissions/${id}`, { method: 'DELETE' });
                  if (!response.ok) throw new Error('Delete failed');
                  toast.success('Submission deleted');
                  router.push('/admin/dashboard');
                } catch (error) {
                  toast.error('Failed to delete submission');
                }
              }
            }}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition"
          >
            Delete Submission
          </button>
        </div>
      </div>
    </div>
  );
}
