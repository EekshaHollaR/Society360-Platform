'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiUserPlus, FiClock, FiX, FiCheck } from 'react-icons/fi';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { residentApi, Visitor } from '@/lib/api/resident';
import { useAuthStore } from '@/lib/store/authStore';

export default function VisitorsPage() {
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<Partial<Visitor>>();
    const { user } = useAuthStore();
    const unitId = user?.units?.[0]?.id;

    const fetchVisitors = async () => {
        try {
            const response = await residentApi.getVisitors();
            if (response.data.success) {
                setVisitors(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to load visitors');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVisitors();
    }, []);

    const onSubmit = async (data: Partial<Visitor>) => {
        if (!unitId) {
            toast.error('No unit associated with this account');
            return;
        }

        try {
            const response = await residentApi.preApproveVisitor({ ...data, unit_id: unitId });
            if (response.data.success) {
                toast.success('Visitor pre-approved successfully');
                setIsModalOpen(false);
                reset();
                fetchVisitors(); // Reload list (or append efficiently)
            }
        } catch (error) {
            toast.error('Failed to pre-approve visitor');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved': return <Badge variant="success">Approved</Badge>;
            case 'checked_in': return <Badge variant="info">Checked In</Badge>;
            case 'checked_out': return <Badge variant="default">Checked Out</Badge>;
            case 'denied': return <Badge variant="error">Denied</Badge>;
            default: return <Badge variant="warning">Pending</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--gray-900)]">Visitor Management</h1>
                    <p className="text-[var(--gray-500)]">Track pending and past visitors.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <FiUserPlus className="mr-2" /> Pre-approve Visitor
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
                </div>
            ) : (
                <div className="grid gap-4">
                    {visitors.length === 0 ? (
                        <Card className="p-8 text-center text-[var(--gray-500)]">
                            No visitors found.
                        </Card>
                    ) : (
                        visitors.map((visitor) => (
                            <Card key={visitor.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[var(--gray-100)] flex items-center justify-center text-[var(--gray-600)] font-semibold text-lg">
                                        {visitor.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[var(--gray-900)]">{visitor.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-[var(--gray-500)] mt-1">
                                            <span>{visitor.visitor_type}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <FiClock size={14} />
                                                {visitor.expected_arrival ? new Date(visitor.expected_arrival).toLocaleString() : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                                    {getStatusBadge(visitor.status)}
                                    {visitor.status === 'pending' && (
                                        <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" size="sm">
                                            <FiX className="mr-1" /> General
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Pre-approve Visitor"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Full Name"
                        placeholder="e.g. John Doe"
                        {...register('name', { required: 'Name is required' })}
                        error={errors.name?.message}
                    />
                    <Input
                        label="Phone Number"
                        placeholder="e.g. 1234567890"
                        {...register('phone_number', { required: 'Phone number is required' })}
                        error={errors.phone_number?.message}
                    />
                    <Select
                        label="Visitor Type"
                        options={[
                            { value: 'guest', label: 'Guest' },
                            { value: 'delivery', label: 'Delivery' },
                            { value: 'service', label: 'Service/Repair' },
                        ]}
                        {...register('visitor_type', { required: 'Type is required' })}
                    />
                    <Input
                        label="Expected Arrival"
                        type="datetime-local"
                        {...register('expected_arrival', { required: 'Arrival time is required' })}
                        error={errors.expected_arrival?.message}
                    />
                    <Input
                        label="Purpose (Optional)"
                        placeholder="e.g. Dinner party"
                        {...register('purpose')}
                    />

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Pre-approve
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
