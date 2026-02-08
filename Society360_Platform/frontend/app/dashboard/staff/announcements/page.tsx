'use client';

import { useState, useEffect } from 'react';
import { FiBell, FiInfo, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { staffApi } from '@/lib/api/staff';

interface Announcement {
    id: string;
    title: string;
    content: string;
    is_important: boolean;
    target_audience: string;
    created_at: string;
    full_name?: string;
}

export default function StaffAnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAnnouncements = async () => {
        try {
            const response = await staffApi.getAnnouncements();
            if (response.data.success) {
                setAnnouncements(response.data.data);
            }
        } catch {
            toast.error('Failed to load announcements');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[var(--gray-900)]">Society Announcements</h1>
                <p className="text-[var(--gray-500)]">Stay updated with the latest news and notices from administration.</p>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <Card key={i} className="p-6 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </Card>
                    ))}
                </div>
            ) : announcements.length === 0 ? (
                <Card className="p-12 text-center text-gray-500">
                    <FiBell size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No announcements yet.</p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {announcements.map(announcement => (
                        <Card key={announcement.id} className="p-6 text-gray-900">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${announcement.is_important ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {announcement.is_important ? <FiAlertTriangle /> : <FiInfo />}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">{announcement.title}</h3>
                                        <p className="text-xs text-gray-400">
                                            {new Date(announcement.created_at).toLocaleString()} • Posted by {announcement.full_name || 'Admin'}
                                        </p>
                                    </div>
                                </div>
                                {announcement.is_important && (
                                    <Badge variant="error">IMPORTANT</Badge>
                                )}
                            </div>

                            <p className="text-gray-600 mb-4 whitespace-pre-wrap">{announcement.content}</p>

                            <div className="flex items-center gap-2 text-xs text-gray-400 border-t border-gray-50 pt-4">
                                <span className="capitalize px-2 py-0.5 bg-gray-100 rounded">Audience: {announcement.target_audience}</span>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
