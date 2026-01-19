'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { getDashboardRoute } from '@/lib/navigation/routes';

export default function DashboardPage() {
    const router = useRouter();
    const { user, isLoading } = useAuthStore();

    useEffect(() => {
        if (!isLoading && user) {
            router.replace(getDashboardRoute(user.role));
        } else if (!isLoading && !user) {
            router.replace('/login');
        }
    }, [user, isLoading, router]);

    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
        </div>
    );
}
