import { useState, useEffect } from 'react';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../hooks/useAuth';
import Button from './ui/Button';

const ReviewSection = ({ eventId, eventDate }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ avgRating: 0, numReviews: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    const [hover, setHover] = useState(0);

    const hasReviewed = reviews.some(r => r.user?._id === user?._id || r.user === user?._id);

    useEffect(() => {
        fetchReviews();
    }, [eventId]);

    const fetchReviews = async () => {
        try {
            const data = await reviewService.getEventReviews(eventId);
            setReviews(data.data || []);
            setStats(data.stats || { avgRating: 0, numReviews: 0 });
        } catch (err) {
            setError('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        if (rating === 0) {
            setFormError('Please select a star rating.');
            return;
        }

        setSubmitting(true);
        try {
            await reviewService.createReview({ eventId, rating: Number(rating), comment });
            setRating(0);
            setComment('');
            // Refresh reviews to show new one
            await fetchReviews();
        } catch (err) {
            setFormError(err.response?.data?.message || err.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Loading reviews...</div>;

    return (
        <div className="card" style={{ padding: '2rem', marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Reviews</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem', color: '#fbbf24' }}>★</span>
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                        {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : 'No Rating'}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>
                        ({stats.numReviews} review{stats.numReviews !== 1 ? 's' : ''})
                    </span>
                </div>
            </div>

            {error && <div style={{ color: 'var(--role-admin)', marginBottom: '1rem' }}>{error}</div>}

            {user && user.role === 'USER' && (
                new Date(eventDate) > new Date() ? (
                    <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius)', textAlign: 'center', marginBottom: '2rem', border: '1px dashed var(--border)' }}>
                        <p style={{ color: 'var(--text-muted)' }}>You will be able to leave a review once the event has concluded.</p>
                    </div>
                ) : hasReviewed ? (
                    <div style={{ padding: '1rem', background: 'var(--bg-body)', borderRadius: 'var(--radius)', textAlign: 'center', marginBottom: '2rem', border: '1px solid var(--border)' }}>
                        <p style={{ margin: 0, color: 'var(--text-success)', fontWeight: '500' }}>✓ You have already shared your feedback for this event. Thank you!</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1rem', background: 'var(--bg-body)', borderRadius: 'var(--radius)' }}>
                        <h4 style={{ margin: '0 0 1rem 0' }}>Leave a Review</h4>
                        {formError && <div style={{ color: 'var(--role-admin)', marginBottom: '1rem', fontSize: '0.9rem' }}>{formError}</div>}
                        <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Rating</label>
                                <div style={{ display: 'flex', gap: '0.2rem', cursor: 'pointer' }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHover(star)}
                                            onMouseLeave={() => setHover(0)}
                                            style={{
                                                fontSize: '1.8rem',
                                                color: star <= (hover || rating) ? '#fbbf24' : '#e5e7eb',
                                                transition: 'color 0.2s ease-in-out'
                                            }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Comment</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="form-input"
                                    style={{ minHeight: '80px', resize: 'vertical' }}
                                    placeholder="Share your experience..."
                                    required
                                />
                            </div>
                        </div>
                        <Button type="submit" className="btn-primary" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </Button>
                    </form>
                )
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reviews.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No reviews yet. Be the first to review!</p>
                ) : (
                    reviews.map(review => (
                        <div key={review._id} style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <div style={{ fontWeight: 'bold' }}>{review.user?.name || 'Anonymous User'}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <div style={{ color: '#fbbf24', marginBottom: '0.5rem' }}>
                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                            </div>
                            <p style={{ margin: 0, lineHeight: '1.5', color: 'var(--text-secondary)' }}>{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div >
    );
};

export default ReviewSection;
