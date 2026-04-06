import { QuestionnaireTemplate, QuestionnaireResponse, CustomerPortalLink } from '@/lib/types/questionnaire';

const TEMPLATES_KEY = 'c21_questionnaire_templates';
const RESPONSES_KEY = 'c21_questionnaire_responses';
const PORTAL_LINKS_KEY = 'c21_portal_links';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ---- Templates ----

export function getTemplates(): QuestionnaireTemplate[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(TEMPLATES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getTemplate(id: string): QuestionnaireTemplate | null {
  return getTemplates().find(t => t.id === id) || null;
}

export function getTemplateBySlug(slug: string): QuestionnaireTemplate | null {
  return getTemplates().find(t => t.slug === slug && t.status === 'published') || null;
}

export function getPublishedTemplates(): QuestionnaireTemplate[] {
  return getTemplates().filter(t => t.status === 'published');
}

export function saveTemplate(template: Omit<QuestionnaireTemplate, 'id' | 'createdAt' | 'updatedAt' | 'slug'> & { id?: string; slug?: string }): QuestionnaireTemplate {
  const templates = getTemplates();
  const now = new Date().toISOString();

  if (template.id) {
    const idx = templates.findIndex(t => t.id === template.id);
    if (idx >= 0) {
      const existing = templates[idx];
      // Track version if published and sections changed
      const versioned = existing.status === 'published' &&
        JSON.stringify(existing.sections) !== JSON.stringify(template.sections);

      const previousVersions = existing.previousVersions || [];
      if (versioned) {
        previousVersions.push({
          version: existing.version || 1,
          sections: existing.sections,
          updatedAt: existing.updatedAt,
        });
      }

      const updated: QuestionnaireTemplate = {
        ...existing,
        ...template,
        version: versioned ? (existing.version || 1) + 1 : (existing.version || 1),
        previousVersions,
        slug: template.slug || generateSlug(template.title),
        updatedAt: now,
      };
      templates[idx] = updated;
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
      return updated;
    }
  }

  const newTemplate: QuestionnaireTemplate = {
    ...template,
    id: generateId(),
    slug: template.slug || generateSlug(template.title),
    version: 1,
    createdAt: now,
    updatedAt: now,
  } as QuestionnaireTemplate;

  templates.push(newTemplate);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  return newTemplate;
}

export function deleteTemplate(id: string): void {
  const templates = getTemplates().filter(t => t.id !== id);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
}

// ---- Responses ----

export function getResponses(questionnaireId?: string): QuestionnaireResponse[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(RESPONSES_KEY);
    const all: QuestionnaireResponse[] = data ? JSON.parse(data) : [];
    if (questionnaireId) return all.filter(r => r.questionnaireId === questionnaireId);
    return all;
  } catch {
    return [];
  }
}

export function getResponse(id: string): QuestionnaireResponse | null {
  return getResponses().find(r => r.id === id) || null;
}

export function getResponseByToken(token: string): QuestionnaireResponse | null {
  return getResponses().find(r => r.accessToken === token) || null;
}

export function saveResponse(response: Partial<QuestionnaireResponse> & { questionnaireId: string; questionnaireTitle: string }): QuestionnaireResponse {
  const responses = getResponses();
  const now = new Date().toISOString();

  if (response.id) {
    const idx = responses.findIndex(r => r.id === response.id);
    if (idx >= 0) {
      const updated: QuestionnaireResponse = {
        ...responses[idx],
        ...response,
        updatedAt: now,
      };
      responses[idx] = updated;
      localStorage.setItem(RESPONSES_KEY, JSON.stringify(responses));
      return updated;
    }
  }

  const newResponse: QuestionnaireResponse = {
    id: generateId(),
    questionnaireId: response.questionnaireId,
    questionnaireTitle: response.questionnaireTitle,
    respondentName: response.respondentName || '',
    respondentEmail: response.respondentEmail || '',
    answers: response.answers || {},
    status: 'in-progress',
    accessToken: generateToken(),
    createdAt: now,
    updatedAt: now,
  };

  responses.push(newResponse);
  localStorage.setItem(RESPONSES_KEY, JSON.stringify(responses));
  return newResponse;
}

export function deleteResponse(id: string): void {
  const responses = getResponses().filter(r => r.id !== id);
  localStorage.setItem(RESPONSES_KEY, JSON.stringify(responses));
}

// ---- Portal Links ----

export function getPortalLinks(questionnaireId?: string): CustomerPortalLink[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(PORTAL_LINKS_KEY);
    const all: CustomerPortalLink[] = data ? JSON.parse(data) : [];
    if (questionnaireId) return all.filter(l => l.questionnaireId === questionnaireId);
    return all;
  } catch {
    return [];
  }
}

