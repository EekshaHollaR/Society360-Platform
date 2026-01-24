import api from './auth';

// Types
export interface Visitor {
    id: string;
    name: string;
    phone_number: string;
    visitor_type: 'guest' | 'delivery' | 'service';
    expected_arrival?: string;
    status: 'pending' | 'approved' | 'denied' | 'checked_in' | 'checked_out';
    purpose?: string;
    check_in_time?: string;
    check_out_time?: string;
    created_at?: string;
    unit_id?: string;
}

export interface Ticket {
    id: string;
    category: 'electrical' | 'plumbing' | 'appliance' | 'common_area' | 'other';
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    title: string;
    description: string;
    created_at: string;
    updated_at?: string;
    unit_id?: string;
}

export interface Bill {
    id: string;
    amount: number;
    due_date: string;
    status: 'paid' | 'unpaid' | 'overdue';
    period_start: string;
    period_end: string;
    bill_type: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    is_read: boolean;
    created_at: string;
}

// API Service
export const residentApi = {
    // Visitor Management
    getVisitors: async () => {
        return api.get('/visitors/history');
    },

    getPendingVisitors: async () => {
        return api.get('/visitors/pending');
    },

    preApproveVisitor: async (data: Partial<Visitor>) => {
        return api.post('/visitors/pre-approve', data);
    },

    checkInVisitor: async (id: string) => {
        return api.post('/visitors/check-in', { visitorId: id });
    },

    checkOutVisitor: async (id: string) => {
        return api.post('/visitors/check-out', { visitorId: id });
    },

    // Maintenance Tickets
    getTickets: async () => {
        return api.get('/maintenance');
    },

    createTicket: async (data: Partial<Ticket>) => {
        return api.post('/maintenance', data);
    },

    // Finance/Bills
    getBills: async (unitId: string) => {
        return api.get('/finance', { params: { unit_id: unitId } });
    },

    payBill: async (billId: string, amount: number, paymentMethod: string) => {
        return api.post('/finance/pay', { bill_id: billId, amount, payment_method: paymentMethod });
    },

    getReceipt: async (paymentId: string) => {
        return api.get(`/finance/receipt/${paymentId}`);
    },

    // Announcements
    getAnnouncements: async () => {
        return api.get('/communication/announcements');
    },

    // Notifications
    getNotifications: async () => {
        return api.get('/communication/notifications');
    },

    markNotificationRead: async (id: string) => {
        return api.put(`/communication/notifications/${id}/read`);
    }
};
