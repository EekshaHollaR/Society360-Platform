'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiX } from 'react-icons/fi';
import { getNavigationForRole } from '@/lib/navigation/routes';
import { useAuthStore } from '@/lib/store/authStore';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const pathname = usePathname();
    const { user } = useAuthStore();

    const navigation = user ? getNavigationForRole(user.role) : [];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-[var(--gray-200)]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-0
        `}
            >
                {/* Logo Header */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-[var(--gray-200)]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[var(--primary)] rounded-lg flex items-center justify-center shadow-md">
                            <span className="text-xl font-bold text-white">S</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-[var(--gray-900)]">Society360</h1>
                            <p className="text-xs text-[var(--gray-500)]">by Civora</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden text-[var(--gray-500)] hover:text-[var(--gray-700)]"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 overflow-y-auto">
                    <ul className="space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={() => onClose()}
                                        className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                      ${isActive
                                                ? 'bg-[var(--primary)] text-white shadow-md'
                                                : 'text-[var(--gray-700)] hover:bg-[var(--gray-100)]'
                                            }
                    `}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* User Info */}
                {user && (
                    <div className="p-4 border-t border-[var(--gray-200)]">
                        <div className="flex items-center gap-3 px-3 py-2 bg-[var(--gray-50)] rounded-lg">
                            <div className="w-10 h-10 bg-[var(--secondary)] rounded-full flex items-center justify-center text-white font-semibold">
                                {user.full_name?.[0] || user.first_name?.[0] || user.email[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[var(--gray-900)] truncate">
                                    {user.full_name || `${user.first_name} ${user.last_name}` || user.email}
                                </p>
                                <p className="text-xs text-[var(--gray-500)] capitalize">{user.role}</p>
                            </div>
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
};
