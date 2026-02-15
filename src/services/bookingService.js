import api from './api';

export const bookingService = {
    getAllBookings: async () => { // For admin? Or generic
        // Backend didn't specify a generic all bookings for admin in the first pass, 
        // but likely `findAllByUser` is what we want for "my bookings"
        return await bookingService.getUserBookings();
    },

    getUserBookings: async () => {
        const response = await api.get('/bookings/my-bookings');
        return response.data;
    },

    createBooking: async (bookingData) => {
        const response = await api.post('/bookings', bookingData);
        return response.data;
    },

    cancelBooking: async (id) => {
        const response = await api.patch(`/bookings/${id}/cancel`);
        return response.data;
    }
};
