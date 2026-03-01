import api from './api';

export const reviewService = {
    createReview: async (reviewData) => {
        const response = await api.post('/reviews', reviewData);
        return response.data;
    },
    getEventReviews: async (eventId) => {
        const response = await api.get(`/reviews/event/${eventId}`);
        return response.data;
    }
};
