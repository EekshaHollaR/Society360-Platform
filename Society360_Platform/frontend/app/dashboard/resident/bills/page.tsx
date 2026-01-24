'use client';

import { useState, useEffect } from 'react';
import { FiDollarSign, FiClock, FiCheckCircle, FiDownload } from 'react-icons/fi';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { residentApi, Bill } from '@/lib/api/resident';

import { useAuthStore } from '@/lib/store/authStore';

export default function BillsPage() {
    const [bills, setBills] = useState<Bill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [payingId, setPayingId] = useState<string | null>(null);
    const { user } = useAuthStore();
    const unitId = user?.units?.[0]?.id;

    const fetchBills = async () => {
        if (!unitId) {
            setIsLoading(false);
            return;
        }
        try {
            const response = await residentApi.getBills(unitId);
            if (response.data.success) {
                setBills(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to load bills');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBills();
    }, [unitId]);

    const handlePay = async (id: string, amount: number) => {
        setPayingId(id);
        try {
            // Hardcoded payment method for now, in real app would be selected
            const response = await residentApi.payBill(id, amount, 'credit_card');
            if (response.data.success || response.status === 200) {
                toast.success(`Payment of $${amount} successful`);
                setBills(prev => prev.map(b => b.id === id ? { ...b, status: 'paid' } : b));
                // Optionally refresh all bills
            } else {
                throw new Error(response.data.message || 'Payment failed');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Payment failed');
        } finally {
            setPayingId(null);
        }
    };

    const outstandingBills = bills.filter(b => b.status !== 'paid');
    const pastBills = bills.filter(b => b.status === 'paid');
    const totalDue = outstandingBills.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-[var(--gray-900)]">Bills & Payments</h1>
                <p className="text-[var(--gray-500)]">Manage your monthly maintenance and other payments.</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
                </div>
            ) : (
                <>
                    {/* Summary Card */}
                    <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white border-none p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <p className="text-blue-100 font-medium mb-1">Total Outstanding</p>
                                <h2 className="text-4xl font-bold">${totalDue.toFixed(2)}</h2>
                                <p className="text-sm text-blue-200 mt-2">
                                    {outstandingBills.length} pending bill(s)
                                </p>
                            </div>
                            {outstandingBills.length > 0 && (
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="shadow-lg"
                                    onClick={() => outstandingBills[0] && handlePay(outstandingBills[0].id, outstandingBills[0].amount)}
                                    isLoading={!!payingId}
                                >
                                    Pay All Now
                                </Button>
                            )}
                        </div>
                    </Card>

                    {/* Pending Bills */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[var(--gray-900)]">Pending Bills</h3>
                        {outstandingBills.length === 0 ? (
                            <p className="text-[var(--gray-500)] italic">No pending bills. You&apos;re all caught up!</p>
                        ) : (
                            outstandingBills.map((bill) => (
                                <Card key={bill.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 gap-4 border-l-4 border-l-orange-400">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="font-semibold text-lg text-[var(--gray-900)]">{bill.bill_type} Bill</h4>
                                            <Badge variant="warning">Unpaid</Badge>
                                        </div>
                                        <p className="text-sm text-[var(--gray-500)]">
                                            Period: {bill.period_start} to {bill.period_end}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2 text-sm text-[var(--error)] font-medium">
                                            <FiClock />
                                            Due by {new Date(bill.due_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        <span className="text-xl font-bold text-[var(--gray-900)]">${bill.amount}</span>
                                        <Button
                                            onClick={() => handlePay(bill.id, bill.amount)}
                                            isLoading={payingId === bill.id}
                                            disabled={!!payingId}
                                        >
                                            Pay Now
                                        </Button>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Payment History */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[var(--gray-900)]">Payment History</h3>
                        {pastBills.length === 0 ? (
                            <p className="text-[var(--gray-500)] italic">No payment history available.</p>
                        ) : (
                            <div className="bg-white rounded-xl border border-[var(--gray-200)] overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-[var(--gray-50)] border-b border-[var(--gray-200)]">
                                        <tr>
                                            <th className="px-6 py-4 font-medium text-[var(--gray-700)]">Description</th>
                                            <th className="px-6 py-4 font-medium text-[var(--gray-700)]">Date Paid</th>
                                            <th className="px-6 py-4 font-medium text-[var(--gray-700)]">Amount</th>
                                            <th className="px-6 py-4 font-medium text-[var(--gray-700)]">Status</th>
                                            <th className="px-6 py-4 font-medium text-[var(--gray-700)]">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--gray-200)]">
                                        {pastBills.map((bill) => (
                                            <tr key={bill.id} className="hover:bg-[var(--gray-50)]">
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-[var(--gray-900)]">{bill.bill_type}</p>
                                                    <p className="text-xs text-[var(--gray-500)]">{bill.period_start} - {bill.period_end}</p>
                                                </td>
                                                <td className="px-6 py-4 text-[var(--gray-600)]">
                                                    {new Date().toLocaleDateString()} {/* Mock date */}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-[var(--gray-900)]">${bill.amount}</td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="success">Paid</Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Button variant="ghost" size="sm" className="text-[var(--primary)] hover:bg-blue-50">
                                                        <FiDownload className="mr-2" /> Receipt
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
