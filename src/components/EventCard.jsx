import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', paddingTop: '56.25%', overflow: 'hidden' }}>
                <img
                    src={event.image || 'https://via.placeholder.com/400x200'}
                    alt={event.title}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="flex-between">
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {event.category}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {new Date(event.date).toLocaleDateString()}
                    </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{event.title}</h3>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5', flex: 1 }}>
                    {event.description.substring(0, 90)}...
                </p>

                <div className="flex-between" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <span style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--text-main)' }}>
                        {event.price > 0 ? `₹${event.price}` : 'Free'}
                    </span>
                    <Link to={`/event/${event._id}`} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
                        Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
