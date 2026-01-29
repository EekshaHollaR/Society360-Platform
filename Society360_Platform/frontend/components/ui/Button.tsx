import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    children,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] focus:ring-[var(--primary)] shadow-sm',
        secondary: 'bg-[var(--secondary)] text-white hover:bg-[var(--secondary-light)] focus:ring-[var(--secondary)] shadow-sm',
        outline: 'border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white focus:ring-[var(--primary)]',
        ghost: 'text-[var(--gray-700)] hover:bg-[var(--gray-100)] focus:ring-[var(--gray-400)]',
        danger: 'bg-[var(--error)] text-white hover:bg-red-600 focus:ring-[var(--error)] shadow-sm',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            aria-busy={isLoading}
            aria-live={isLoading ? 'polite' : undefined}
            {...props}
        >
            {isLoading ? (
                <>
                    <span className="sr-only">Loading</span>
                    <div className="inline-flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-0 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm font-medium">Please wait...</span>
                    </div>
                </>
            ) : (
                children
            )}
        </button>
    );
};
