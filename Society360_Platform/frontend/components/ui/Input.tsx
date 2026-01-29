import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-[var(--gray-700)] mb-1.5">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--gray-400)]">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={`
              w-full rounded-lg border transition-all duration-200
              ${icon ? 'pl-10' : 'pl-4'} pr-4 py-2.5
              ${error
                                ? 'border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]'
                                : 'border-[var(--gray-300)] focus:border-[var(--primary)] focus:ring-[var(--primary)]'
                            }
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              disabled:bg-[var(--gray-100)] disabled:cursor-not-allowed
              placeholder:text-[var(--gray-400)]
              ${className}
            `}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${props.id || props.name}-error` : undefined}
                        {...props}
                    />
                </div>
                {error && (
                    <p id={`${props?.name || props?.id}-error`} className="mt-1.5 text-sm text-[var(--error)]" role="alert">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
