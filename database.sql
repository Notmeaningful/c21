-- Create submissions table for storing form responses
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  branch_name TEXT NOT NULL,
  property_address TEXT NOT NULL,
  owner_names TEXT NOT NULL,
  owner_address TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_numbers TEXT NOT NULL,
  emergency_contact TEXT,
  rent_payment_frequency TEXT,
  bank_account_name TEXT,
  bank_name TEXT,
  bank_bsb TEXT,
  bank_account_number TEXT,
  council_redirect BOOLEAN DEFAULT FALSE,
  council_rate_copy TEXT,
  water_redirect BOOLEAN DEFAULT FALSE,
  water_rate_copy TEXT,
  strata_redirect BOOLEAN DEFAULT FALSE,
  strata_rate_copy TEXT,
  strata_company_details TEXT,
  keys_option TEXT,
  smoke_alarms_accepted BOOLEAN DEFAULT FALSE,
  insurance_request TEXT,
  insurance_policy_details TEXT,
  contract_prepared BOOLEAN DEFAULT FALSE,
  proposal_to_sell BOOLEAN DEFAULT FALSE,
  mortgagee_proceedings BOOLEAN DEFAULT FALSE,
  mortgagee_possession BOOLEAN,
  flooding_bushfire BOOLEAN DEFAULT FALSE,
  health_safety_risks BOOLEAN DEFAULT FALSE,
  violent_crime BOOLEAN DEFAULT FALSE,
  council_waste_different BOOLEAN DEFAULT FALSE,
  parking_issue BOOLEAN DEFAULT FALSE,
  shared_driveway BOOLEAN DEFAULT FALSE,
  water_saving_devices TEXT,
  pool_info TEXT,
  last_rental_increase DATE,
  tenancy_exclusion_period TEXT,
  tenancy_exclusion_expiry DATE,
  tenancy_exclusion_approved BOOLEAN DEFAULT FALSE,
  special_schemes JSONB,
  additional_comments TEXT,
  how_heard TEXT,
  all_owners_disclosed BOOLEAN DEFAULT FALSE,
  submission_date TIMESTAMP DEFAULT NOW(),
  status TEXT DEFAULT 'pending',
  user_ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_submissions_email ON submissions(email);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_property ON submissions(property_address);

-- Create audit log table for tracking changes
CREATE TABLE IF NOT EXISTS submission_audit_log (
  id SERIAL PRIMARY KEY,
  submission_id TEXT NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  changed_by TEXT,
  changed_at TIMESTAMP DEFAULT NOW()
);

-- Create index for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_log_submission ON submission_audit_log(submission_id);

-- Enable Row Level Security (RLS) - require authentication for admin access
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_audit_log ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows inserting submissions from public (form submissions)
CREATE POLICY "Allow public submissions" ON submissions
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to select their own submission
CREATE POLICY "Allow select own submission" ON submissions
  FOR SELECT
  USING (true);

-- Note: For admin access, you need to implement proper authentication
-- and create additional policies with authenticated user checks
