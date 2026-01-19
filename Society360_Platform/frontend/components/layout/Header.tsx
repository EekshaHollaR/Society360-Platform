'use client';

import { FiMenu, FiBell, FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '@/lib/store/authStore';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
    onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const { user, logout } = useAuthStore();

    return (
        <header className="h-16 bg-white border-b border-[var(--gray-200)] px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
            {/* Left Section */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden text-[var(--gray-600)] hover:text-[var(--gray-900)] transition-colors"
                >
                    <FiMenu size={24} />
                </button>

                <div>
                    <h2 className="text-lg font-semibold text-[var(--gray-900)]">
                        Welcome back, {user?.full_name?.split(' ')[0] || user?.first_name || 'User'}!
                    </h2>
                    <p className="text-sm text-[var(--gray-500)]">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="relative p-2 text-[var(--gray-600)] hover:text-[var(--gray-900)] hover:bg-[var(--gray-100)] rounded-lg transition-all">
                    <FiBell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--error)] rounded-full"></span>
                </button>

                {/* Logout Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="hidden sm:flex"
                >
                    <FiLogOut size={18} className="mr-2" />
                    Logout
                </Button>

                {/* Mobile Logout */}
                <button
                    onClick={logout}
                    className="sm:hidden p-2 text-[var(--gray-600)] hover:text-[var(--gray-900)] hover:bg-[var(--gray-100)] rounded-lg transition-all"
                >
                    <FiLogOut size={20} />
                </button>
            </div>
        </header>
    );
};
