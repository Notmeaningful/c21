'use client';

import React, { createContext, useState, useCallback, ReactNode, Dispatch, SetStateAction } from 'react';
import { SubmissionData } from '@/lib/supabase';

interface FormContextType {
  formData: Partial<SubmissionData>;
  setFormData: Dispatch<SetStateAction<Partial<SubmissionData>>>;
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  updateField: (field: keyof SubmissionData, value: any) => void;
  updateMultipleFields: (fields: Partial<SubmissionData>) => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  clearForm: () => void;
}

export const FormContext = createContext<FormContextType | undefined>(undefined);

const STORAGE_KEY = 'c21_questionnaire_draft';

const defaultFormData: Partial<SubmissionData> = {
  branch_name: 'Century 21 Vasco Group',
  property_address: '',
  owner_names: '',
  owner_address: '',
  email: '',
  phone_numbers: '',
  emergency_contact: '',
  rent_payment_frequency: 'end_only',
  bank_account_name: '',
  bank_name: '',
  bank_bsb: '',
  bank_account_number: '',
  council_redirect: false,
  council_rate_copy: null,
  water_redirect: false,
  water_rate_copy: null,
  strata_redirect: false,
  strata_rate_copy: null,
  strata_company_details: null,
  keys_option: 'provide',
  smoke_alarms_accepted: false,
  insurance_request: null,
  insurance_policy_details: null,
  contract_prepared: false,
  proposal_to_sell: false,
  mortgagee_proceedings: false,
  mortgagee_possession: null,
  flooding_bushfire: false,
  health_safety_risks: false,
  violent_crime: false,
  council_waste_different: false,
  parking_issue: false,
  shared_driveway: false,
  water_saving_devices: 'compliant',
  pool_info: 'none',
  last_rental_increase: null,
  tenancy_exclusion_period: 'none',
  tenancy_exclusion_expiry: null,
  tenancy_exclusion_approved: false,
  special_schemes: {
    key_worker: false,
    affordable_housing: false,
    affordable_limited: false,
    affordable_end_date: null,
    transitional_housing: false,
    transitional_limited: false,
    transitional_end_date: null,
    student_accommodation: false,
  },
  additional_comments: null,
  how_heard: '',
  all_owners_disclosed: false,
};

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<Partial<SubmissionData>>(defaultFormData);
  const [currentStep, setCurrentStep] = useState(0);

  const updateField = useCallback((field: keyof SubmissionData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const updateMultipleFields = useCallback((fields: Partial<SubmissionData>) => {
    setFormData((prev) => ({
      ...prev,
      ...fields,
    }));
  }, []);

  const saveToLocalStorage = useCallback(() => {
    try {
      const data = {
        formData,
        currentStep,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [formData, currentStep]);

  const loadFromLocalStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setFormData(data.formData);
        setCurrentStep(data.currentStep);
        return true;
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
    return false;
  }, []);

  const clearForm = useCallback(() => {
    setFormData(defaultFormData);
    setCurrentStep(0);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }, []);

  return (
    <FormContext.Provider
      value={{
        formData,
        setFormData,
        currentStep,
        setCurrentStep,
        updateField,
        updateMultipleFields,
        saveToLocalStorage,
        loadFromLocalStorage,
        clearForm,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = React.useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
}
