'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles = []
}) => {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, initialize } = useAuthStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
                // Redirect to unauthorized or dashboard if role doesn't match
                router.push('/unauthorized'); // Or handle appropriately
            }
        }
    }, [isAuthenticated, isLoading, router, user, allowedRoles]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--gray-50)]">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-[var(--gray-500)] font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect in useEffect
    }

    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
        return null; // Will redirect in useEffect
    }

    return <>{children}</>;
};
