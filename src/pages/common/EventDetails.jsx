import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { ticketService } from '../../services/ticketService';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventData, ticketsData] = await Promise.all([
                    eventService.getEventById(id),
                    ticketService.getTicketsByEventId(id)
                ]);
                setEvent(eventData);
                setTickets(ticketsData);
            } catch (err) {
                setError('Event not found');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleBook = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate(`/booking/${event._id}`);
    };

    const handleStatusChange = async (status) => {
        try {
            await eventService.updateEvent(event._id, { status });
            // Refresh event data locally
            setEvent({ ...event, status });
        } catch (error) {
            alert('Update failed');
        }
    };

    if (loading) return <div className="flex-center" style={{ minHeight: '50vh' }}>Loading...</div>;
    if (error) return <div className="container" style={{ padding: '2rem', textAlign: 'center', color: 'var(--role-admin)' }}>{error}</div>;
    if (!event) return null;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{
                height: '400px',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                marginBottom: '2rem',
                boxShadow: 'var(--shadow-lg)',
                position: 'relative'
            }}>
                <img
                    src={event.image || 'https://via.placeholder.com/800x400'}
                    alt={event.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    padding: '2rem',
                    color: 'white'
                }}>
                    <span className="badge badge-info" style={{ marginBottom: '0.5rem', background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(4px)' }}>
                        {event.category}
                    </span>
                    <h1 style={{ fontSize: '3rem', color: 'white', marginBottom: '0.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{event.title}</h1>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div>
                    <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>About this Event</h3>
                        <p style={{ lineHeight: '1.8', color: 'var(--text-muted)' }}>{event.description}</p>
                    </div>

                    <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'var(--bg-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                            👤
                        </div>
                        <div>
                            <h4 style={{ margin: 0 }}>Organizer</h4>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                {event.organizer?.name || 'Unknown'}
                                <span style={{ fontSize: '0.8em', opacity: 0.7 }}> ({event.organizer?._id || event.organizer})</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Date & Time</p>
                            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{new Date(event.date).toLocaleDateString()}</p>
                            <p style={{ fontSize: '1rem' }}>{event.time}</p>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Location</p>
                            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{event.location}</p>
                        </div>
                        <div style={{ marginBottom: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Price</p>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                {event.price > 0 ? `₹${event.price}` : 'Free'}
                            </div>
                        </div>

                        {/* Ticket Info Section */}
                        <div style={{ marginBottom: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Tickets Available</p>
                            {tickets.length > 0 ? (
                                tickets.map(t => (
                                    <div key={t._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span>{t.name}</span>
                                        <span style={{ fontWeight: 600, color: t.quantity > 0 ? 'var(--text-main)' : 'var(--role-admin)' }}>
                                            {t.quantity > 0 ? t.quantity : 'Sold Out'}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p>No ticket info available</p>
                            )}
                        </div>

                        {(!user || user.role === 'USER') && (
                            <Button onClick={handleBook} className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
                                Book Tickets
                            </Button>
                        )}

                        {/* Admin Controls */}
                        {user && user.role === 'ADMIN' && (
                            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Admin Actions</p>
                                {event.status === 'PENDING' ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <Button
                                            onClick={() => handleStatusChange('APPROVED')}
                                            style={{ backgroundColor: '#16a34a', color: 'white', justifyContent: 'center' }}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            onClick={() => handleStatusChange('REJECTED')}
                                            style={{ backgroundColor: '#dc2626', color: 'white', justifyContent: 'center' }}
                                        >
                                            Reject
                                        </Button>
                                    </div>
                                ) : (
                                    <div className={`badge ${event.status === 'APPROVED' ? 'badge-success' : 'badge-danger'
                                        }`} style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
                                        Event is {event.status}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default EventDetails;
