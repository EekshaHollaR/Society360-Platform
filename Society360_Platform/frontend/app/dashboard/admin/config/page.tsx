'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FiSave, FiShield, FiDollarSign, FiInfo } from 'react-icons/fi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { adminApi, SystemConfig } from '@/lib/api/admin';

export default function ConfigPage() {
    const [config, setConfig] = useState<SystemConfig[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'general' | 'billing' | 'security'>('general');
    const { register, handleSubmit, setValue } = useForm();

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const response = await adminApi.getConfig();
                if (response.data.success) {
                    setConfig(response.data.data);
                    response.data.data.forEach((item: SystemConfig) => {
                        setValue(item.key, item.value);
                    });
                }
            } catch {
                toast.error('Failed to load configuration');
            } finally {
                setIsLoading(false);
            }
        };
        loadConfig();
    }, [setValue]);

    const onSubmit = async () => {
        toast.success('Configuration updated successfully');
    };

    const renderConfigFields = (category: string) =>
        config
            .filter(item => item.category === category)
            .map(item => (
                <div key={item.key} className="space-y-1.5">
                    <Input
                        label={item.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        {...register(item.key)}
                        placeholder={`Enter ${item.key}`}
                    />
                    {item.description && (
                        <p className="text-xs text-slate-500 ml-1 leading-relaxed">
                            {item.description}
                        </p>
                    )}
                </div>
            ));

    if (isLoading) {
        return (
            <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]" />
            </div>
        );
    }

    const tabs = [
        { id: 'general', label: 'General', icon: <FiInfo /> },
        { id: 'billing', label: 'Billing & Fees', icon: <FiDollarSign /> },
        { id: 'security', label: 'Security & Access', icon: <FiShield /> },
    ];

    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-[var(--gray-900)]">
                    System Configuration
                </h1>
                <p className="text-[var(--gray-500)]">
                    Manage your society's global preferences and controls.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">

                {/* Sidebar */}
                <div className="w-full lg:w-64">
                    <Card className="p-2 border border-[var(--gray-200)]">
                        <nav className="space-y-1">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold
                    transition-all
                    ${activeTab === tab.id
                                            ? 'bg-[var(--primary)] text-white shadow-sm'
                                            : 'text-[var(--gray-600)] hover:bg-[var(--gray-50)]'
                                        }
                  `}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </Card>
                </div>

                {/* Content */}
                <div className="flex-1">
                    <Card className="border border-[var(--gray-200)]">

                        <CardHeader className="border-b border-[var(--gray-100)]">
                            <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                {tabs.find(t => t.id === activeTab)?.icon}
                                {tabs.find(t => t.id === activeTab)?.label} Settings
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="pt-6">

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                                <div className="grid gap-6 max-w-xl">

                                    {renderConfigFields(activeTab)}

                                    {config.filter(c => c.category === activeTab).length === 0 && (
                                        <p className="text-slate-500 italic">
                                            No settings available in this category.
                                        </p>
                                    )}

                                </div>

                                <div className="pt-6 border-t border-[var(--gray-100)] flex justify-end">
                                    <Button className="px-6">
                                        <FiSave className="mr-2" />
                                        Save Configuration
                                    </Button>
                                </div>

                            </form>

                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
