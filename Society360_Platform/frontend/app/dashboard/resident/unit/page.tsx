'use client';

import { useState, useEffect } from 'react';
import { FiGrid, FiUser, FiInfo, FiHome } from 'react-icons/fi';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { residentApi } from '@/lib/api/resident';

interface UnitDetail {
    id: string;
    unit_number: string;
    floor_number: number;
    type: string;
    status: string;
    residents: {
        id: string;
        full_name: string;
        email: string;
        resident_type: string;
        is_primary_contact: boolean;
    }[];
}

export default function MyUnitPage() {
    const [units, setUnits] = useState<UnitDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMyUnits = async () => {
        try {
            const response = await residentApi.getMyUnits();
            if (response.data.success) {
                setUnits(response.data.data);
            }
        } catch {
            toast.error('Failed to load unit information');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMyUnits();
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-64 bg-gray-200 rounded-xl"></div>
                    <div className="h-64 bg-gray-200 rounded-xl"></div>
                </div>
            </div>
        );
    }

    if (units.length === 0) {
        return (
            <Card className="p-12 text-center text-gray-500">
                <FiHome size={48} className="mx-auto mb-4 text-gray-300" />
                <h2 className="text-xl font-bold mb-2">No Unit Assigned</h2>
                <p>You are not currently assigned to any unit in Society360.</p>
                <p className="text-sm mt-2">Please contact administration if this is an error.</p>
            </Card>
        );
    }

    return (
        <div className="space-y-8 text-gray-900">
            <div>
                <h1 className="text-2xl font-bold text-[var(--gray-900)]">My Unit Details</h1>
                <p className="text-[var(--gray-500)]">Information about your residence and co-residents.</p>
            </div>

            {units.map((unit) => (
                <div key={unit.id} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Unit Overview */}
                    <Card className="lg:col-span-1 p-0 overflow-hidden h-fit">
                        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 text-white">
                            <FiGrid size={32} className="mb-4 opacity-50" />
                            <h2 className="text-3xl font-bold mb-1">Unit {unit.unit_number}</h2>
                            <p className="opacity-80">Floor {unit.floor_number} • {unit.type}</p>
                        </div>
                        <div className="p-6 space-y-4 bg-white">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                <span className="text-gray-500 text-sm">Status</span>
                                <Badge variant="success">Active</Badge>
                            </div>
                            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                                <span className="text-gray-500 text-sm">Property Type</span>
                                <span className="font-medium">{unit.type}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-sm">Location</span>
                                <span className="font-medium">Block A (Main)</span>
                            </div>
                        </div>
                    </Card>

                    {/* Residents List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <FiUser className="text-[var(--primary)]" />
                            <h2 className="text-lg font-bold">Residents</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {unit.residents.map((resident) => (
                                <Card key={resident.id} className="p-4 flex items-center gap-4 hover:border-[var(--primary)] transition-all bg-white">
                                    <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                                        {resident.full_name[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold truncate">{resident.full_name}</p>
                                            {resident.is_primary_contact && (
                                                <Badge variant="info" className="text-[10px] px-1.5 py-0">PRIMARY</Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 truncate">{resident.email}</p>
                                        <p className="text-[10px] text-indigo-500 font-bold uppercase mt-1">
                                            {resident.resident_type.replace('_', ' ')}
                                        </p>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Additional Info */}
                        <div className="mt-8">
                            <div className="flex items-center gap-2 mb-4">
                                <FiInfo className="text-[var(--primary)]" />
                                <h2 className="text-lg font-bold">Residency Information</h2>
                            </div>
                            <Card className="p-6 bg-blue-50/50 border-blue-100">
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li className="flex gap-2">
                                        <span className="font-bold text-blue-600">•</span>
                                        Maintain your profile information through the account settings.
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="font-bold text-blue-600">•</span>
                                        All residents listed here have access to the dashboard features for this unit.
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="font-bold text-blue-600">•</span>
                                        Changes to primary contact must be requested via the administration.
                                    </li>
                                </ul>
                            </Card>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
