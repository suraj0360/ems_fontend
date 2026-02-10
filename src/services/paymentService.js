import api from './api';

export const paymentService = {
    processPayment: async (paymentData) => {
        const response = await api.post('/payments/process', paymentData);
        return response.data;
    }
};
