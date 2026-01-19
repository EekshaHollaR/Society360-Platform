import { create } from 'zustand';
import { authApi, User } from '../api/auth';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setAuthenticated: (isAuthenticated: boolean) => void;
    setLoading: (isLoading: boolean) => void;
    logout: () => void;
    initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    setUser: (user) => set({ user }),

    setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

    setLoading: (isLoading) => set({ isLoading }),

    logout: () => {
        authApi.logout();
        set({ user: null, isAuthenticated: false });
    },

    initialize: () => {
        const user = authApi.getCurrentUser();
        const isAuthenticated = authApi.isAuthenticated();
        set({ user, isAuthenticated, isLoading: false });
    },
}));
