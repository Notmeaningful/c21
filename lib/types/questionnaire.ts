// Questionnaire Builder Types

export interface QuestionOption {
  value: string;
  label: string;
}

export interface QuestionDefinition {
  id: string;
  label: string;
  type: 'text' | 'email' | 'textarea' | 'radio' | 'checkbox' | 'select' | 'date' | 'number' | 'phone' | 'file';
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: QuestionOption[];
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  conditionalOn?: {
    questionId: string;
    value: string | boolean;
  };
}

export interface QuestionnaireSection {
  id: string;
  title: string;
  description: string;
  questions: QuestionDefinition[];
}

export interface QuestionnaireTemplate {
  id: string;
  title: string;
  description: string;
  slug: string;
  sections: QuestionnaireSection[];
  branding: {
    primaryColor?: string;
    logoUrl?: string;
    companyName?: string;
  };
  settings: {
    allowSave: boolean;
    requireSignature: boolean;
    confirmationMessage: string;
    notifyEmail?: string;
  };
  status: 'draft' | 'published' | 'archived';
  version?: number;
  previousVersions?: { version: number; sections: QuestionnaireSection[]; updatedAt: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface QuestionnaireResponse {
  id: string;
  questionnaireId: string;
  questionnaireTitle: string;
  respondentName: string;
  respondentEmail: string;
  answers: Record<string, any>;
  status: 'in-progress' | 'submitted' | 'reviewed';
  accessToken: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerPortalLink {
  id: string;
  questionnaireId: string;
  token: string;
  recipientName: string;
  recipientEmail: string;
  expiresAt?: string;
  usedAt?: string;
  responseId?: string;
  createdAt: string;
}
