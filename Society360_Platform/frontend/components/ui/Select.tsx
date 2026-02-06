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
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-[var(--gray-700)] mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        className={`
              w-full rounded-lg border appearance-none
              pl-4 pr-10 py-2.5 bg-white
              ${error
                                ? 'border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]'
                                : 'border-[var(--gray-300)] focus:border-[var(--primary)] focus:ring-[var(--primary)]'
                            }
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              disabled:bg-[var(--gray-100)] disabled:cursor-not-allowed
              ${className}
            `}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${props?.name || props?.id}-error` : undefined}
                        {...props}
                    >
                        <option value="">Select an option</option>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[var(--gray-400)]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                {error && (
                    <p id={`${props?.name || props?.id}-error`} className="mt-1.5 text-sm text-[var(--error)]" role="alert">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';

Select.displayName = 'Select';
