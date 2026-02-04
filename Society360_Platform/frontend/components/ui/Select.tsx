import React, { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">

        {label && (
          <label className="block text-sm font-medium text-slate-300">
            {label}
          </label>
        )}

        <div className="relative">

          <select
            ref={ref}
            className={`
              w-full appearance-none rounded-xl
              px-4 py-2.5 text-sm
              bg-[#0f172a] text-white
              border border-white/10

              placeholder:text-slate-500

              focus:outline-none
              focus:border-indigo-500
              focus:ring-2 focus:ring-indigo-500/30

              disabled:bg-white/5 disabled:text-slate-500 disabled:cursor-not-allowed

              transition-all

              ${error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
                : ''
              }

              ${className}
            `}
            aria-invalid={!!error}
            aria-describedby={error ? `${props?.name || props?.id}-error` : undefined}
            {...props}
          >
            <option value="" disabled className="bg-[#0f172a] text-slate-500">
              Select an option
            </option>

            {options.map(option => (
              <option
                key={option.value}
                value={option.value}
                className="bg-[#0f172a] text-white"
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Chevron */}
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {error && (
          <p
            id={`${props?.name || props?.id}-error`}
            className="text-sm text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}

      </div>
    );
  }
);

Select.displayName = 'Select';
