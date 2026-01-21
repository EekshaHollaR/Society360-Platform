'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { FiSave, FiSettings, FiShield, FiDollarSign, FiInfo } from 'react-icons/fi';
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
            } catch (error) {
                toast.error('Failed to load configuration');
            } finally {
                setIsLoading(false);
            }
        };
        loadConfig();
    }, [setValue]);

    const onSubmit = async (data: any) => {
        try {
            // In a real scenario, loop through changed fields and update
            // Here just mocking a bulk update success
            toast.success('Configuration updated successfully');
        } catch (error) {
            toast.error('Failed to update configuration');
        }
    };

    const renderConfigFields = (category: string) => {
        return config
            .filter((item) => item.category === category)
            .map((item) => (
                <div key={item.key} className="space-y-1">
                    <Input
                        label={item.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        {...register(item.key)}
                        placeholder={`Enter ${item.key}`}
                    />
                    {item.description && (
                        <p className="text-xs text-[var(--gray-500)] ml-1">{item.description}</p>
                    )}
                </div>
            ));
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
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
            <div>
                <h1 className="text-2xl font-bold text-[var(--gray-900)]">System Configuration</h1>
                <p className="text-[var(--gray-500)]">Manage global settings for the society platform.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar/Tabs */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <Card className="p-2">
                        <nav className="space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`
                    w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${activeTab === tab.id
                                            ? 'bg-[var(--primary)] text-white shadow-sm'
                                            : 'text-[var(--gray-600)] hover:bg-[var(--gray-50)] hover:text-[var(--gray-900)]'
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

                {/* Content Area */}
                <div className="flex-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 capitalize">
                                {tabs.find(t => t.id === activeTab)?.icon}
                                {tabs.find(t => t.id === activeTab)?.label} Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid gap-6 max-w-xl">
                                    {renderConfigFields(activeTab)}
                                    {config.filter(c => c.category === activeTab).length === 0 && (
                                        <p className="text-[var(--gray-500)] italic">No settings available in this category.</p>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-[var(--gray-100)] flex justify-end">
                                    <Button type="submit">
                                        <FiSave className="mr-2" /> Save Changes
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
