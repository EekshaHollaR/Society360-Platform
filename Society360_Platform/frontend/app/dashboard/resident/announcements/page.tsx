'use client';

import { useState, useEffect } from 'react';
import { FiAlertTriangle, FiInfo, FiCalendar, FiFilter } from 'react-icons/fi';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { residentApi, Announcement } from '@/lib/api/resident';

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'high' | 'normal'>('all');

    const fetchAnnouncements = async () => {
        try {
            const response = await residentApi.getAnnouncements();
            if (response.data.success) {
                setAnnouncements(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to load announcements');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const filteredAnnouncements = announcements.filter(
        (a) => filter === 'all' || a.priority === filter
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--gray-900)]">Announcements</h1>
                    <p className="text-[var(--gray-500)]">Stay updated with society notices and events.</p>
                </div>

                <div className="flex items-center gap-2 bg-white rounded-lg border border-[var(--gray-300)] p-1">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${filter === 'all' ? 'bg-[var(--gray-100)] font-medium text-[var(--gray-900)]' : 'text-[var(--gray-600)] hover:text-[var(--gray-900)]'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('high')}
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${filter === 'high' ? 'bg-red-50 font-medium text-red-700' : 'text-[var(--gray-600)] hover:text-red-600'
                            }`}
                    >
                        Critical
                    </button>
                    <button
                        onClick={() => setFilter('normal')}
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${filter === 'normal' ? 'bg-blue-50 font-medium text-blue-700' : 'text-[var(--gray-600)] hover:text-blue-600'
                            }`}
                    >
                        General
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredAnnouncements.length === 0 ? (
                        <Card className="p-8 text-center text-[var(--gray-500)]">
                            No announcements found.
                        </Card>
                    ) : (
                        filteredAnnouncements.map((item) => (
                            <Card
                                key={item.id}
                                className={`transition-all hover:shadow-md ${item.priority === 'high' ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-blue-500'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`
                    p-3 rounded-full flex-shrink-0
                    ${item.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}
                  `}>
                                        {item.priority === 'high' ? <FiAlertTriangle size={20} /> : <FiInfo size={20} />}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-lg text-[var(--gray-900)]">{item.title}</h3>
                                            <span className="text-xs text-[var(--gray-500)] flex items-center gap-1">
                                                <FiCalendar size={12} />
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <p className="text-[var(--gray-700)] leading-relaxed">
                                            {item.content}
                                        </p>

                                        <div className="mt-3 flex gap-2">
                                            <Badge variant="default" className="capitalize">{item.category}</Badge>
                                            {item.priority === 'high' && <Badge variant="error">High Priority</Badge>}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
