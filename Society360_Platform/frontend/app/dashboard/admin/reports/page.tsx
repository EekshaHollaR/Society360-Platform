'use client';

import { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, AreaChart, Area, Legend
} from 'recharts';
import { FiUsers, FiHome, FiActivity } from 'react-icons/fi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatCard } from '@/components/dashboard/StatCard';
import { Select } from '@/components/ui/Select';

export default function ReportsPage() {
    const [dateRange, setDateRange] = useState('30d');

    const visitorData = [
        { name: 'Mon', visitors: 45, deliveries: 20 },
        { name: 'Tue', visitors: 52, deliveries: 25 },
        { name: 'Wed', visitors: 38, deliveries: 15 },
        { name: 'Thu', visitors: 65, deliveries: 30 },
        { name: 'Fri', visitors: 78, deliveries: 45 },
        { name: 'Sat', visitors: 95, deliveries: 40 },
        { name: 'Sun', visitors: 85, deliveries: 35 },
    ];

    const occupancyData = [
        { name: 'A-Block', occupied: 90, vacant: 10 },
        { name: 'B-Block', occupied: 85, vacant: 15 },
        { name: 'C-Block', occupied: 70, vacant: 30 },
        { name: 'D-Block', occupied: 95, vacant: 5 },
    ];

    const ticketTrend = [
        { name: 'Week 1', received: 12, resolved: 10 },
        { name: 'Week 2', received: 19, resolved: 15 },
        { name: 'Week 3', received: 15, resolved: 18 },
        { name: 'Week 4', received: 8, resolved: 12 },
    ];

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--gray-900)]">
                        Reports & Analytics
                    </h1>
                    <p className="text-[var(--gray-500)]">
                        Real-time operational performance insights.
                    </p>
                </div>

                <div className="w-48">
                    <Select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        options={[
                            { value: '7d', label: 'Last 7 Days' },
                            { value: '30d', label: 'Last 30 Days' },
                            { value: '90d', label: 'Last 3 Months' },
                        ]}
                    />
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <StatCard
                    title="Active Residents"
                    value="245"
                    icon={<FiUsers size={24} />}
                    trend={{ value: 5, label: 'new this month', isPositive: true }}
                    color="primary"
                />

                <StatCard
                    title="Occupancy Rate"
                    value="88%"
                    icon={<FiHome size={24} />}
                    trend={{ value: 1.5, label: 'increase', isPositive: true }}
                    color="success"
                />

                <StatCard
                    title="Avg Resolution Time"
                    value="4.5h"
                    icon={<FiActivity size={24} />}
                    trend={{ value: 0.5, label: 'slower than avg', isPositive: false }}
                    color="warning"
                />

            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Visitor Flow */}
                <Card>
                    <CardHeader>
                        <CardTitle>Visitor Traffic</CardTitle>
                    </CardHeader>

                    <CardContent className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={visitorData}>
                                <defs>
                                    <linearGradient id="visitorsFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.75} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Legend />

                                <Area
                                    type="monotone"
                                    dataKey="visitors"
                                    stroke="var(--primary)"
                                    fill="url(#visitorsFill)"
                                    strokeWidth={2}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="deliveries"
                                    stroke="#10b981"
                                    fill="#10b981"
                                    fillOpacity={0.25}
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Ticket Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle>Maintenance Performance</CardTitle>
                    </CardHeader>

                    <CardContent className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ticketTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Legend />

                                <Line
                                    type="monotone"
                                    dataKey="received"
                                    stroke="#ef4444"
                                    strokeWidth={2.5}
                                    activeDot={{ r: 6 }}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="resolved"
                                    stroke="#10b981"
                                    strokeWidth={2.5}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Occupancy */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Occupancy by Block</CardTitle>
                    </CardHeader>

                    <CardContent className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={occupancyData} barSize={44}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Legend />

                                <Bar
                                    dataKey="occupied"
                                    fill="var(--primary)"
                                    radius={[6, 6, 0, 0]}
                                />

                                <Bar
                                    dataKey="vacant"
                                    fill="#e5e7eb"
                                    radius={[6, 6, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
