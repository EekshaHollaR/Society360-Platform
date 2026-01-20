'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiAlertCircle, FiTool, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { residentApi, Ticket } from '@/lib/api/resident';

export default function MaintenancePage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<Partial<Ticket>>();

    const fetchTickets = async () => {
        try {
            const response = await residentApi.getTickets();
            if (response.data.success) {
                setTickets(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to load tickets');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const onSubmit = async (data: Partial<Ticket>) => {
        try {
            const response = await residentApi.createTicket(data);
            if (response.data.success) {
                toast.success('Ticket created successfully');
                setIsModalOpen(false);
                reset();
                fetchTickets();
            }
        } catch (error) {
            toast.error('Failed to create ticket');
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'critical': return <Badge variant="error" className="uppercase">Critical</Badge>;
            case 'high': return <Badge variant="warning" className="uppercase">High</Badge>;
            case 'medium': return <Badge variant="info" className="uppercase">Medium</Badge>;
            default: return <Badge variant="default" className="uppercase">Low</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--gray-900)]">Maintenance Requests</h1>
                    <p className="text-[var(--gray-500)]">Report issues and track repairs.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <FiPlus className="mr-2" /> New Request
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tickets.length === 0 ? (
                        <div className="col-span-full">
                            <Card className="p-8 text-center text-[var(--gray-500)]">
                                No tickets found.
                            </Card>
                        </div>
                    ) : (
                        tickets.map((ticket) => (
                            <Card key={ticket.id} className="cursor-pointer hover:border-[var(--primary)] transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <Badge variant={ticket.status === 'open' ? 'warning' : ticket.status === 'resolved' ? 'success' : 'default'}>
                                        {ticket.status.replace('_', ' ')}
                                    </Badge>
                                    {getPriorityBadge(ticket.priority)}
                                </div>

                                <h3 className="font-semibold text-lg text-[var(--gray-900)] mb-1">{ticket.title}</h3>
                                <p className="text-sm text-[var(--gray-500)] mb-4 line-clamp-2">{ticket.description}</p>

                                <div className="flex items-center justify-between text-xs text-[var(--gray-400)] border-t border-[var(--gray-100)] pt-3">
                                    <span className="capitalize">{ticket.category}</span>
                                    <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Ticket"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Issue Title"
                        placeholder="e.g. Broken AC in Bedroom"
                        {...register('title', { required: 'Title is required' })}
                        error={errors.title?.message}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Category"
                            options={[
                                { value: 'electrical', label: 'Electrical' },
                                { value: 'plumbing', label: 'Plumbing' },
                                { value: 'appliance', label: 'Appliance' },
                                { value: 'common_area', label: 'Common Area' },
                                { value: 'other', label: 'Other' },
                            ]}
                            {...register('category', { required: 'Category is required' })}
                        />
                        <Select
                            label="Priority"
                            options={[
                                { value: 'low', label: 'Low' },
                                { value: 'medium', label: 'Medium' },
                                { value: 'high', label: 'High' },
                                { value: 'critical', label: 'Critical' },
                            ]}
                            {...register('priority', { required: 'Priority is required' })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-[var(--gray-700)]">Description</label>
                        <textarea
                            className="w-full rounded-lg border border-[var(--gray-300)] p-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] min-h-[100px]"
                            placeholder="Describe the issue in detail..."
                            {...register('description', { required: 'Description is required' })}
                        ></textarea>
                        {errors.description && (
                            <p className="text-sm text-[var(--error)]">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Submit Request
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
