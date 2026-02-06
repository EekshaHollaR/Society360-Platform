import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`
        bg-white rounded-xl border border-[var(--gray-200)] p-6
        shadow-[var(--shadow-sm)]
        ${hover ? 'hover:shadow-[var(--shadow-md)] transition-shadow duration-200' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    );
};

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
    return <div className={`mb-4 ${className}`}>{children}</div>;
};

interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => {
    return <h3 className={`text-lg font-semibold text-[var(--gray-900)] ${className}`}>{children}</h3>;
};

interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
    return <div className={className}>{children}</div>;
};
