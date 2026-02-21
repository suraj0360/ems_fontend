import api from './api';

export const contactService = {
    submitContact: async (data) => {
        const response = await api.post('/contacts', data);
        return response.data;
    },

    getAllContacts: async () => {
        const response = await api.get('/contacts');
        return response.data;
    },

    respondToContact: async (id, responseText) => {
        const response = await api.put(`/contacts/${id}/respond`, { response: responseText });
        return response.data;
    }
};
