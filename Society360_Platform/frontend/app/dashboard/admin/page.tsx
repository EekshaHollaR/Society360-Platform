'use client';

import { useState, useEffect } from 'react';
import { FiUsers, FiGrid, FiAlertCircle, FiDollarSign } from 'react-icons/fi';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { adminApi } from '@/lib/api/admin';
import { toast } from 'sonner';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, activityRes] = await Promise.all([
                    adminApi.getDashboardStats(),
                    adminApi.getRecentActivity()
                ]);

                if (statsRes.data.success) setStats(statsRes.data.data || {});
                if (activityRes.data.success) setRecentActivity(activityRes.data.data || []);
            } catch (error) {
                console.error('Failed to fetch admin dashboard data', error);
                toast.error('Failed to load dashboard data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

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
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Users"
                            value={stats.usersCount?.toString() || '0'}
                            icon={<FiUsers size={24} />}
                            color="primary"
                        />
                        <StatCard
                            title="Occupied Units"
                            value={stats.occupiedUnitsCount?.toString() || '0'}
                            icon={<FiGrid size={24} />}
                            color="secondary"
                        />
                        <StatCard
                            title="Open Tickets"
                            value={stats.openTicketsCount?.toString() || '0'}
                            icon={<FiAlertCircle size={24} />}
                            color="warning"
                        />
                        <StatCard
                            title="Monthly Revenue"
                            value={`$${stats.monthlyRevenue?.toLocaleString() || '0'}`}
                            icon={<FiDollarSign size={24} />}
                            color="success"
                        />
                    </div>
                )}

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
                                {recentActivity.length === 0 ? (
                                    <p className="text-sm text-[var(--gray-500)]">No recent activity.</p>
                                ) : (
                                    recentActivity.slice(0, 5).map((log) => (
                                        <div key={log.id} className="flex items-center justify-between py-2 border-b border-[var(--gray-100)] last:border-0">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-[var(--gray-100)] flex items-center justify-center text-[var(--gray-600)]">
                                                    <FiUsers size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-[var(--gray-900)]">{log.action.replace('_', ' ')}</p>
                                                    <p className="text-xs text-[var(--gray-500)]">{new Date(log.created_at).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                                                {log.entity_type}
                                            </span>
                                        </div>
                                    ))
                                )}
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
