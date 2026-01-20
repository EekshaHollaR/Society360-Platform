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

export interface Announcement {
    id: string;
    title: string;
    content: string;
    priority: 'high' | 'normal';
    created_at: string;
    category: string;
}

// API Service
export const residentApi = {
    // Visitor Management
    getVisitors: async () => {
        // return api.get<Visitor[]>('/visitors/my-visitors'); 
        // Mocking for now to ensure UI works without full backend setup on this machine
        return {
            data: {
                success: true, data: [
                    { id: '1', name: 'John Doe', phone_number: '1234567890', visitor_type: 'guest', status: 'pending', expected_arrival: '2024-01-25T10:00:00Z', purpose: 'Family visit' },
                    { id: '2', name: 'Amazon Delivery', phone_number: '9876543210', visitor_type: 'delivery', status: 'checked_out', check_in_time: '2024-01-20T14:00:00Z', check_out_time: '2024-01-20T14:15:00Z' }
                ]
            }
        };
    },

    preApproveVisitor: async (data: Partial<Visitor>) => {
        // return api.post('/visitors/pre-approve', data);
        return { data: { success: true, data: { ...data, id: Date.now().toString(), status: 'pending' } } };
    },

    cancelVisitor: async (id: string) => {
        // return api.put(`/visitors/${id}/cancel`);
        return { data: { success: true } };
    },

    // Maintenance Tickets
    getTickets: async () => {
        // return api.get<Ticket[]>('/maintenance/my-tickets');
        return {
            data: {
                success: true, data: [
                    { id: '1', title: 'Leaking Tap', category: 'plumbing', priority: 'medium', status: 'open', description: 'Kitchen sink tap is leaking continuously.', created_at: '2024-01-21T09:00:00Z' },
                    { id: '2', title: 'Street Light Flicker', category: 'common_area', priority: 'low', status: 'resolved', description: 'Light outside block A is flickering.', created_at: '2024-01-15T18:00:00Z' }
                ]
            }
        };
    },

    createTicket: async (data: Partial<Ticket>) => {
        // return api.post('/maintenance/create', data);
        return { data: { success: true, data: { ...data, id: Date.now().toString(), status: 'open', created_at: new Date().toISOString() } } };
    },

    // Finance/Bills
    getBills: async () => {
        // return api.get<Bill[]>('/finance/my-bills');
        return {
            data: {
                success: true, data: [
                    { id: '1', amount: 1500, due_date: '2024-02-05T00:00:00Z', status: 'unpaid', period_start: '2024-01-01', period_end: '2024-01-31', bill_type: 'Maintenance' },
                    { id: '2', amount: 1500, due_date: '2024-01-05T00:00:00Z', status: 'paid', period_start: '2023-12-01', period_end: '2023-12-31', bill_type: 'Maintenance' }
                ]
            }
        };
    },

    // Announcements
    getAnnouncements: async () => {
        // return api.get<Announcement[]>('/communication/announcements');
        return {
            data: {
                success: true, data: [
                    { id: '1', title: 'Lift Maintenance', content: 'Lift A will be under maintenance on 25th Jan from 10 AM to 2 PM.', priority: 'high', category: 'maintenance', created_at: '2024-01-20T10:00:00Z' },
                    { id: '2', title: 'Diwali Celebration', content: 'Join us for the community celebration this weekend!', priority: 'normal', category: 'events', created_at: '2024-01-18T15:00:00Z' }
                ]
            }
        };
    }
};
