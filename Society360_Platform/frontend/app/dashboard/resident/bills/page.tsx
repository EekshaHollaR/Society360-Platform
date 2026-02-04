'use client';

import { useState, useEffect } from 'react';
import { FiClock, FiDownload } from 'react-icons/fi';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { residentApi, Bill } from '@/lib/api/resident';

export default function BillsPage() {
    const [bills, setBills] = useState<Bill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [payingId, setPayingId] = useState<string | null>(null);

    const fetchBills = async () => {
        try {
            const response = await residentApi.getBills();
            if (response.data.success) {
                setBills(response.data.data);
            }
        } catch {
            toast.error('Failed to load bills');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBills();
    }, []);

    const handlePay = async (id: string, amount: number) => {
        setPayingId(id);
        setTimeout(() => {
            toast.success(`Payment of $${amount} successful`);
            setBills(prev =>
                prev.map(b => (b.id === id ? { ...b, status: 'paid' } : b))
            );
            setPayingId(null);
        }, 1500);
    };

    const outstandingBills = bills.filter(b => b.status !== 'paid');
    const pastBills = bills.filter(b => b.status === 'paid');
    const totalDue = outstandingBills.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-white">
                    Bills & Payments
                </h1>
                <p className="text-sm text-slate-400">
                    Track dues and manage your payments
                </p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-16">
                    <div className="relative">
                        <div className="h-8 w-8 rounded-full border-2 border-white/10" />
                        <div className="absolute inset-0 h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                    </div>
                </div>
            ) : (
                <>
                    {/* Summary */}
                    <Card className="bg-[#0b1220] border border-white/10 px-6 py-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <p className="text-slate-400 text-sm mb-1">
                                    Total Outstanding
                                </p>
                                <h2 className="text-3xl font-bold text-white">
                                    ${totalDue.toFixed(2)}
                                </h2>
                                <p className="text-xs text-slate-500 mt-1">
                                    {outstandingBills.length} pending bill(s)
                                </p>
                            </div>

                            {outstandingBills.length > 0 && (
                                <Button
                                    size="lg"
                                    onClick={() =>
                                        outstandingBills[0] &&
                                        handlePay(
                                            outstandingBills[0].id,
                                            outstandingBills[0].amount
                                        )
                                    }
                                    isLoading={!!payingId}
                                    className="bg-indigo-500 hover:bg-indigo-400"
                                >
                                    Pay All Now
                                </Button>
                            )}
                        </div>
                    </Card>

                    {/* Pending Bills */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white">
                            Pending Bills
                        </h3>

                        {outstandingBills.length === 0 ? (
                            <p className="text-slate-400 italic">
                                You’re all caught up 🎉
                            </p>
                        ) : (
                            outstandingBills.map(bill => (
                                <Card
                                    key={bill.id}
                                    className="bg-[#0b1220] border border-white/10 px-5 py-4 hover:border-white/20 transition"
                                >
                                    <div className="flex flex-col sm:flex-row justify-between gap-4">

                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-white font-semibold">
                                                    {bill.bill_type} Bill
                                                </h4>
                                                <Badge className="bg-orange-500/10 text-orange-400 border border-orange-500/20">
                                                    Unpaid
                                                </Badge>
                                            </div>

                                            <p className="text-xs text-slate-500">
                                                {bill.period_start} → {bill.period_end}
                                            </p>

                                            <div className="flex items-center gap-2 mt-2 text-sm text-red-400">
                                                <FiClock />
                                                Due {new Date(bill.due_date).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className="text-xl font-bold text-white">
                                                ${bill.amount}
                                            </span>
                                            <Button
                                                onClick={() =>
                                                    handlePay(bill.id, bill.amount)
                                                }
                                                isLoading={payingId === bill.id}
                                                disabled={!!payingId}
                                                className="bg-indigo-500 hover:bg-indigo-400"
                                            >
                                                Pay Now
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Payment History */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white">
                            Payment History
                        </h3>

                        {pastBills.length === 0 ? (
                            <p className="text-slate-400 italic">
                                No payment history yet.
                            </p>
                        ) : (
                            <div className="bg-[#0b1220] border border-white/10 rounded-xl overflow-hidden">

                                <table className="w-full text-sm">
                                    <thead className="border-b border-white/10 text-slate-400">
                                        <tr>
                                            <th className="px-5 py-4 text-left">Description</th>
                                            <th className="px-5 py-4 text-left">Date</th>
                                            <th className="px-5 py-4 text-left">Amount</th>
                                            <th className="px-5 py-4 text-left">Status</th>
                                            <th className="px-5 py-4 text-left">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-white/5">
                                        {pastBills.map(bill => (
                                            <tr
                                                key={bill.id}
                                                className="hover:bg-white/5 transition"
                                            >
                                                <td className="px-5 py-4 text-white">
                                                    <div className="font-medium">
                                                        {bill.bill_type}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {bill.period_start} → {bill.period_end}
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 text-slate-400">
                                                    {new Date().toLocaleDateString()}
                                                </td>

                                                <td className="px-5 py-4 text-white font-medium">
                                                    ${bill.amount}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <Badge className="bg-green-500/10 text-green-400 border border-green-500/20">
                                                        Paid
                                                    </Badge>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-indigo-400 hover:bg-white/5"
                                                    >
                                                        <FiDownload className="mr-2" />
                                                        Receipt
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
