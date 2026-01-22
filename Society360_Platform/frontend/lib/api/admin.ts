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
    // User Management
    getUsers: async (params?: { role?: string; status?: string; search?: string; page?: number }) => {
        // return api.get('/admin/users', { params });
        // Mock Data
        return {
            data: {
                success: true, data: [
                    { id: '1', first_name: 'Admin', last_name: 'User', email: 'admin@society360.com', role: 'admin', status: 'active', created_at: '2023-01-01' },
                    { id: '2', first_name: 'John', last_name: 'Doe', email: 'resident@society360.com', role: 'resident', status: 'active', unit_number: 'A-101', created_at: '2023-02-15' },
                    { id: '3', first_name: 'Jane', last_name: 'Smith', email: 'staff@society360.com', role: 'staff', status: 'active', created_at: '2023-03-10' },
                    { id: '4', first_name: 'Bob', last_name: 'Wilson', email: 'bob@example.com', role: 'resident', status: 'inactive', unit_number: 'B-202', created_at: '2023-04-05' },
                ], meta: { total: 4, page: 1, limit: 10 }
            } as any
        };
    },

    createUser: async (data: Partial<User>) => {
        // return api.post('/admin/users', data);
        return { data: { success: true, data: { ...data, id: Date.now().toString(), created_at: new Date().toISOString() } } };
    },

    updateUser: async (id: string, data: Partial<User>) => {
        // return api.put(`/admin/users/${id}`, data);
        return { data: { success: true, data: { id, ...data } } };
    },

    deleteUser: async (id: string) => {
        // return api.delete(`/admin/users/${id}`);
        return { data: { success: true } };
    },

    // Finance
    getFinanceStats: async () => {
        // return api.get('/admin/reports/finance');
        return {
            data: {
                success: true, data: {
                    totalRevenue: 154000,
                    outstandingDues: 12500,
                    totalExpenses: 45000,
                    monthlyRevenue: [
                        { month: 'Jan', amount: 12000 },
                        { month: 'Feb', amount: 19000 },
                        { month: 'Mar', amount: 15000 },
                        { month: 'Apr', amount: 22000 },
                        { month: 'May', amount: 18000 },
                        { month: 'Jun', amount: 25000 },
                    ],
                    recentTransactions: [
                        { id: '1', user: 'John Doe', amount: 1500, date: '2024-01-20', status: 'paid' },
                        { id: '2', user: 'Alice Brown', amount: 1500, date: '2024-01-19', status: 'paid' },
                        { id: '3', user: 'Bob Wilson', amount: 1500, date: '2024-01-18', status: 'pending' },
                    ]
                } as FinanceStats
            }
        };
    },

    // System Config
    getConfig: async () => {
        // return api.get('/admin/config');
        return {
            data: {
                success: true, data: [
                    { key: 'society_name', value: 'Society360 Premium', category: 'general', description: 'Display name of the society' },
                    { key: 'maintenance_fee', value: '1500', category: 'billing', description: 'Monthly maintenance amount' },
                    { key: 'visitor_approval_required', value: 'true', category: 'security', description: 'Require resident approval for filtered visitors' },
                    { key: 'support_email', value: 'support@society360.com', category: 'general', description: 'Contact email for support' },
                ] as SystemConfig[]
            }
        };
    },

    updateConfig: async (key: string, value: string) => {
        // return api.put(`/admin/config/${key}`, { value });
        return { data: { success: true } };
    }
};