export function getPortalLinkByToken(token: string): CustomerPortalLink | null {
  return getPortalLinks().find(l => l.token === token) || null;
}

export function createPortalLink(questionnaireId: string, recipientName: string, recipientEmail: string, expiresInDays?: number): CustomerPortalLink {
  const links = getPortalLinks();
  const now = new Date();
  const link: CustomerPortalLink = {
    id: generateId(),
    questionnaireId,
    token: generateToken(),
    recipientName,
    recipientEmail,
    expiresAt: expiresInDays ? new Date(now.getTime() + expiresInDays * 86400000).toISOString() : undefined,
    createdAt: now.toISOString(),
  };
  links.push(link);
  localStorage.setItem(PORTAL_LINKS_KEY, JSON.stringify(links));
  return link;
}

export function markPortalLinkUsed(token: string, responseId: string): void {
  const links = getPortalLinks();
  const idx = links.findIndex(l => l.token === token);
  if (idx >= 0) {
    links[idx].usedAt = new Date().toISOString();
    links[idx].responseId = responseId;
    localStorage.setItem(PORTAL_LINKS_KEY, JSON.stringify(links));
  }
}

// ---- Seed Office Questionnaire ----

export function seedOfficeQuestionnaire(): QuestionnaireTemplate {
  const existing = getTemplates().find(t => t.slug === 'office-questionnaire');
  if (existing) return existing;

  return saveTemplate({
    title: 'Office Questionnaire',
    description: 'Century 21 Vasco Group Property Management Questionnaire. This form records ownership and property details for new rental management agreements.',
    status: 'published',
    branding: {
      primaryColor: '#b5985a',
      logoUrl: '/c21-logo.svg',
      companyName: 'Century 21 Vasco Group',
    },
    settings: {
      allowSave: true,
      requireSignature: true,
      confirmationMessage: 'Thank you for completing the Office Questionnaire. Century 21 Vasco Group will review your submission and be in touch shortly.',
      notifyEmail: 'rentals@c21fairfield.com.au',
    },
    sections: [
      {
        id: 'property-owner-info',
        title: '1. Property & Owner Information',
        description: 'Basic property and ownership details',
        questions: [
          { id: 'property_address', label: '1. Property Address', type: 'text', required: true, placeholder: 'Enter the full property address' },
          { id: 'owner_names', label: '2. Full name(s) of legal owner(s) on property title', type: 'textarea', required: true, placeholder: 'Enter all legal owner names' },
          { id: 'owner_residential_address', label: '3. Residential address of all owners', type: 'textarea', required: true, placeholder: 'Enter residential addresses' },
          { id: 'email_addresses', label: '4. Email address(es) for correspondence', type: 'email', required: true, placeholder: 'Enter email address(es)' },
          { id: 'contact_numbers', label: '5. Contact numbers of all owners', type: 'textarea', required: true, placeholder: 'Enter contact numbers' },
          { id: 'emergency_contact', label: '6. Emergency contact name and number', type: 'text', required: true, placeholder: 'Name and phone number' },
        ],
      },
      {
        id: 'financial-setup',
        title: '2. Financial Arrangements',
        description: 'Rent payment and banking details',
        questions: [
          {
            id: 'rent_payment_frequency',
            label: '7. How would you like your rent paid?',
            type: 'radio',
            required: true,
            options: [
              { value: 'mid_and_end', label: 'Mid-month and end of month' },
              { value: 'end_only', label: 'End of month only' },
            ],
          },
          { id: 'bank_account_name', label: '8a. Account Name', type: 'text', required: true, helpText: 'Bank details for the funds collected to be paid into' },
          { id: 'bank_name', label: '8b. Bank', type: 'text', required: true },
          { id: 'bank_bsb', label: '8c. BSB', type: 'text', required: true, validation: { pattern: '^[0-9]{3}-?[0-9]{3}$' } },
          { id: 'bank_account_number', label: '8d. Account Number', type: 'text', required: true },
        ],
      },
      {
        id: 'rates-management',
        title: '3. Rates & Utility Management',
        description: 'Council, water, and strata rate redirections',
        questions: [
          {
            id: 'council_rates_redirect',
            label: '9. Would you like our office to re-direct the Council rates to our office and have these paid from your rental income on your behalf?',
            type: 'radio',
            required: true,
            helpText: 'If yes, please forward a copy of a rate notice to our office.',
            options: [
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ],
          },
          {
            id: 'water_rates_redirect',
            label: '10. Would you like our office to re-direct the Water rates to our office and have these paid from your rental income on your behalf?',
            type: 'radio',
            required: true,
            helpText: 'If yes, please forward a copy of a rate notice to our office.',
            options: [
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ],
          },
          {
            id: 'strata_rates_redirect',
            label: '11. Would you like our office to re-direct the Strata rates to our office and have these paid from your rental income on your behalf?',
            type: 'radio',
            required: true,
            helpText: 'If yes, please forward a copy of a rate notice to our office.',
            options: [
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ],
          },
          {
            id: 'strata_company_details',
            label: '12. Strata company details (if property is under Strata Title)',
            type: 'textarea',
            required: false,
            helpText: 'Should you wish for our office to redirect your water, council, or strata rates, please provide our office with a copy of the relevant rate notice. If your property has been recently purchased, there may be a delay in ownership change being reflected with Sydney Water and the local council.',
          },
        ],
      },
      {
        id: 'property-compliance',
        title: '4. Keys, Smoke Alarms & Insurance',
        description: 'Property compliance and insurance setup',
        questions: [
          {
            id: 'keys_arrangement',
            label: '13. Keys — How would you like to handle keys?',
            type: 'radio',
            required: true,
            options: [
              { value: 'provide_keys', label: 'I will provide all keys and an extra set to Century 21 Vasco Group' },
              { value: 'cut_keys', label: 'I authorise Century 21 Vasco Group to cut a copy of the keys and charge $5.50 inc GST per key to my account' },
            ],
          },
          {
            id: 'smoke_alarm_compliance',
            label: '14. Smoke Alarms — First State Smoke Alarms annual subscription ($110 inc GST/year)',
            type: 'checkbox',
            required: true,
            helpText: 'In line with strict legislation around smoke alarm compliance, landlords must ensure inspections before every new lease and renewal, correct number/location, and annual recording. This service is COMPULSORY and includes unlimited call outs throughout the year.',
          },
          {
            id: 'insurance_preference',
            label: '15. Landlord and Building Insurance — Would you like our office to obtain insurance on your behalf?',
            type: 'radio',
            required: true,
            helpText: 'You will be required to complete the application form from the insurer.',
            options: [
              { value: 'quote_landlord', label: 'Yes, please obtain a quote for Landlord Insurance on my behalf' },
              { value: 'quote_both', label: 'Yes, please obtain a quote for Landlord and Building Insurance on my behalf' },
              { value: 'own_insurance', label: 'No, I have my own Insurance policy' },
              { value: 'no_insurance', label: 'No, I do not want to take out Insurance for my property' },
            ],
          },
          {
            id: 'existing_insurance_details',
            label: '16. If you currently have insurance, please provide details (company and policy number)',
            type: 'textarea',
            required: false,
            helpText: 'Please send through a copy of your most recent policy to our office.',
            conditionalOn: { questionId: 'insurance_preference', value: 'own_insurance' },
          },
        ],
      },
      {
        id: 'legal-disclosures',
        title: '5. Legal Disclosures',
        description: 'Required disclosures under the Property Stock & Business Agent Act 2002',
        questions: [
          {
            id: 'contract_of_sale_prepared',
            label: '17. Has the Landlord prepared a contract of sale for the residential property?',
            type: 'radio',
            required: true,
            options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
          },
          {
            id: 'proposal_to_sell',
            label: '18. Is there any proposal to sell the residential premises?',
            type: 'radio',
            required: true,
            options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
          },
          {
            id: 'mortgagee_proceedings',
            label: '19. Has a mortgagee commenced proceedings in a court to enforce a mortgage over the premises?',
            type: 'radio',
            required: true,
            options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
          },
          {
            id: 'mortgagee_possession',
            label: '20. If yes, is a mortgagee taking action for possession of the premises?',
            type: 'radio',
            required: false,
            conditionalOn: { questionId: 'mortgagee_proceedings', value: 'yes' },
            options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
          },
          {
            id: 'flooding_bushfire',
            label: '21. Have the premises been subject to flooding or bush fire in the preceding 5 years?',
            type: 'radio',
            required: true,
            options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
          },
          {
            id: 'health_safety_risks',
            label: '22. Are the premises subject to significant health or safety risks that are not apparent to a reasonable person on inspection?',
            type: 'radio',
            required: true,
            options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
          },
          {
            id: 'violent_crime',
            label: '23. Have the premises been the scene of a serious violent crime within the preceding 5 years?',
            type: 'radio',
            required: true,
            options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
          },
          {
            id: 'council_waste_different',
            label: '24. Will the Local Council waste services be provided to the tenant on a different basis than is generally applicable?',
            type: 'radio',
            required: true,
            options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
          },
          {
            id: 'parking_permit_issue',
            label: '25. Due to zoning, will the tenant not be able to obtain a residential parking permit?',
            type: 'radio',
            required: true,
            options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
          },
          {
            id: 'shared_driveway',
            label: '26. Is the driveway or walkways on the premises shared with other persons (separate from strata)?',
            type: 'radio',
            required: true,
            options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
          },
        ],
      },
      {
        id: 'property-features',
        title: '6. Property Features & Compliance',
        description: 'Water saving devices, pool, and rental information',
        questions: [
          {
            id: 'water_saving_devices',
            label: '27. Water Saving Devices — Have you had water saving devices installed on all kitchen and bathroom taps?',
            type: 'radio',
            required: true,
            options: [
              { value: 'compliant', label: 'Yes, our property is compliant. Please find the attached compliance certificate and charge our tenant water usage' },
              { value: 'install_and_charge', label: 'No — we authorise Century 21 Vasco Group to install all necessary devices and charge tenant water usage' },
              { value: 'not_compliant_no_install', label: 'No — we do not wish to install any water saving devices and do not wish to charge tenant water usage' },
            ],
          },
          {
            id: 'swimming_pool',
            label: '28. Is there a swimming pool at the property?',
            type: 'radio',
            required: true,
            options: [
              { value: 'no_pool', label: 'There is no pool at the property' },
              { value: 'pool_compliant', label: 'There is a pool with a valid compliance certificate attached' },
              { value: 'pool_needs_inspection', label: 'There is a pool without compliance — please arrange necessary inspections' },
            ],
          },
          {
            id: 'last_rental_increase',
            label: '29. Last Rental Increase',
            type: 'radio',
            required: true,
            options: [
              { value: 'not_leased', label: 'The premises ARE NOT being leased to a tenant' },
              { value: 'leased', label: 'The premises ARE being leased to a tenant' },
            ],
          },
          {
            id: 'last_rental_increase_date',
            label: 'Date of the last rent increase (if applicable)',
            type: 'date',
            required: false,
            conditionalOn: { questionId: 'last_rental_increase', value: 'leased' },
          },
        ],
      },
      {
        id: 'tenancy-exclusion',
        title: '7. Tenancy Exclusion & Housing Schemes',
        description: 'Tenancy exclusion periods and government housing schemes',
        questions: [
          {
            id: 'tenancy_exclusion_none',
            label: '30a. The premises are NOT subject to a Tenancy Exclusion Period',
            type: 'radio',
            required: true,
            options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
          },
          {
            id: 'tenancy_exclusion_approved',
            label: '30b. The premises ARE subject to a Tenancy Exclusion Period, but approval has been received from the Secretary',
            type: 'radio',
            required: false,
            conditionalOn: { questionId: 'tenancy_exclusion_none', value: 'no' },
            options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
          },
          {
            id: 'tenancy_exclusion_expiry',
            label: '30c. The Tenancy Exclusion Period expires on',
            type: 'date',
            required: false,
            conditionalOn: { questionId: 'tenancy_exclusion_none', value: 'no' },
          },
          {
            id: 'scheme_key_worker',
            label: '31a. Is the property part of a NSW Government key worker housing scheme?',
            type: 'radio',
            required: true,
            options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
          },
          {
            id: 'scheme_affordable_housing',
            label: '31b. Is the property part of an affordable housing scheme?',
            type: 'radio',
            required: true,
            options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
          },
          {
            id: 'scheme_affordable_end_date',
            label: 'If yes, when does the scheme end?',
            type: 'date',
            required: false,
            conditionalOn: { questionId: 'scheme_affordable_housing', value: 'yes' },
          },
          {
            id: 'scheme_transitional_housing',
            label: '31c. Is the property part of a transitional housing program?',
            type: 'radio',
            required: true,
            options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
          },
          {
            id: 'scheme_transitional_end_date',
            label: 'If yes, when does the program end?',
            type: 'date',
            required: false,
            conditionalOn: { questionId: 'scheme_transitional_housing', value: 'yes' },
          },
          {
            id: 'scheme_student_accommodation',
            label: '31d. Is the property purpose-built student accommodation?',
            type: 'radio',
            required: true,
            options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
          },
        ],
      },
      {
        id: 'final-section',
        title: '8. Additional Information & Confirmation',
        description: 'Final comments and ownership confirmation',
        questions: [
          { id: 'additional_comments', label: '32. Any additional requests/comments?', type: 'textarea', required: false },
          { id: 'how_heard', label: '33. How did you hear about Century 21 Vasco Group?', type: 'text', required: false },
          {
            id: 'ownership_confirmation',
            label: '34. I/We confirm that all the information listed in regard to ownership is true and correct and ALL legal owners of the property have been disclosed',
            type: 'checkbox',
            required: true,
          },
          { id: 'signatory_full_names', label: 'Full Name(s)', type: 'text', required: true },
          { id: 'signature_date', label: 'Date', type: 'date', required: true },
        ],
      },
    ],
  });
}
