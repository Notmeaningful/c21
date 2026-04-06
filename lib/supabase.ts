import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const isConfigured = supabaseUrl && !supabaseUrl.startsWith('your_') && supabaseAnonKey && !supabaseAnonKey.startsWith('your_');

// Client-side Supabase client (null when not configured)
export const supabase: SupabaseClient | null = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Server-side service role client (for API routes)
export const supabaseAdmin: SupabaseClient | null = isConfigured && supabaseServiceKey && !supabaseServiceKey.startsWith('your_')
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

export type SubmissionData = {
  id?: string;
  branch_name: string;
  property_address: string;
  owner_names: string;
  owner_address: string;
  email: string;
  phone_numbers: string;
  emergency_contact: string;
  rent_payment_frequency: 'mid_and_end' | 'end_only';
  bank_account_name: string;
  bank_name: string;
  bank_bsb: string;
  bank_account_number: string;
  council_redirect: boolean;
  council_rate_copy: string | null;
  water_redirect: boolean;
  water_rate_copy: string | null;
  strata_redirect: boolean;
  strata_rate_copy: string | null;
  strata_company_details: string | null;
  keys_option: 'provide' | 'authorize_cut';
  smoke_alarms_accepted: boolean;
  insurance_request: string | null;
  insurance_policy_details: string | null;
  contract_prepared: boolean;
  proposal_to_sell: boolean;
  mortgagee_proceedings: boolean;
  mortgagee_possession: boolean | null;
  flooding_bushfire: boolean;
  health_safety_risks: boolean;
  violent_crime: boolean;
  council_waste_different: boolean;
  parking_issue: boolean;
  shared_driveway: boolean;
  water_saving_devices: string;
  pool_info: string;
  last_rental_increase: string | null;
  tenancy_exclusion_period: string;
  tenancy_exclusion_expiry: string | null;
  tenancy_exclusion_approved: boolean;
  special_schemes: {
    key_worker: boolean;
    affordable_housing: boolean;
    affordable_limited: boolean;
    affordable_end_date: string | null;
    transitional_housing: boolean;
    transitional_limited: boolean;
    transitional_end_date: string | null;
    student_accommodation: boolean;
  };
  additional_comments: string | null;
  how_heard: string;
  all_owners_disclosed: boolean;
  submission_date?: string;
  status?: 'pending' | 'reviewed' | 'approved' | 'rejected';
  user_ip?: string;
  user_agent?: string;
  created_at?: string;
  updated_at?: string;
};
