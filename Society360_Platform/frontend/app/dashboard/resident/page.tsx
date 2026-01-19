'use client';

import { FiHome, FiDollarSign, FiTool, FiBell } from 'react-icons/fi';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';

export default function ResidentDashboard() {
    return (
        <ProtectedRoute allowedRoles={['resident']}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--gray-900)]">Resident Dashboard</h1>
                    <p className="text-[var(--gray-500)]">Welcome to your home overview.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="My Unit"
                        value="A-304"
                        icon={<FiHome size={24} />}
                        color="primary"
                    />
                    <StatCard
                        title="Outstanding Bill"
                        value="$150.00"
                        icon={<FiDollarSign size={24} />}
                        color="error"
                    />
                    <StatCard
                        title="Open Request"
                        value="1"
                        icon={<FiTool size={24} />}
                        color="warning"
                    />
                    <StatCard
                        title="Announcements"
                        value="2 New"
                        icon={<FiBell size={24} />}
                        color="info"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Announcements */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Community Announcements</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-blue-900">Annual General Meeting</h4>
                                        <span className="text-xs text-blue-600">Oct 25, 2024</span>
                                    </div>
                                    <p className="text-sm text-blue-800">
                                        The annual general meeting will be held this Sunday at the community hall. All residents are requested to attend.
                                    </p>
                                </div>

                                <div className="p-4 border border-[var(--gray-200)] rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-[var(--gray-900)]">Power Saving Notice</h4>
                                        <span className="text-xs text-[var(--gray-500)]">Oct 22, 2024</span>
                                    </div>
                                    <p className="text-sm text-[var(--gray-600)]">
                                        Maintenance work on power lines scheduled for tomorrow between 2 PM and 4 PM.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>I want to...</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button className="w-full" variant="primary">
                                Pre-approve Visitor
                            </Button>
                            <Button className="w-full" variant="secondary">
                                Report Issue
                            </Button>
                            <Button className="w-full" variant="outline">
                                Pay Bill
                            </Button>
                            <Button className="w-full" variant="ghost">
                                View Community Rules
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ProtectedRoute>
    );
}
