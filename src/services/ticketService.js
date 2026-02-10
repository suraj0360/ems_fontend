import api from './api';

export const ticketService = {
    createTicketType: async (ticketData) => {
        const response = await api.post('/tickets', ticketData);
        return response.data;
    },

    updateTicketType: async (id, updates) => {
        const response = await api.patch(`/tickets/${id}`, updates);
        return response.data;
    },

    deleteTicketType: async (id) => {
        const response = await api.delete(`/tickets/${id}`);
        return response.data;
    },

    getTicketsByEventId: async (eventId) => {
        const response = await api.get(`/tickets?eventId=${eventId}`);
        return response.data;
    }
};
