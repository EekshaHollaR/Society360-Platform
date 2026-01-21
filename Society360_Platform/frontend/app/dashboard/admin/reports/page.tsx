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

    // Hardcoded mock data for visualization richness
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
        { name: 'A-Block', occupied: 90, vacent: 10 },
        { name: 'B-Block', occupied: 85, vacent: 15 },
        { name: 'C-Block', occupied: 70, vacent: 30 },
        { name: 'D-Block', occupied: 95, vacent: 5 },
    ];

    const ticketTrend = [
        { name: 'Week 1', received: 12, resolved: 10 },
        { name: 'Week 2', received: 19, resolved: 15 },
        { name: 'Week 3', received: 15, resolved: 18 },
        { name: 'Week 4', received: 8, resolved: 12 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--gray-900)]">Reports & Analytics</h1>
                    <p className="text-[var(--gray-500)]">Detailed insights into society operations.</p>
                </div>
                <div className="w-40">
                    <Select
                        options={[
                            { value: '7d', label: 'Last 7 Days' },
                            { value: '30d', label: 'Last 30 Days' },
                            { value: '90d', label: 'Last 3 Months' },
                        ]}
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                    />
                </div>
            </div>

            {/* Top Level Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Active Residents"
                    value="245"
                    icon={<FiUsers size={24} />}
                    trend={{ value: 5, label: "new this month", isPositive: true }}
                    color="primary"
                />
                <StatCard
                    title="Occupancy Rate"
                    value="88%"
                    icon={<FiHome size={24} />}
                    trend={{ value: 1.5, label: "increase", isPositive: true }}
                    color="success"
                />
                <StatCard
                    title="Avg Resolution Time"
                    value="4.5h"
                    icon={<FiActivity size={24} />}
                    trend={{ value: 0.5, label: "slower than avg", isPositive: false }}
                    color="warning"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Visitor Traffic Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Visitor Traffic (Weekly)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={visitorData}>
                                <defs>
                                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Legend />
                                <Area type="monotone" dataKey="visitors" stroke="var(--primary)" fillOpacity={1} fill="url(#colorVisitors)" />
                                <Area type="monotone" dataKey="deliveries" stroke="#10B981" fillOpacity={0.3} fill="#10B981" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Maintenance Resolution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Maintenance Tickets Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ticketTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="received" stroke="#EF4444" strokeWidth={2} activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Occupancy by Block */}
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Occupancy by Block</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={occupancyData} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="occupied" fill="var(--primary)" name="Occupied Units" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="vacent" fill="#E5E7EB" name="Vacant Units" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
