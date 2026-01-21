'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { adminApi, User } from '@/lib/api/admin';

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [filterRole, setFilterRole] = useState('all');

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Partial<User>>();

    const fetchUsers = async () => {
        try {
            const response = await adminApi.getUsers({ role: filterRole !== 'all' ? filterRole : undefined });
            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filterRole]);

    const handleCreate = () => {
        setEditingUser(null);
        reset({ role: 'resident', status: 'active' });
        setIsModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setValue('first_name', user.first_name);
        setValue('last_name', user.last_name);
        setValue('email', user.email);
        setValue('phone_number', user.phone_number);
        setValue('role', user.role);
        setValue('status', user.status);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                await adminApi.deleteUser(id);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    const onSubmit = async (data: Partial<User>) => {
        try {
            if (editingUser) {
                await adminApi.updateUser(editingUser.id, data);
                toast.success('User updated successfully');
            } else {
                await adminApi.createUser(data);
                toast.success('User created successfully');
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            toast.error(editingUser ? 'Failed to update user' : 'Failed to create user');
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin': return <Badge variant="error" className="uppercase text-[10px]">Admin</Badge>;
            case 'staff': return <Badge variant="warning" className="uppercase text-[10px]">Staff</Badge>;
            default: return <Badge variant="info" className="uppercase text-[10px]">Resident</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--gray-900)]">User Management</h1>
                    <p className="text-[var(--gray-500)]">Manage all residents, staff, and admins.</p>
                </div>
                <Button onClick={handleCreate}>
                    <FiPlus className="mr-2" /> Add User
                </Button>
            </div>

            <Card className="p-4">
                <div className="flex gap-4 items-center mb-6">
                    <div className="relative flex-1 max-w-sm">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--gray-400)]" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full pl-10 pr-4 py-2 border border-[var(--gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                    </div>
                    <select
                        className="px-3 py-2 border border-[var(--gray-300)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                    >
                        <option value="all">All Roles</option>
                        <option value="resident">Resident</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[var(--gray-200)] text-[var(--gray-500)] text-sm">
                                    <th className="py-3 px-4 font-medium">User</th>
                                    <th className="py-3 px-4 font-medium">Role</th>
                                    <th className="py-3 px-4 font-medium">Status</th>
                                    <th className="py-3 px-4 font-medium">Unit</th>
                                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b border-[var(--gray-100)] hover:bg-[var(--gray-50)]">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-semibold">
                                                    {user.first_name[0]}{user.last_name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-[var(--gray-900)]">{user.first_name} {user.last_name}</p>
                                                    <p className="text-xs text-[var(--gray-500)]">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {user.status === 'active' ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-[var(--gray-600)]">{user.unit_number || '-'}</td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex justify-end gap-2 text-[var(--gray-500)]">
                                                <button onClick={() => handleEdit(user)} className="p-1 hover:text-[var(--primary)] transition-colors">
                                                    <FiEdit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(user.id)} className="p-1 hover:text-red-600 transition-colors">
                                                    <FiTrash2 size={16} />
                                                </button>
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
                title={editingUser ? "Edit User" : "Add New User"}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="First Name"
                            {...register('first_name', { required: 'Required' })}
                            error={errors.first_name?.message}
                        />
                        <Input
                            label="Last Name"
                            {...register('last_name', { required: 'Required' })}
                            error={errors.last_name?.message}
                        />
                    </div>
                    <Input
                        label="Email"
                        type="email"
                        {...register('email', { required: 'Required' })}
                        error={errors.email?.message}
                    />
                    <Input
                        label="Phone Number"
                        {...register('phone_number')}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Role"
                            options={[
                                { value: 'resident', label: 'Resident' },
                                { value: 'staff', label: 'Staff' },
                                { value: 'admin', label: 'Admin' },
                            ]}
                            {...register('role', { required: 'Required' })}
                        />
                        <Select
                            label="Status"
                            options={[
                                { value: 'active', label: 'Active' },
                                { value: 'inactive', label: 'Inactive' },
                                { value: 'banned', label: 'Banned' },
                            ]}
                            {...register('status', { required: 'Required' })}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {editingUser ? 'Save Changes' : 'Create User'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
