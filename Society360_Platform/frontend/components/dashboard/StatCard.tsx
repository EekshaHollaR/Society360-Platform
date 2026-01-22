import React from 'react';
import { Card } from '@/components/ui/Card';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        label: string;
        isPositive: boolean;
    };
    color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    trend,
    color = 'primary'
}) => {
    const colorMap = {
        primary: 'bg-blue-50 text-blue-600',
        secondary: 'bg-teal-50 text-teal-600',
        accent: 'bg-orange-50 text-orange-600',
        success: 'bg-green-50 text-green-600',
        warning: 'bg-yellow-50 text-yellow-600',
        error: 'bg-red-50 text-red-600',
        info: 'bg-cyan-50 text-cyan-600',
    };

    return (
        <Card className="flex items-start justify-between min-w-[240px] transition-all hover:-translate-y-1 hover:shadow-md">
            <div>
                <p className="text-sm font-medium text-[var(--gray-500)] mb-1">{title}</p>
                <h4 className="text-2xl font-bold text-[var(--gray-900)] mb-2">{value}</h4>

                {trend && (
                    <div className="flex items-center text-xs">
                        <span
                            className={`font-medium mr-1.5 ${trend.isPositive ? 'text-[var(--success)]' : 'text-[var(--error)]'
                                }`}
                        >
                            {trend.isPositive ? '+' : ''}{trend.value}%
                        </span>
                        <span className="text-[var(--gray-400)]">{trend.label}</span>
                    </div>
                )}
            </div>

            <div className={`p-3 rounded-xl ${colorMap[color]}`}>
                {icon}
            </div>
        </Card>
    );
};
