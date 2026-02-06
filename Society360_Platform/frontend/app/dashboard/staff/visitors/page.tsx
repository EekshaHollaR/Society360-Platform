'use client';

import { useState, useEffect } from 'react';
import { FiUserCheck, FiLogIn, FiLogOut, FiSearch, FiClock } from 'react-icons/fi';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { staffApi, Visitor } from '@/lib/api/staff';

export default function StaffVisitorsPage() {
    const [pendingVisitors, setPendingVisitors] = useState<Visitor[]>([]);
    const [recentVisitors, setRecentVisitors] = useState<Visitor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        try {
            const [pendingRes, historyRes] = await Promise.all([
                staffApi.getPendingVisitors(),
                staffApi.getRecentVisitors()
            ]);

            if (pendingRes.data.success) setPendingVisitors(pendingRes.data.data);
            if (historyRes.data.success) setRecentVisitors(historyRes.data.data);
        } catch {
            toast.error('Failed to load visitor data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCheckIn = async (visitorId: string) => {
        try {
            const response = await staffApi.logVisitorCheckIn({ visitor_id: visitorId });
            if (response.data.success) {
                toast.success('Visitor checked in');
                fetchData();
            }
        } catch {
            toast.error('Failed to log check-in');
        }
    };

    const handleCheckOut = async (visitorId: string) => {
        try {
            const response = await staffApi.logVisitorCheckOut(visitorId);
            if (response.data.success) {
                toast.success('Visitor checked out');
                fetchData();
            }
        } catch {
            toast.error('Failed to log check-out');
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-[var(--gray-900)]">Visitor Management</h1>
                <p className="text-[var(--gray-500)]">Monitor and log visitor entry/exit.</p>
            </div>

            {/* Pending Approvals / Pre-approved */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <FiUserCheck className="text-[var(--primary)]" size={20} />
                    <h2 className="text-lg font-bold text-gray-900">Pre-approved Visitors</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-900">
                    {isLoading ? (
                        [1, 2, 3].map(i => <Card key={i} className="h-40 animate-pulse bg-gray-50"><></></Card>)
                    ) : pendingVisitors.length === 0 ? (
                        <div className="col-span-full">
                            <Card className="p-8 text-center text-gray-400">
                                No pre-approved visitors waiting.
                            </Card>
                        </div>
                    ) : (
                        pendingVisitors.map(visitor => (
                            <Card key={visitor.id} className="p-5 flex flex-col justify-between hover:border-[var(--primary)] transition-all">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="info">Pre-approved</Badge>
                                        <span className="text-xs font-bold text-[var(--primary)]">Unit {visitor.unit?.unit_number}</span>
                                    </div>
                                    <h3 className="font-bold text-lg">{visitor.visitor_name}</h3>
                                    <p className="text-xs text-gray-500">{visitor.visitor_phone}</p>
                                </div>

                                <Button size="sm" className="mt-4" onClick={() => handleCheckIn(visitor.id)}>
                                    <FiLogIn className="mr-2" /> Log Check-in
                                </Button>
                            </Card>
                        ))
                    )}
                </div>
            </section>

            {/* In Building / History */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <FiClock className="text-[var(--primary)]" size={20} />
                        <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                    </div>
                    <div className="relative max-w-xs text-gray-900">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            placeholder="Filter by name/unit..."
                            className="text-sm pl-10 pr-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-1 focus:ring-[var(--primary)]"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Card className="overflow-hidden text-gray-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr className="text-gray-500">
                                    <th className="py-4 px-6 text-left">Visitor</th>
                                    <th className="py-4 px-6 text-left">Unit</th>
                                    <th className="py-4 px-6 text-left">Status</th>
                                    <th className="py-4 px-6 text-left">Check-in</th>
                                    <th className="py-4 px-6 text-left">Check-out</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-gray-800">
                                {recentVisitors
                                    .filter(v => v.visitor_name.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map(visitor => (
                                        <tr key={visitor.id}>
                                            <td className="py-4 px-6">
                                                <p className="font-bold">{visitor.visitor_name}</p>
                                                <p className="text-xs text-gray-500">{visitor.visitor_phone}</p>
                                            </td>
                                            <td className="px-6">{visitor.unit?.unit_number}</td>
                                            <td className="px-6">
                                                <Badge variant={visitor.status === 'checked_in' ? 'warning' : 'default'}>
                                                    {visitor.status.replace('_', ' ').toUpperCase()}
                                                </Badge>
                                            </td>
                                            <td className="px-6 text-gray-500">
                                                {visitor.check_in_time ? new Date(visitor.check_in_time).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}
                                            </td>
                                            <td className="px-6 text-gray-500">
                                                {visitor.check_out_time ? new Date(visitor.check_out_time).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}
                                            </td>
                                            <td className="px-6 text-right">
                                                {visitor.status === 'checked_in' && (
                                                    <Button variant="ghost" size="sm" className="text-[var(--primary)]" onClick={() => handleCheckOut(visitor.id)}>
                                                        <FiLogOut className="mr-2" /> Check-out
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </section>
        </div>
    );
}
