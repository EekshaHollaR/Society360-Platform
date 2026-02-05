'use client';

import { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { FiDollarSign, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { toast } from 'sonner';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { adminApi, FinanceStats } from '@/lib/api/admin';

export default function FinancePage() {
    const [stats, setStats] = useState<FinanceStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const response = await adminApi.getFinanceStats();
                if (response.data.success) setStats(response.data.data);
            } catch {
                toast.error('Failed to load financial data');
            } finally {
                setIsLoading(false);
            }
        };
        loadStats();
    }, []);

    const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6'];

    if (isLoading) {
        return (
            <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]" />
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[var(--gray-900)]">
                    Financial Overview
                </h1>
                <p className="text-[var(--gray-500)]">
                    Real-time tracking of society revenue and dues.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <StatCard
                    title="Total Revenue"
                    value={`$${stats?.totalRevenue.toLocaleString() || '0'}`}
                    icon={<FiDollarSign size={24} />}
                    trend={{ value: 12.5, label: 'vs last month', isPositive: true }}
                    color="success"
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Revenue Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Trend</CardTitle>
                    </CardHeader>

                    <CardContent className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.monthlyRevenue || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(v) => `$${v / 1000}k`}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f3f4f6' }}
                                    contentStyle={{
                                        borderRadius: '10px',
                                        border: 'none',
                                        boxShadow: '0 10px 25px -10px rgba(0,0,0,.25)'
                                    }}
                                />
                                <Bar
                                    dataKey="amount"
                                    fill="var(--primary)"
                                    radius={[6, 6, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Expense Pie (Using Mock for distribution as not yet backed by API) */}
                <Card>
                    <CardHeader>
                        <CardTitle>Expense Distribution</CardTitle>
                    </CardHeader>

                    <CardContent className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Maintenance', value: 45 },
                                        { name: 'Utilities', value: 25 },
                                        { name: 'Staff', value: 20 },
                                        { name: 'Others', value: 10 },
                                    ]}
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={6}
                                    dataKey="value"
                                >
                                    {COLORS.map((c, i) => (
                                        <Cell key={i} fill={c} />
                                    ))}
                                </Pie>
                                <Tooltip />
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
                            <thead className="bg-[var(--gray-50)] border-b border-[var(--gray-200)]">
                                <tr className="text-[var(--gray-500)]">
                                    <th className="px-6 py-4 text-left font-semibold">Date</th>
                                    <th className="px-6 py-4 text-left font-semibold">User</th>
                                    <th className="px-6 py-4 text-left font-semibold">Amount</th>
                                    <th className="px-6 py-4 text-right font-semibold">Status</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[var(--gray-100)] text-[var(--gray-700)]">
                                {(stats?.recentTransactions || []).map(tx => (
                                    <tr key={tx.id} className="hover:bg-[var(--gray-50)] transition-colors">
                                        <td className="px-6 py-4">
                                            {new Date(tx.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-[var(--gray-900)]">
                                            {tx.user}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-[var(--gray-900)]">
                                            ${tx.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${tx.status === 'paid'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'}
                      `}>
                                                {tx.status === 'paid' ? 'Completed' : 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
