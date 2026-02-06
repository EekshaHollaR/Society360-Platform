'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiActivity, FiClock, FiUser } from 'react-icons/fi';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { adminApi } from '@/lib/api/admin';

interface AuditLog {
    id: string;
    user_name: string;
    action: string;
    resource_type: string;
    resource_id: string;
    details: any;
    ip_address: string;
    created_at: string;
}

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchLogs = async () => {
        try {
            const response = await adminApi.getAuditLogs();
            if (response.data.success) {
                setLogs(response.data.data);
            }
        } catch {
            toast.error('Failed to load audit logs');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const formatAction = (action: string) => {
        return action.replace(/_/g, ' ').toLowerCase();
    };

    const getActionBadge = (action: string) => {
        if (action.includes('CREATE')) return <Badge variant="success">CREATE</Badge>;
        if (action.includes('UPDATE')) return <Badge variant="info">UPDATE</Badge>;
        if (action.includes('DELETE')) return <Badge variant="error">DELETE</Badge>;
        return <Badge variant="default">ACTION</Badge>;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[var(--gray-900)]">Audit Logs</h1>
                <p className="text-[var(--gray-500)]">Track all system activities and administrative changes.</p>
            </div>

            <Card className="p-4">
                <div className="relative max-w-sm text-gray-900">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--gray-400)]" />
                    <input
                        placeholder="Search logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--gray-300)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-50 outline-none transition-all"
                    />
                </div>
            </Card>

            <Card className="overflow-hidden text-gray-900">
                {isLoading ? (
                    <div className="py-16 flex justify-center">
                        <div className="animate-spin h-8 w-8 border-b-2 border-[var(--primary)] rounded-full" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-[var(--gray-50)] border-b border-[var(--gray-200)]">
                                <tr className="text-[var(--gray-500)]">
                                    <th className="py-4 px-6 text-left font-semibold">Time</th>
                                    <th className="py-4 px-6 text-left font-semibold">User</th>
                                    <th className="py-4 px-6 text-left font-semibold">Action</th>
                                    <th className="py-4 px-6 text-left font-semibold">Resource</th>
                                    <th className="py-4 px-6 text-left font-semibold">Details</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[var(--gray-100)] text-gray-800">
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-[var(--gray-500)]">
                                            No audit logs found.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.filter(log =>
                                        log.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        log.resource_type?.toLowerCase().includes(searchTerm.toLowerCase())
                                    ).map(log => (
                                        <tr key={log.id} className="hover:bg-[var(--gray-50)] transition-colors">
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <FiClock className="text-[var(--gray-400)]" />
                                                    {new Date(log.created_at).toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6">
                                                <div className="flex items-center gap-2">
                                                    <FiUser className="text-[var(--gray-400)]" />
                                                    {log.user_name || 'System'}
                                                </div>
                                            </td>
                                            <td className="px-6">
                                                <div className="flex flex-col gap-1">
                                                    {getActionBadge(log.action)}
                                                    <span className="text-xs capitalize">{formatAction(log.action)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6">
                                                <span className="capitalize">{log.resource_type}</span>
                                            </td>
                                            <td className="px-6 max-w-xs">
                                                <p className="truncate text-xs text-[var(--gray-500)]" title={JSON.stringify(log.details)}>
                                                    {JSON.stringify(log.details)}
                                                </p>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
}
