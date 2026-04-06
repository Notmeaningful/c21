export const BRANCH_NAME = 'Century 21 Vasco Group';
export const BRANCH_ADDRESS = '1/95-97 Ware Street, Fairfield NSW 2165';
export const BRANCH_PHONE = '02 9727 6677';
export const BRANCH_FAX = '02 9727 3419';
export const BRANCH_EMAIL = 'maan@c21fairfield.com.au';

export const FORM_SECTIONS = [
  {
    id: 'personal-info',
    title: 'Personal & Property Information',
    description: 'Let\'s start with your basic information',
    questions: [
      { id: 'property_address', label: 'Property Address', type: 'text', required: true },
      { id: 'owner_names', label: 'Full Names of Legal Owner(s) on Property Title', type: 'textarea', required: true },
      { id: 'owner_address', label: 'Residential Address of All Owners', type: 'textarea', required: true },
      { id: 'email', label: 'Email Address(es) for Correspondence', type: 'email', required: true },
      { id: 'phone_numbers', label: 'Contact Numbers of All Owners', type: 'textarea', required: true },
      { id: 'emergency_contact', label: 'Emergency Contact Name and Number', type: 'text', required: true },
    ],
  },
  {
    id: 'financial',
    title: 'Financial Arrangements',
    description: 'Set up your payment preferences',
    questions: [
      {
        id: 'rent_payment_frequency',
        label: 'How would you like rent paid?',
        type: 'radio',
        required: true,
        options: [
          { value: 'mid_and_end', label: 'Mid-month and End of Month' },
          { value: 'end_only', label: 'End of Month Only' },
        ],
      },
      {
        id: 'bank_account_name',
        label: 'Bank Account Name',
        type: 'text',
        required: true,
      },
      {
        id: 'bank_name',
        label: 'Bank Name',
        type: 'text',
        required: true,
      },
      {
        id: 'bank_bsb',
        label: 'BSB',
        type: 'text',
        required: true,
        pattern: '^[0-9]{6}$',
      },
      {
        id: 'bank_account_number',
        label: 'Account Number',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    id: 'rates',
    title: 'Council & Utility Rate Management',
    description: 'Choose how to manage your rates and bills',
    questions: [
      {
        id: 'council_redirect',
        label: 'Would you like us to redirect Council rates to our office?',
        type: 'radio',
        required: true,
        options: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ],
      },
      {
        id: 'water_redirect',
        label: 'Would you like us to redirect Water rates to our office?',
        type: 'radio',
        required: true,
        options: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ],
      },
      {
        id: 'strata_redirect',
        label: 'Would you like us to redirect Strata rates to our office?',
        type: 'radio',
        required: true,
        options: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ],
      },
      {
        id: 'strata_company_details',
        label: 'Strata Company Details (if applicable)',
        type: 'textarea',
        required: false,
        condition: (data: any) => data.strata_redirect === true,
      },
    ],
  },
  {
    id: 'property-requirements',
    title: 'Property Requirements & Compliance',
    description: 'Important property compliance matters',
    questions: [
      {
        id: 'keys_option',
        label: 'How would you like to handle spare keys?',
        type: 'radio',
        required: true,
        options: [
          { value: 'provide', label: 'I will provide spare keys' },
          { value: 'authorize_cut', label: 'Authorize key cutting ($5.50 per key)' },
        ],
      },
      {
        id: 'smoke_alarms_accepted',
        label: 'I understand and accept smoke alarm compliance requirements ($110/year)',
        type: 'checkbox',
        required: true,
      },
      {
        id: 'insurance_request',
        label: 'Would you like us to obtain insurance quotes?',
        type: 'radio',
        required: true,
        options: [
          { value: 'landlord', label: 'Landlord Insurance only' },
          { value: 'both', label: 'Landlord and Building Insurance' },
          { value: 'existing', label: 'I have existing insurance' },
          { value: 'none', label: 'No insurance needed' },
        ],
      },
      {
        id: 'insurance_policy_details',
        label: 'Insurance Policy Details (if existing)',
        type: 'textarea',
        required: false,
        condition: (data: any) => data.insurance_request === 'existing',
      },
    ],
  },
  {
    id: 'legal-disclosures',
    title: 'Legal Disclosures',
    description: 'Important legal information about the property',
    questions: [
      {
        id: 'contract_prepared',
        label: 'Has a contract of sale been prepared for this property?',
        type: 'radio',
        required: true,
        options: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ],
      },
      {
        id: 'proposal_to_sell',
        label: 'Is there any proposal to sell this property?',
        type: 'radio',
        required: true,
        options: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ],
      },
      {
        id: 'mortgagee_proceedings',
        label: 'Has a mortgagee commenced court proceedings?',
        type: 'radio',
        required: true,
        options: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ],
      },
      {
        id: 'flooding_bushfire',
        label: 'Has the property been subject to flooding or bushfire in the last 5 years?',
        type: 'radio',
        required: true,
        options: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ],
      },
      {
        id: 'health_safety_risks',
        label: 'Are there significant health or safety risks not apparent on inspection?',
        type: 'radio',
        required: true,
        options: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ],
      },
      {
        id: 'violent_crime',
        label: 'Has there been a serious violent crime in the last 5 years?',
        type: 'radio',
        required: true,
        options: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ],
      },
      {
        id: 'council_waste_different',
        label: 'Will council waste services differ from local area standards?',
        type: 'radio',
        required: true,
        options: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ],
      },
      {
        id: 'parking_issue',
        label: 'Due to zoning, cannot tenant get a residential parking permit?',
        type: 'radio',
        required: true,
        options: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ],
      },
      {
        id: 'shared_driveway',
        label: 'Are there shared driveways or walkways (separate from strata)?',
        type: 'radio',
        required: true,
        options: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ],
      },
    ],
  },
  {
    id: 'features',
    title: 'Property Features & Compliance',
    description: 'Important details about your property',
    questions: [
      {
        id: 'water_saving_devices',
        label: 'Water Saving Devices Status',
        type: 'radio',
        required: true,
        options: [
          { value: 'compliant', label: 'Property is compliant with certificate attached' },
          { value: 'install', label: 'Authorize installation and charge tenant water usage' },
          { value: 'decline', label: 'Decline installation' },
        ],
      },
      {
        id: 'pool_info',
        label: 'Swimming Pool Information',
        type: 'radio',
        required: true,
        options: [
          { value: 'none', label: 'No pool' },
          { value: 'compliant', label: 'Pool with valid compliance certificate' },
          { value: 'arrange', label: 'Pool - arrange necessary inspections' },
        ],
      },
      {
        id: 'last_rental_increase',
        label: 'Date of Last Rental Increase (if applicable)',
        type: 'date',
        required: false,
      },
    ],
  },
  {
    id: 'tenancy-details',
    title: 'Tenancy & Housing Details',
    description: 'Tenancy exclusion periods and special schemes',
    questions: [
      {
        id: 'tenancy_exclusion_period',
        label: 'Is the property subject to a Tenancy Exclusion Period?',
        type: 'radio',
        required: true,
        options: [
          { value: 'none', label: 'No exclusion period' },
          { value: 'active', label: 'Currently subject to exclusion' },
          { value: 'approved', label: 'Approved to lease during exclusion' },
        ],
      },
      {
        id: 'tenancy_exclusion_expiry',
        label: 'Exclusion Period Expiry Date',
        type: 'date',
        required: false,
        condition: (data: any) => data.tenancy_exclusion_period !== 'none',
      },
    ],
  },
  {
    id: 'additional',
    title: 'Final Information',
    description: 'Complete your submission',
    questions: [
      {
        id: 'additional_comments',
        label: 'Additional Requests or Comments',
        type: 'textarea',
        required: false,
      },
      {
        id: 'how_heard',
        label: 'How did you hear about us?',
        type: 'text',
        required: true,
      },
      {
        id: 'all_owners_disclosed',
        label: 'I confirm all legal owners have been disclosed',
        type: 'checkbox',
        required: true,
      },
    ],
  },
];

export const API_ENDPOINTS = {
  SUBMIT_FORM: '/api/submissions',
  GET_SUBMISSIONS: '/api/submissions',
  GET_SUBMISSION: (id: string) => `/api/submissions/${id}`,
  DELETE_SUBMISSION: (id: string) => `/api/submissions/${id}`,
  EXPORT_SUBMISSIONS: '/api/submissions/export',
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
};
