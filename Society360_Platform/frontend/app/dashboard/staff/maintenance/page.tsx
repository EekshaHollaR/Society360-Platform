'use client';

import { useState, useEffect } from 'react';
import { FiTool, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { staffApi, Task } from '@/lib/api/staff';

export default function StaffMaintenancePage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [currentUser, setCurrentUser] = useState<any>(null);

    const fetchTasks = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            setCurrentUser(user);

            const response = await staffApi.getAssignedTasks();
            if (response.data.success) {
                setTasks(response.data.data);
            }
        } catch {
            toast.error('Failed to load maintenance tasks');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const [isResolving, setIsResolving] = useState<string | null>(null);
    const [amountSpent, setAmountSpent] = useState('');

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        if (newStatus === 'resolved' && !isResolving) {
            setIsResolving(id);
            return;
        }

        try {
            const cost = amountSpent ? parseFloat(amountSpent) : undefined;
            const response = await staffApi.updateTaskStatus(id, newStatus, cost);
            if (response.data.success) {
                toast.success(`Task marked as ${newStatus}`);
                setIsResolving(null);
                setAmountSpent('');
                fetchTasks();
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to update task status';
            toast.error(message);
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'critical': return <Badge variant="error">CRITICAL</Badge>;
            case 'high': return <Badge variant="warning">HIGH</Badge>;
            case 'medium': return <Badge variant="info">MEDIUM</Badge>;
            default: return <Badge variant="default">LOW</Badge>;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open': return <Badge variant="default">OPEN</Badge>;
            case 'in_progress': return <Badge variant="info">IN PROGRESS</Badge>;
            case 'resolved': return <Badge variant="success">RESOLVED</Badge>;
            case 'closed': return <Badge variant="default">CLOSED</Badge>;
            default: return <Badge variant="default">{status.toUpperCase()}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Maintenance Tasks</h1>
                <p className="text-slate-400">View and manage maintenance requests.</p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <Card key={i} className="p-6 animate-pulse">
                            <div className="h-4 bg-white/10 rounded w-1/4 mb-4"></div>
                            <div className="h-6 bg-white/10 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-white/10 rounded w-full mb-6"></div>
                            <div className="flex justify-between">
                                <div className="h-8 bg-white/10 rounded w-24"></div>
                                <div className="h-8 bg-white/10 rounded w-24"></div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : tasks.length === 0 ? (
                <Card className="p-12 text-center text-slate-500">
                    <FiTool size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium">No maintenance tasks found.</p>
                    <p className="text-sm">Requests will appear here.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
                    {tasks.map(task => {
                        const isAssignedToMe = task.assigned_to_id === currentUser?.id;
                        const isUnassigned = task.status === 'open';
                        const canInteract = isAssignedToMe || isUnassigned;

                        return (
                            <Card key={task.id} className={`p-6 flex flex-col hover:border-indigo-500 transition-all ${!canInteract ? 'opacity-70 border-white/5 grayscale-[0.5]' : ''}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex gap-2">
                                            {getPriorityBadge(task.priority)}
                                            {getStatusBadge(task.status)}
                                        </div>
                                        <span className="text-xs text-slate-500 mt-1">
                                            Created: {new Date(task.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-indigo-400">
                                            Unit {task.unit?.unit_number || 'N/A'}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {task.unit?.block || '—'}
                                        </p>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold mb-2">{task.title}</h3>
                                <p className="text-slate-400 text-sm mb-4 flex-1">{task.description}</p>

                                {/* Assignment Info */}
                                {!isUnassigned && (
                                    <div className="mb-4 flex items-center gap-2 text-xs">
                                        <span className="text-slate-500">Handling by:</span>
                                        <Badge variant={isAssignedToMe ? 'success' : 'info'} className="text-[10px] py-0">
                                            {isAssignedToMe ? 'You' : task.assigned_staff_name || 'Staff Member'}
                                        </Badge>
                                    </div>
                                )}

                                <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                                    {task.status === 'open' && (
                                        <Button
                                            size="sm"
                                            className="w-full"
                                            onClick={() => handleUpdateStatus(task.id, 'in_progress')}
                                        >
                                            Start Task
                                        </Button>
                                    )}
                                    {task.status === 'in_progress' && (
                                        <>
                                            {!isAssignedToMe ? (
                                                <p className="text-xs text-center text-slate-500 italic pb-2">
                                                    Active and assigned to another staff member.
                                                </p>
                                            ) : (
                                                <>
                                                    {isResolving === task.id ? (
                                                        <div className="space-y-3 p-3 bg-white/5 rounded-lg border border-indigo-500/30">
                                                            <p className="text-sm font-medium">Enter Total Amount Spent ($)</p>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                className="w-full px-3 py-2 bg-[#0b1220] border border-white/10 rounded-md focus:outline-none focus:border-indigo-500 text-sm"
                                                                placeholder="0.00"
                                                                value={amountSpent}
                                                                onChange={(e) => setAmountSpent(e.target.value)}
                                                                autoFocus
                                                            />
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="flex-1"
                                                                    onClick={() => {
                                                                        setIsResolving(null);
                                                                        setAmountSpent('');
                                                                    }}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    className="flex-1"
                                                                    onClick={() => handleUpdateStatus(task.id, 'resolved')}
                                                                    disabled={!amountSpent}
                                                                >
                                                                    Confirm
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            className="w-full"
                                                            onClick={() => handleUpdateStatus(task.id, 'resolved')}
                                                        >
                                                            <FiCheckCircle className="mr-2" /> Mark Resolved
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                        </>
                                    )}
                                    {task.status === 'resolved' && (
                                        <div className="flex justify-between items-center text-sm">
                                            <p className="text-emerald-400 font-medium flex items-center">
                                                <FiCheckCircle className="mr-2" /> Completed
                                            </p>
                                            {task.actual_cost && (
                                                <p className="text-slate-400 font-bold">Payout: <span className="text-indigo-400">${(parseFloat(task.actual_cost as any) * 1.1).toFixed(2)}</span></p>
                                            )}
                                        </div>
                                    )}
                                    {task.status === 'closed' && (
                                        <p className="text-sm text-slate-500 font-medium flex items-center italic">
                                            <FiCheckCircle className="mr-2" /> Task closed & paid.
                                        </p>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
