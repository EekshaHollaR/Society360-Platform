'use client';

import { FiTool, FiUserCheck, FiClock, FiCalendar } from 'react-icons/fi';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';

export default function StaffDashboard() {
    return (
        <ProtectedRoute allowedRoles={['staff']}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--gray-900)]">Staff Dashboard</h1>
                    <p className="text-[var(--gray-500)]">Manage your daily tasks and visitors.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Assigned Tasks"
                        value="12"
                        icon={<FiTool size={24} />}
                        color="primary"
                    />
                    <StatCard
                        title="Today's Visitors"
                        value="45"
                        icon={<FiUserCheck size={24} />}
                        trend={{ value: 8, label: "vs yesterday", isPositive: true }}
                        color="secondary"
                    />
                    <StatCard
                        title="Pending Approvals"
                        value="5"
                        icon={<FiClock size={24} />}
                        color="warning"
                    />
                    <StatCard
                        title="Upcoming Events"
                        value="3"
                        icon={<FiCalendar size={24} />}
                        color="info"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Today's Tasks */}
                    <Card>
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle>Assigned Tasks</CardTitle>
                            <Button variant="ghost" size="sm">View All</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="p-3 border border-[var(--gray-200)] rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">High Priority</span>
                                            <span className="text-xs text-[var(--gray-500)]">Due today</span>
                                        </div>
                                        <h4 className="font-medium text-[var(--gray-900)]">Fix leaking pipe in Block A</h4>
                                        <p className="text-sm text-[var(--gray-500)] mt-1">Unit 101 - Bathroom leak reported by resident.</p>
                                        <div className="mt-3 flex justify-end">
                                            <Button size="sm" variant="outline">Mark Complete</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Visitor Log */}
                    <Card>
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle>Recent Visitors</CardTitle>
                            <Button size="sm">Log New Visitor</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[var(--gray-100)] flex items-center justify-center">
                                                <FiUserCheck size={18} className="text-[var(--gray-600)]" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-[var(--gray-900)]">John Smith</p>
                                                <p className="text-xs text-[var(--gray-500)]">Visiting Unit 304</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-[var(--gray-900)]">10:30 AM</p>
                                            <span className="text-xs text-green-600">Checked In</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ProtectedRoute>
    );
}
