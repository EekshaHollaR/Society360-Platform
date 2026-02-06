import api from './auth';

export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: 'admin' | 'staff' | 'resident';
    status: 'active' | 'inactive' | 'banned';
    phone_number?: string;
    unit_number?: string; // Optional for display
    created_at: string;
}

export interface FinanceStats {
    totalRevenue: number;
    outstandingDues: number;
    totalExpenses: number;
    monthlyRevenue: { month: string; amount: number }[];
    recentTransactions: { id: string; user: string; amount: number; date: string; status: 'paid' | 'pending' }[];
}

export interface SystemConfig {
    key: string;
    value: string;
    category: string;
    description?: string;
}

export const adminApi = {
    // Dashboard & Reports
    getDashboardStats: async () => {
        return api.get('/admin/reports/dashboard');
    },

    getRecentActivity: async () => {
        return api.get('/admin/audit-logs/recent?limit=10');
    },

    // User Management
    getUsers: async (params?: { role?: string; status?: string; search?: string; page?: number }) => {
        return api.get('/admin/users', { params });
    },

    getUserStats: async () => {
        return api.get('/admin/users/stats');
    },

    createUser: async (data: Partial<User>) => {
        return api.post('/admin/users', data);
    },

    updateUser: async (id: string, data: Partial<User>) => {
        return api.put(`/admin/users/${id}`, data);
    },

    deleteUser: async (id: string) => {
        return api.delete(`/admin/users/${id}`);
    },

    updateUserStatus: async (id: string, status: string) => {
        return api.patch(`/admin/users/${id}/status`, { status });
    },

    updateUserRole: async (id: string, role: string) => {
        return api.patch(`/admin/users/${id}/role`, { role });
    },

    // Finance
    getFinanceStats: async () => {
        return api.get('/admin/reports/finance');
    },

    generateBills: async (data: { period_start: string; period_end: string }) => {
        return api.post('/finance/generate', data);
    },

    // System Config
    getConfig: async () => {
        return api.get('/admin/config');
    },

    updateConfig: async (key: string, value: string) => {
        return api.put(`/admin/config/${key}`, { value });
    },

    // Unit Management
    getUnits: async () => {
        return api.get('/admin/units');
    },

    createUnit: async (data: any) => {
        return api.post('/admin/units', data);
    },

    updateUnit: async (id: string, data: any) => {
        return api.put(`/admin/units/${id}`, data);
    },

    deleteUnit: async (id: string) => {
        return api.delete(`/admin/units/${id}`);
    },
    assignResident: async (unitId: string, data: any) => {
        return api.post(`/admin/units/${unitId}/residents`, data);
    },
    removeResident: async (unitId: string, userId: string) => {
        return api.delete(`/admin/units/${unitId}/residents/${userId}`);
    },

    // Blocks
    getBlocks: async () => {
        return api.get('/admin/blocks');
    },

    createBlock: async (data: any) => {
        return api.post('/admin/blocks', data);
    },

    // Audit Logs
    getAuditLogs: async (params?: any) => {
        return api.get('/admin/audit-logs', { params });
    }
};
