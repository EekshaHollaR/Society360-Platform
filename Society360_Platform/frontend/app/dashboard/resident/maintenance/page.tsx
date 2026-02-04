'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { residentApi, Ticket } from '@/lib/api/resident';
import { useAuthStore } from '@/lib/store/authStore';

export default function MaintenancePage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } =
    useForm<Partial<Ticket>>();

  const { user } = useAuthStore();
  const unitId = user?.units?.[0]?.id;

  const fetchTickets = async () => {
    try {
      const response = await residentApi.getTickets();
      if (response.data.success) setTickets(response.data.data);
    } catch {
      toast.error('Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const onSubmit = async (data: Partial<Ticket>) => {
    if (!unitId) return toast.error('No unit associated with this account');

    try {
      const response = await residentApi.createTicket({ ...data, unit_id: unitId });
      if (response.data.success) {
        toast.success('Ticket created');
        setIsModalOpen(false);
        reset();
        fetchTickets();
      }
    } catch (err: any) {
      const fieldErrors = err?.response?.data?.errors;
      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, msg]) => {
          // @ts-ignore
          setError(field as any, { type: 'server', message: msg });
        });
      }
      toast.error('Failed to create ticket');
    }
  };

  const priorityStyle = {
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    medium: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    low: 'bg-white/5 text-slate-300 border-white/10',
  };

  const statusStyle = {
    open: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    resolved: 'bg-green-500/10 text-green-400 border-green-500/20',
    default: 'bg-white/5 text-slate-300 border-white/10',
  };

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-white">Maintenance Requests</h1>
          <p className="text-sm text-slate-400">Report issues and track repairs</p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-500 hover:bg-indigo-400"
        >
          <FiPlus className="mr-2" /> New Request
        </Button>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-5">
          {[1,2,3,4,5,6].map(i => (
            <Card key={i} className="bg-[#0b1220] border border-white/10 p-5 animate-pulse space-y-3">
              <div className="h-4 bg-white/10 rounded w-1/2" />
              <div className="h-4 bg-white/10 rounded w-full" />
              <div className="h-4 bg-white/10 rounded w-3/4" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-5">
          {tickets.map(ticket => (
            <Card key={ticket.id} className="bg-[#0b1220] border border-white/10 p-5 hover:border-white/20 transition">
              <div className="flex justify-between mb-2">
                <Badge className={statusStyle[ticket.status as keyof typeof statusStyle]}>
                  {ticket.status}
                </Badge>
                <Badge className={priorityStyle[ticket.priority as keyof typeof priorityStyle]}>
                  {ticket.priority}
                </Badge>
              </div>

              <h3 className="text-white font-semibold">{ticket.title}</h3>
              <p className="text-sm text-slate-400 line-clamp-2 mt-1">{ticket.description}</p>

              <div className="flex justify-between text-xs text-slate-500 border-t border-white/10 pt-3 mt-3">
                <span>{ticket.category}</span>
                <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Maintenance Ticket"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <Input
            label="Issue Title"
            placeholder="Broken AC in bedroom"
            {...register('title', { required: true })}
            className="bg-[#0f172a] border-white/10 text-white placeholder:text-slate-500"
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
              {...register('category', { required: true })}
              className="bg-[#0f172a] border-white/10 text-white"
            />

            <Select
              label="Priority"
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'critical', label: 'Critical' },
              ]}
              {...register('priority', { required: true })}
              className="bg-[#0f172a] border-white/10 text-white"
            />
          </div>

          <textarea
            className="w-full bg-[#0f172a] border border-white/10 rounded-lg p-3 text-white min-h-[120px]"
            placeholder="Describe the issue..."
            {...register('description', { required: true })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button className="bg-indigo-500 hover:bg-indigo-400" isLoading={isSubmitting}>
              Submit Request
            </Button>
          </div>

        </form>
      </Modal>
    </div>
  );
}
