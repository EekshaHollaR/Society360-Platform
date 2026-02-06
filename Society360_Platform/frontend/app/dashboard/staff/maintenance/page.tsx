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

    const fetchTasks = async () => {
        try {
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

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const response = await staffApi.updateTaskStatus(id, newStatus);
            if (response.data.success) {
                toast.success(`Task marked as ${newStatus}`);
                fetchTasks();
            }
        } catch {
            toast.error('Failed to update task status');
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
                <h1 className="text-2xl font-bold text-[var(--gray-900)]">Assigned Tasks</h1>
                <p className="text-[var(--gray-500)]">Manage and resolve maintenance requests.</p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <Card key={i} className="p-6 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
                            <div className="flex justify-between">
                                <div className="h-8 bg-gray-200 rounded w-24"></div>
                                <div className="h-8 bg-gray-200 rounded w-24"></div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : tasks.length === 0 ? (
                <Card className="p-12 text-center text-gray-500">
                    <FiTool size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No tasks assigned to you.</p>
                    <p className="text-sm">New requests will appear here once assigned.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-900">
                    {tasks.map(task => (
                        <Card key={task.id} className="p-6 flex flex-col hover:border-[var(--primary)] transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex flex-col gap-1">
                                    <div className="flex gap-2">
                                        {getPriorityBadge(task.priority)}
                                        {getStatusBadge(task.status)}
                                    </div>
                                    <span className="text-xs text-gray-400 mt-1">
                                        Created: {new Date(task.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg text-[var(--primary)]">
                                        Unit {task.unit?.unit_number || 'N/A'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Block {task.unit?.block || '—'}
                                    </p>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold mb-2">{task.title}</h3>
                            <p className="text-gray-600 text-sm mb-6 flex-1">{task.description}</p>

                            <div className="flex gap-2 pt-4 border-t border-gray-100">
                                {task.status === 'open' && (
                                    <Button
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => handleUpdateStatus(task.id, 'in_progress')}
                                    >
                                        Start Task
                                    </Button>
                                )}
                                {task.status === 'in_progress' && (
                                    <Button
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => handleUpdateStatus(task.id, 'resolved')}
                                    >
                                        <FiCheckCircle className="mr-2" /> Mark Resolved
                                    </Button>
                                )}
                                {task.status === 'resolved' && (
                                    <p className="text-sm text-green-600 font-medium flex items-center">
                                        <FiCheckCircle className="mr-2" /> This task is completed.
                                    </p>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
