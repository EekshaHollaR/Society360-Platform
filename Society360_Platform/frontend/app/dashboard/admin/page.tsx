'use client';

import { FiUsers, FiGrid, FiAlertCircle, FiDollarSign } from 'react-icons/fi';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';

export default function AdminDashboard() {
    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--gray-900)]">Admin Dashboard</h1>
                        <p className="text-[var(--gray-500)]">Overview of society activities and performance.</p>
                    </div>
                    <Button>Download Report</Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Users"
                        value="1,234"
                        icon={<FiUsers size={24} />}
                        trend={{ value: 12, label: "vs last month", isPositive: true }}
                        color="primary"
                    />
                    <StatCard
                        title="Occupied Units"
                        value="856"
                        icon={<FiGrid size={24} />}
                        trend={{ value: 4, label: "vs last month", isPositive: true }}
                        color="secondary"
                    />
                    <StatCard
                        title="Open Tickets"
                        value="23"
                        icon={<FiAlertCircle size={24} />}
                        trend={{ value: 15, label: "vs last month", isPositive: false }}
                        color="warning"
                    />
                    <StatCard
                        title="Monthly Revenue"
                        value="$45.2k"
                        icon={<FiDollarSign size={24} />}
                        trend={{ value: 8, label: "vs last month", isPositive: true }}
                        color="success"
                    />
                </div>

                {/* Recent Activity & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activity */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle>Recent Activity</CardTitle>
                            <Button variant="ghost" size="sm">View All</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--gray-100)] last:border-0">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-[var(--gray-100)] flex items-center justify-center text-[var(--gray-600)]">
                                                <FiUsers size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-[var(--gray-900)]">New user registered</p>
                                                <p className="text-xs text-[var(--gray-500)]">2 hours ago</p>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                                            Active
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full justify-start">
                                <FiUsers className="mr-2" /> Add New User
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <FiGrid className="mr-2" /> Assign Unit
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <FiAlertCircle className="mr-2" /> Create Announcement
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                                <FiDollarSign className="mr-2" /> Generate Bills
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ProtectedRoute>
    );
}
