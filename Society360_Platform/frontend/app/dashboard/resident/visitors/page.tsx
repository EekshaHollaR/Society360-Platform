'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiUserPlus, FiClock, FiX } from 'react-icons/fi';
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

    const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } =
        useForm<Partial<Visitor>>();

    const { user } = useAuthStore();
    const unitId = user?.units?.[0]?.id;

    const fetchVisitors = async () => {
        try {
            const response = await residentApi.getVisitors();
            // Backend returns array directly. Map fields to match frontend interface and provide defaults.
            const rawData = Array.isArray(response.data) ? response.data : response.data.data || [];
            const mappedData = rawData.map((v: any) => ({
                ...v,
                name: v.visitor_name || v.name || 'Unknown Visitor',
                phone_number: v.visitor_phone || v.phone_number || '',
                visitor_type: v.visitor_type || 'guest',
                expected_arrival: v.expected_arrival || v.created_at || new Date().toISOString(),
                status: v.status || 'pending'
            }));
            setVisitors(mappedData);
        } catch {
            toast.error('Failed to load visitors');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVisitors();
    }, []);

    const onSubmit = async (data: Partial<Visitor>) => {
        if (!unitId) return toast.error('No unit associated');

        // Map frontend fields as per backend expectations (visitor_name, visitor_phone)
        const payload = {
            ...data,
            visitor_name: data.name,
            visitor_phone: data.phone_number,
            unit_id: unitId
        };

        try {
            const response = await residentApi.preApproveVisitor(payload);
            if (response.status === 200 || response.status === 201) {
                toast.success('Visitor pre-approved');
                setIsModalOpen(false);
                reset();
                fetchVisitors();
            }
        } catch (err: any) {
            const fieldErrors = err?.response?.data?.errors;
            if (fieldErrors) {
                if (Array.isArray(fieldErrors)) {
                    fieldErrors.forEach((err: any) => toast.error(err.msg));
                } else {
                    Object.entries(fieldErrors).forEach(([field, msg]) => {
                        // @ts-ignore
                        setError(field as any, { type: 'server', message: msg });
                    });
                }
            } else {
                toast.error(err?.response?.data?.message || 'Failed to pre-approve visitor');
            }
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

            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Visitor Management</h1>
                    <p className="text-sm text-slate-400">Track pending and past visitors</p>
                </div>

                <Button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-500 hover:bg-indigo-400"
                >
                    <FiUserPlus className="mr-2" /> Pre-approve Visitor
                </Button>
            </div>

            {isLoading ? (
                <div className="grid gap-4">
                    {[1, 2, 3].map(i => (
                        <Card key={i} className="bg-[#0b1220] border border-white/10 p-6 animate-pulse space-y-3">
                            <div className="h-4 bg-white/10 rounded w-3/4" />
                            <div className="h-3 bg-white/10 rounded w-1/2" />
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid gap-4">
                    {visitors.map(visitor => (
                        <Card key={visitor.id} className="bg-[#0b1220] border border-white/10 p-6 flex justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center text-lg font-semibold">
                                    {visitor.name[0]}
                                </div>

                                <div>
                                    <h3 className="text-white font-semibold">{visitor.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                                        <span>{visitor.visitor_type}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <FiClock size={14} />
                                            {visitor.expected_arrival
                                                ? new Date(visitor.expected_arrival).toLocaleString()
                                                : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {getStatusBadge(visitor.status)}
                        </Card>
                    ))}
                </div>
            )}

            {/* ====== DARK MODAL ====== */}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Pre-approve Visitor"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        {...register('name', { required: true })}
                        className="bg-[#0f172a] border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500"
                    />

                    <Input
                        label="Phone Number"
                        placeholder="+91 9876543210"
                        {...register('phone_number', { required: true })}
                        className="bg-[#0f172a] border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500"
                    />

                    <Select
                        label="Visitor Type"
                        options={[
                            { value: 'guest', label: 'Guest' },
                            { value: 'delivery', label: 'Delivery' },
                            { value: 'service', label: 'Service / Repair' },
                        ]}
                        {...register('visitor_type', { required: true })}
                        className="bg-[#0f172a] border-white/10 text-white"
                    />

                    <Input
                        type="datetime-local"
                        label="Expected Arrival"
                        {...register('expected_arrival', { required: true })}
                        className="bg-[#0f172a] border-white/10 text-white focus:border-indigo-500"
                    />

                    <Input
                        label="Purpose (optional)"
                        placeholder="Dinner party"
                        {...register('purpose')}
                        className="bg-[#0f172a] border-white/10 text-white placeholder:text-slate-500"
                    />

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setIsModalOpen(false)}
                            className="text-slate-300 hover:bg-white/5"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            className="bg-indigo-500 hover:bg-indigo-400 shadow-lg shadow-indigo-500/20"
                        >
                            Pre-approve
                        </Button>
                    </div>

                </form>
            </Modal>

        </div>
    );
}
