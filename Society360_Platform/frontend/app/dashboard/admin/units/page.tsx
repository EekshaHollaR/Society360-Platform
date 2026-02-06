'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiGrid } from 'react-icons/fi';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { adminApi } from '@/lib/api/admin';

interface Unit {
    id: string;
    unit_number: string;
    floor_number: number;
    type: string;
    status: 'vacant' | 'occupied' | 'maintenance' | 'reserved';
    block_id: string;
    block_name?: string;
}

interface Block {
    id: string;
    name: string;
}

export default function UnitManagementPage() {
    const [units, setUnits] = useState<Unit[]>([]);
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
    const [residents, setResidents] = useState<any[]>([]);
    const [filterBlock, setFilterBlock] = useState('all');

    const { register, handleSubmit, reset, setValue, formState: { errors } } =
        useForm<Partial<Unit>>();

    const { register: registerAssign, handleSubmit: handleSubmitAssign, reset: resetAssign } =
        useForm<{ user_id: string; resident_type: string }>();

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [unitsRes, blocksRes, residentsRes] = await Promise.all([
                adminApi.getUnits(),
                adminApi.getBlocks(),
                adminApi.getUsers({ role: 'resident' })
            ]);

            if (unitsRes.data.success) setUnits(unitsRes.data.data);
            if (blocksRes.data.success) setBlocks(blocksRes.data.data);
            if (residentsRes.data.success) setResidents(residentsRes.data.data);
        } catch {
            toast.error('Failed to load unit data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = () => {
        setEditingUnit(null);
        reset({ status: 'vacant', type: '2BHK' });
        setIsModalOpen(true);
    };

    const handleEdit = (unit: Unit) => {
        setEditingUnit(unit);
        Object.entries(unit).forEach(([k, v]) => setValue(k as any, v as any));
        setIsModalOpen(true);
    };

    const handleAssign = (unit: Unit) => {
        setSelectedUnit(unit);
        resetAssign();
        setIsAssignModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this unit?')) return;
        try {
            await adminApi.deleteUnit(id);
            toast.success('Unit deleted');
            fetchData();
        } catch {
            toast.error('Failed to delete unit');
        }
    };

    const onSubmit = async (data: Partial<Unit>) => {
        try {
            if (editingUnit) {
                await adminApi.updateUnit(editingUnit.id, data);
                toast.success('Unit updated');
            } else {
                await adminApi.createUnit(data);
                toast.success('Unit created');
            }
            setIsModalOpen(false);
            fetchData();
        } catch {
            toast.error('Operation failed');
        }
    };

    const onAssignSubmit = async (data: any) => {
        if (!selectedUnit) return;
        try {
            // Need to add assignResident to adminApi if not there
            // Actually I'll use a direct api call or add it to adminApi
            await (adminApi as any).assignResident(selectedUnit.id, data);
            toast.success('Resident assigned successfully');
            setIsAssignModalOpen(false);
            fetchData();
        } catch {
            toast.error('Failed to assign resident');
        }
    };

    const statusBadge = (status: string) => {
        switch (status) {
            case 'occupied': return <Badge variant="success">Occupied</Badge>;
            case 'vacant': return <Badge variant="info">Vacant</Badge>;
            case 'maintenance': return <Badge variant="warning">Maintenance</Badge>;
            case 'reserved': return <Badge variant="default">Reserved</Badge>;
            default: return <Badge variant="default">{status}</Badge>;
        }
    };

    const filteredUnits = filterBlock === 'all'
        ? units
        : units.filter(u => u.block_id === filterBlock);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--gray-900)]">
                        Unit Management
                    </h1>
                    <p className="text-[var(--gray-500)]">
                        Manage society blocks and individual units.
                    </p>
                </div>

                <Button onClick={handleCreate}>
                    <FiPlus className="mr-2" /> Add Unit
                </Button>
            </div>

            <Card className="p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative flex-1 max-w-sm">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--gray-400)]" />
                        <input
                            placeholder="Search by unit number..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--gray-300)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-50 outline-none transition-all text-gray-900"
                        />
                    </div>

                    <select
                        value={filterBlock}
                        onChange={e => setFilterBlock(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-[var(--gray-300)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-50 outline-none transition-all text-gray-900"
                    >
                        <option value="all">All Blocks</option>
                        {blocks.map(block => (
                            <option key={block.id} value={block.id}>{block.name}</option>
                        ))}
                    </select>
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
                                    <th className="py-4 px-6 text-left font-semibold">Unit No.</th>
                                    <th className="py-4 px-6 text-left font-semibold">Block</th>
                                    <th className="py-4 px-6 text-left font-semibold">Type</th>
                                    <th className="py-4 px-6 text-left font-semibold">Floor</th>
                                    <th className="py-4 px-6 text-left font-semibold">Status</th>
                                    <th className="py-4 px-6 text-right font-semibold">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[var(--gray-100)]">
                                {filteredUnits.map(unit => (
                                    <tr key={unit.id} className="hover:bg-[var(--gray-50)] transition-colors">
                                        <td className="py-4 px-6 font-medium">{unit.unit_number}</td>
                                        <td className="px-6">{unit.block_name || '—'}</td>
                                        <td className="px-6">{unit.type}</td>
                                        <td className="px-6">{unit.floor_number}</td>
                                        <td className="px-6">{statusBadge(unit.status)}</td>
                                        <td className="px-6 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="sm" onClick={() => handleAssign(unit)}>
                                                    Assign
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleEdit(unit)} className="text-[var(--primary)]">
                                                    <FiEdit2 size={16} />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(unit.id)} className="text-red-600">
                                                    <FiTrash2 size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingUnit ? 'Edit Unit' : 'Add New Unit'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Unit Number" placeholder="e.g. 101" {...register('unit_number', { required: 'Unit number is required' })} error={errors.unit_number?.message} />
                        <Input label="Floor Number" type="number" placeholder="e.g. 1" {...register('floor_number', { required: 'Floor is required' })} error={errors.floor_number?.message} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Block"
                            options={blocks.map(b => ({ value: b.id, label: b.name }))}
                            {...register('block_id', { required: 'Block is required' })}
                            error={errors.block_id?.message}
                        />
                        <Select
                            label="Unit Type"
                            options={[
                                { value: '1BHK', label: '1 BHK' },
                                { value: '2BHK', label: '2 BHK' },
                                { value: '3BHK', label: '3 BHK' },
                                { value: '4BHK', label: '4 BHK' },
                                { value: 'Penthouse', label: 'Penthouse' },
                            ]}
                            {...register('type')}
                        />
                    </div>

                    <Select
                        label="Status"
                        options={[
                            { value: 'vacant', label: 'Vacant' },
                            { value: 'occupied', label: 'Occupied' },
                            { value: 'maintenance', label: 'Maintenance' },
                            { value: 'reserved', label: 'Reserved' },
                        ]}
                        {...register('status')}
                    />

                    <div className="flex justify-end gap-3 pt-6 border-t border-[var(--gray-100)] mt-6">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {editingUnit ? 'Update Unit' : 'Add Unit'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Assign Resident Modal */}
            <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title={`Assign Resident to Unit ${selectedUnit?.unit_number}`}>
                <form onSubmit={handleSubmitAssign(onAssignSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select Resident</label>
                        <select {...registerAssign('user_id', { required: true })} className="w-full h-10 px-3 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]">
                            <option value="">Select a user...</option>
                            {residents.map(r => (
                                <option key={r.id} value={r.id}>{r.full_name} ({r.email})</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Resident Type</label>
                        <select {...registerAssign('resident_type', { required: true })} className="w-full h-10 px-3 rounded-md border border-gray-200">
                            <option value="owner">Owner</option>
                            <option value="tenant">Tenant</option>
                            <option value="family_member">Family Member</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => setIsAssignModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Assign Resident</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
