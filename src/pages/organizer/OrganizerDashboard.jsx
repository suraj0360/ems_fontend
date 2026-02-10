import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { analyticsService } from '../../services/analyticsService';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';

const OrganizerDashboard = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [eventsData, statsData] = await Promise.all([
                eventService.getMyEvents(),
                analyticsService.getDashboardStats()
            ]);
            setEvents(eventsData);
            setStats(statsData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await eventService.deleteEvent(id);
                fetchData(); // Reload
            } catch (error) {
                alert('Failed to delete event');
            }
        }
    };

    if (loading) return <div className="flex-center" style={{ minHeight: '50vh' }}>Loading dashboard...</div>;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': return 'badge-success';
            case 'rejected': return 'badge-danger';
            default: return 'badge-warning';
        }
    };

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Organizer Dashboard</h1>
                <Link to="/organizer/create-event" className="btn btn-primary">
                    + Create New Event
                </Link>
            </div>

            {stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>{stats.totalEvents}</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Total Events</p>
                    </div>
                    <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '2.5rem', color: 'var(--role-organizer)', marginBottom: '0.5rem' }}>{stats.ticketsSold || 0}</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Tickets Sold</p>
                    </div>
                    <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '2.5rem', color: '#16a34a', marginBottom: '0.5rem' }}>₹{stats.revenue || 0}</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Total Revenue</p>
                    </div>
                </div>
            )}

            {events.length === 0 ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <p>You haven't created any events yet.</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event._id}>
                                    <td style={{ fontWeight: 500 }}>{event.title}</td>
                                    <td>{new Date(event.date).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge ${getStatusBadge(event.status)}`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Link to={`/organizer/edit-event/${event._id}`} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                                                Edit
                                            </Link>
                                            <Button variant="danger" onClick={() => handleDelete(event._id)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                                                Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrganizerDashboard;
