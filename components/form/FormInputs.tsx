'use client';

import { InputHTMLAttributes, TextareaHTMLAttributes, ChangeEvent } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export function FormInput({
  label,
  error,
  helperText,
  className = '',
  ...props
}: FormInputProps) {
  return (
    <div className="mb-6 animate-slideUp">
      <label className="block text-sm font-semibold text-c21-black mb-2">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        {...props}
        className={`form-input ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''} ${className}`}
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {helperText && <p className="text-gray-500 text-sm mt-2">{helperText}</p>}
    </div>
  );
}

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export function FormTextarea({
  label,
  error,
  helperText,
  className = '',
  rows = 4,
  ...props
}: FormTextareaProps) {
  return (
    <div className="mb-6 animate-slideUp">
      <label className="block text-sm font-semibold text-c21-black mb-2">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        rows={rows}
        {...props}
        className={`form-input resize-none ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''} ${className}`}
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {helperText && <p className="text-gray-500 text-sm mt-2">{helperText}</p>}
    </div>
  );
}

interface FormRadioProps {
  label: string;
  name: string;
  options: { value: any; label: string }[];
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export function FormRadio({ label, name, options, value, onChange, error }: FormRadioProps) {
  return (
    <div className="mb-6 animate-slideUp">
      <label className="block text-sm font-semibold text-c21-black mb-3">{label}</label>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center cursor-pointer hover:bg-c21-light-gray p-2 rounded transition">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(option.value)}
              className="w-4 h-4 text-c21-gold cursor-pointer"
            />
            <span className="ml-3 text-c21-black">{option.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

interface FormCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export function FormCheckbox({ label, checked, onChange, error }: FormCheckboxProps) {
  return (
    <div className="mb-6 animate-slideUp">
      <label className="flex items-center cursor-pointer hover:bg-c21-light-gray p-2 rounded transition">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-5 h-5 text-c21-gold rounded cursor-pointer"
        />
        <span className="ml-3 text-c21-black font-semibold">{label}</span>
      </label>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

interface FormSelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: any; label: string }[];
  error?: string;
  helperText?: string;
}

export function FormSelect({
  label,
  options,
  error,
  helperText,
  className = '',
  ...props
}: FormSelectProps) {
  return (
    <div className="mb-6 animate-slideUp">
      <label className="block text-sm font-semibold text-c21-black mb-2">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        {...props}
        className={`form-input cursor-pointer ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''} ${className}`}
      >
        <option value="">Select an option...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {helperText && <p className="text-gray-500 text-sm mt-2">{helperText}</p>}
    </div>
  );
}
