'use client';

import { useState, useEffect } from 'react';
import { FiUsers, FiGrid, FiAlertCircle, FiDollarSign } from 'react-icons/fi';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
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
                    adminApi.getRecentActivity(),
                ]);

                if (statsRes.data.success) setStats(statsRes.data.data || {});
                if (activityRes.data.success) setRecentActivity(activityRes.data.data || []);
            } catch {
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

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-[var(--gray-900)]">
                        Admin Dashboard
                    </h1>
                    <p className="text-[var(--gray-500)]">
                        Society management overview
                    </p>
                </div>

                {/* Stats Grid */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Users"
                            value={stats.usersCount?.toString() || '0'}
                            icon={<FiUsers size={24} />}
                            color="primary"
                            onClick={() => window.location.href = '/dashboard/admin/users'}
                        />
                        <StatCard
                            title="Occupied Units"
                            value={stats.occupiedUnitsCount?.toString() || '0'}
                            icon={<FiGrid size={24} />}
                            color="secondary"
                            onClick={() => window.location.href = '/dashboard/admin/units'}
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
                            onClick={() => window.location.href = '/dashboard/admin/finance'}
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activity */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle>Recent Activity</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/dashboard/admin/audit'}>View all</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivity.length === 0 ? (
                                    <p className="text-sm text-[var(--gray-500)]">No recent activity.</p>
                                ) : (
                                    recentActivity.slice(0, 6).map((log) => (
                                        <div key={log.id} className="flex items-center justify-between p-4 bg-[var(--gray-50)] rounded-lg border border-[var(--gray-100)]">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[var(--primary)] border border-[var(--gray-200)]">
                                                    <FiUsers size={18} />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-[var(--gray-900)] capitalize">{log.action.replace(/_/g, ' ')}</h4>
                                                    <p className="text-xs text-[var(--gray-500)]">{new Date(log.created_at).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <Badge variant="info">{log.entity_type}</Badge>
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
                            <Button className="w-full justify-start gap-3" variant="outline" onClick={() => window.location.href = '/dashboard/admin/users'}>
                                <FiUsers size={18} /> Add New User
                            </Button>
                            <Button className="w-full justify-start gap-3" variant="outline" onClick={() => window.location.href = '/dashboard/admin/units'}>
                                <FiGrid size={18} /> Manage Units
                            </Button>
                            <Button className="w-full justify-start gap-3" variant="outline" onClick={() => window.location.href = '/dashboard/admin/config'}>
                                <FiAlertCircle size={18} /> System Config
                            </Button>
                            <Button className="w-full justify-start gap-3" variant="outline" onClick={() => window.location.href = '/dashboard/admin/finance'}>
                                <FiDollarSign size={18} /> Generate Bills
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ProtectedRoute>
    );
}
