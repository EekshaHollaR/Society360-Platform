'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiPlus, FiInfo } from 'react-icons/fi'; // Added FiInfo
import { toast } from 'sonner';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { adminApi, FinanceStats } from '@/lib/api/admin';

// Interface for Unit with suggested rates
interface Unit {
    id: string;
    unit_number: string;
    floor_number: number;
    type: string;
    suggested_maintenance?: number;
    suggested_rent?: number;
}

export default function FinancePage() {
    const [stats, setStats] = useState<FinanceStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [units, setUnits] = useState<Unit[]>([]); // Store full unit objects
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();

    // Watch fields for auto-fill logic
    const selectedUnitId = watch('unit_id');
    const selectedBillType = watch('bill_type');
    const [suggestedAmount, setSuggestedAmount] = useState<number | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [statsRes, unitsRes] = await Promise.all([
                    adminApi.getFinanceStats(),
                    adminApi.getUnits()
                ]);

                if (statsRes.data.success) setStats(statsRes.data.data);
                if (unitsRes.data.success) {
                    setUnits(unitsRes.data.data);
                }
            } catch {
                toast.error('Failed to load financial data');
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    // Auto-fill amount based on unit and bill type
    useEffect(() => {
        if (selectedUnitId && selectedBillType && units.length > 0) {
            const unit = units.find(u => u.id === selectedUnitId);
            if (unit) {
                let amount = 0;
                if (selectedBillType === 'maintenance') {
                    amount = unit.suggested_maintenance || 0;
                } else if (selectedBillType === 'rent') {
                    amount = unit.suggested_rent || 0;
                }

                if (amount > 0) {
                    setValue('amount', amount);
                    setSuggestedAmount(amount);
                } else {
                    setSuggestedAmount(null);
                }
            }
        } else {
            setSuggestedAmount(null);
        }
    }, [selectedUnitId, selectedBillType, units, setValue]);

    const onGenerateBill = async (data: any) => {
        setIsSubmitting(true);
        try {
            await adminApi.generateBills(data);
            toast.success('Bill generated successfully');
            setIsModalOpen(false);
            reset();
            // potentially refresh stats
        } catch (error) {
            toast.error('Failed to generate bill');
        } finally {
            setIsSubmitting(false);
        }
    };

    const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#6366f1'];

    const unitOptions = units.map(u => ({
        value: u.id,
        label: `Unit ${u.unit_number} (${u.type})`
    }));

    if (isLoading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 text-white">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Financial Overview
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Real-time tracking of society revenue and dues.
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <FiPlus className="mr-2" /> Generate Bill
                </Button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <StatCard
                    title="Total Revenue"
                    value={`$${stats?.totalRevenue.toLocaleString() || '0'}`}
                    icon={<FiDollarSign size={24} />}
                    trend={{ value: 12.5, label: 'vs last month', isPositive: true }}
                />

                <StatCard
                    title="Outstanding Dues"
                    value={`$${stats?.outstandingDues.toLocaleString() || '0'}`}
                    icon={<FiTrendingDown size={24} />}
                    trend={{ value: 5.2, label: 'vs last month', isPositive: false }}
                    color="error"
                />

                <StatCard
                    title="Total Expenses"
                    value={`$${stats?.totalExpenses.toLocaleString() || '0'}`}
                    icon={<FiTrendingUp size={24} />}
                    trend={{ value: 2.1, label: 'vs last month', isPositive: true }}
                    color="warning"
                />

            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Revenue Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Trend</CardTitle>
                    </CardHeader>

                    <CardContent className="h-[340px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.monthlyRevenue || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} stroke="#94a3b8" />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    stroke="#94a3b8"
                                    tickFormatter={(v) => `$${v / 1000}k`}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                                    contentStyle={{
                                        background: 'rgba(11,18,32,.85)',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,.08)',
                                        color: '#fff'
                                    }}
                                />
                                <Bar
                                    dataKey="amount"
                                    fill="#6366f1"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Expense Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Expense Distribution</CardTitle>
                    </CardHeader>

                    <CardContent className="h-[340px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Maintenance', value: 45 },
                                        { name: 'Utilities', value: 25 },
                                        { name: 'Staff', value: 20 },
                                        { name: 'Others', value: 10 },
                                    ]}
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {COLORS.map((c, i) => (
                                        <Cell key={i} fill={c} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(11,18,32,.95)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,.1)',
                                        color: '#fff'
                                    }}
                                />
                                <Legend iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

            </div>

            {/* Transactions */}
            <Card>

                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>

                <CardContent>

                    <div className="overflow-x-auto">

                        <table className="w-full text-sm">

                            <thead className="border-b border-white/10 text-slate-400">
                                <tr>
                                    {['Date', 'User', 'Amount', 'Status'].map(h => (
                                        <th key={h} className="px-6 py-4 text-left font-medium">{h}</th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/5 text-slate-300">

                                {(stats?.recentTransactions || []).map(tx => (
                                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">

                                        <td className="px-6 py-4">
                                            {new Date(tx.date).toLocaleDateString()}
                                        </td>

                                        <td className="px-6 py-4 font-medium text-white">
                                            {tx.user}
                                        </td>

                                        <td className="px-6 py-4 font-semibold">
                                            ${tx.amount.toLocaleString()}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`
                        px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${tx.status === 'paid'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}
                      `}>
                                                {tx.status === 'paid' ? 'Completed' : 'Pending'}
                                            </span>
                                        </td>

                                    </tr>
                                ))}

                                {(!stats?.recentTransactions?.length) && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                            No recent transactions found
                                        </td>
                                    </tr>
                                )}

                            </tbody>

                        </table>

                    </div>

                </CardContent>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Generate New Bill"
            >
                <form onSubmit={handleSubmit(onGenerateBill)} className="space-y-5">
                    <Select
                        label="Select Unit"
                        options={unitOptions}
                        {...register('unit_id', { required: 'Unit is required' })}
                        error={errors.unit_id?.message as string}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Bill Type"
                            options={[
                                { value: 'maintenance', label: 'Maintenance' },
                                { value: 'utility', label: 'Utility' },
                                { value: 'rent', label: 'Rent' },
                                { value: 'other', label: 'Other' },
                            ]}
                            {...register('bill_type', { required: 'Type is required' })}
                        />

                        <div>
                            <Input
                                label="Amount"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...register('amount', { required: 'Amount is required', min: 0 })}
                                error={errors.amount?.message as string}
                            />
                            {suggestedAmount && (
                                <p className="text-xs text-indigo-400 mt-1 flex items-center gap-1">
                                    <FiInfo /> Suggested: ${suggestedAmount}
                                </p>
                            )}
                        </div>
                    </div>

                    <Input
                        label="Due Date"
                        type="date"
                        {...register('due_date', { required: 'Due date is required' })}
                        error={errors.due_date?.message as string}
                    />

                    <Input
                        label="Description"
                        placeholder="Ex: Monthly maintenance for July"
                        {...register('description')}
                    />

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit" isLoading={isSubmitting}>Generate Bill</Button>
                    </div>
                </form>
            </Modal>

        </div>
    );
}
