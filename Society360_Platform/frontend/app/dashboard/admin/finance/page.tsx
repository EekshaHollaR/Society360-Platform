'use client';

import { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiPieChart } from 'react-icons/fi';
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
                if (response.data.success) {
                    setStats(response.data.data);
                }
            } catch (error) {
                toast.error('Failed to load financial data');
            } finally {
                setIsLoading(false);
            }
        };
        loadStats();
    }, []);

    const COLORS = ['#0D9488', '#F59E0B', '#EF4444', '#3B82F6'];

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[var(--gray-900)]">Financial Overview</h1>
                <p className="text-[var(--gray-500)]">Monitor revenue, expenses, and pending dues.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Revenue"
                    value={`$${stats?.totalRevenue.toLocaleString()}`}
                    icon={<FiDollarSign size={24} />}
                    trend={{ value: 12.5, label: "vs last month", isPositive: true }}
                    color="success"
                />
                <StatCard
                    title="Outstanding Dues"
                    value={`$${stats?.outstandingDues.toLocaleString()}`}
                    icon={<FiTrendingDown size={24} />}
                    trend={{ value: 5.2, label: "vs last month", isPositive: false }}
                    color="error"
                />
                <StatCard
                    title="Total Expenses"
                    value={`$${stats?.totalExpenses.toLocaleString()}`}
                    icon={<FiTrendingUp size={24} />}
                    trend={{ value: 2.1, label: "vs last month", isPositive: true }}
                    color="warning"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Trend (6 Months)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.monthlyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                                <Tooltip
                                    cursor={{ fill: '#F3F4F6' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Expense Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Maintenance', value: 45 },
                                        { name: 'Utilities', value: 25 },
                                        { name: 'Staff Salary', value: 20 },
                                        { name: 'Others', value: 10 },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {COLORS.map((color, index) => (
                                        <Cell key={`cell-${index}`} fill={color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-[var(--gray-500)] border-b border-[var(--gray-100)]">
                                <tr>
                                    <th className="py-3 font-medium">Date</th>
                                    <th className="py-3 font-medium">User</th>
                                    <th className="py-3 font-medium">Amount</th>
                                    <th className="py-3 font-medium text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--gray-100)]">
                                {stats?.recentTransactions.map((tx) => (
                                    <tr key={tx.id}>
                                        <td className="py-3 text-[var(--gray-600)]">{new Date(tx.date).toLocaleDateString()}</td>
                                        <td className="py-3 font-medium text-[var(--gray-900)]">{tx.user}</td>
                                        <td className="py-3 font-medium text-[var(--gray-900)]">${tx.amount}</td>
                                        <td className="py-3 text-right">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tx.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
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
