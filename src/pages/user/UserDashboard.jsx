import { useState, useEffect } from 'react';
import { bookingService } from '../../services/bookingService';
import { eventService } from '../../services/eventService';
import { useAuth } from '../../hooks/useAuth';

const UserDashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const bookings = await bookingService.getUserBookings();
                setBookings(bookings);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchBookings();
    }, [user]);

    if (loading) return <div className="flex-center" style={{ minHeight: '50vh' }}>Loading dashboard...</div>;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'confirmed': return 'badge-success';
            case 'cancelled': return 'badge-danger';
            default: return 'badge-info';
        }
    };

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem' }}>My Dashboard</h1>
            </div>

            <section>
                <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '1.25rem' }}>My Bookings</h2>

                {bookings.length === 0 ? (
                    <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <p>You haven't booked any events yet.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {bookings.map((booking) => (
                            <div key={booking._id} className="card" style={{ padding: '1.5rem', display: 'flex',
                             justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{booking.event.title}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        {new Date(booking.event.date).toLocaleDateString()} &bull; {booking.tickets} Ticket(s)
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column',
                                     alignItems: 'flex-end', gap: '0.5rem' }}>
                                    <div style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--primary)' }}>₹{booking.totalAmount}
                                    </div>
                                    <span className={`badge ${getStatusBadge(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default UserDashboard;
