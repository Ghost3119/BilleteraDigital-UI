import type { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/**
 * Generic text input that matches the mockup's light-bordered field style.
 * Accepts all native <input> props plus an optional label and inline error.
 */
export default function InputField({ label, error, className = '', ...props }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm text-gray-600 font-medium">
          {label}
        </label>
      )}
      <input
        className={[
          'w-full px-4 py-3 rounded-lg border text-sm text-gray-800',
          'placeholder:text-gray-400 bg-white outline-none',
          'transition-colors duration-150',
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100'
            : 'border-gray-200 focus:border-[#1A7A4A] focus:ring-2 focus:ring-[#1A7A4A]/10',
          className,
        ].join(' ')}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500 mt-0.5">{error}</p>
      )}
    </div>
  );
}
