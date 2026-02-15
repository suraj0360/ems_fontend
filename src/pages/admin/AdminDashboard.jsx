import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { userService } from '../../services/userService';
import { analyticsService } from '../../services/analyticsService';
import Button from '../../components/ui/Button';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('events');

    const fetchData = async () => {
        try {
            const [eventsData, usersData, statsData] = await Promise.all([
                eventService.getAllEvents(),
                userService.getAllUsers(),
                analyticsService.getDashboardStats()
            ]);
            setEvents(eventsData.data); // getAllEvents returns obj with data
            setUsers(usersData);
            setStats(statsData);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchEvents = async () => {
        const { data } = await eventService.getAllEvents();
        setEvents(data);
    };

    const handleStatusChange = async (id, status) => {
        try {
            await eventService.updateEvent(id, { status });
            fetchEvents();
        } catch (error) {
            alert('Update failed');
        }
    };

    const handleBlockUser = async (id, currentStatus) => {
        if (!confirm(`Are you sure you want to ${currentStatus ? 'unblock' : 'block'} this user?`)) return;
        try {
            await userService.toggleBlockUser(id, !currentStatus);
            fetchData();
        } catch (error) {
            alert('Failed to update user status');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            await userService.deleteUser(id);
            fetchData();
        } catch (error) {
            alert('Failed to delete user');
        }
    };

    const handleDeleteEvent = async (id) => {
        if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
        try {
            await eventService.deleteEvent(id);
            fetchData();
        } catch (error) {
            alert('Failed to delete event');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'APPROVED': return 'badge-success';
            case 'REJECTED': return 'badge-danger';
            default: return 'badge-warning';
        }
    };

    return (
        <div>
            <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Admin Dashboard</h1>

            {stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>{stats.totalUsers}</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Total Users</p>
                    </div>
                    <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '2.5rem', color: 'var(--role-organizer)', marginBottom: '0.5rem' }}>{stats.totalEvents}</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Total Events</p>
                    </div>
                    <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '2.5rem', color: '#16a34a', marginBottom: '0.5rem' }}>₹{stats.revenue || 0}</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Total Revenue</p>
                    </div>
                </div>
            )}

            <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <button
                    className={`btn ${activeTab === 'events' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setActiveTab('events')}
                >
                    Manage Events
                </button>
                <button
                    className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setActiveTab('users')}
                >
                    Manage Users
                </button>
            </div>

            {activeTab === 'events' && (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Organizer</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event._id}>
                                    <td style={{ fontWeight: 500 }}>{event.title}</td>
                                    <td>
                                        {event.organizer?.name || 'Unknown'}
                                        <div style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>{event.organizer?.email}</div>
                                    </td>
                                    <td>{new Date(event.date).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge ${getStatusBadge(event.status)}`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Button onClick={() => navigate(`/event/${event._id}`)} className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                                                View
                                            </Button>
                                            {event.status === 'PENDING' && (
                                                <>
                                                    <Button onClick={() => handleStatusChange(event._id, 'APPROVED')} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', backgroundColor: '#16a34a', color: 'white' }}>
                                                        Approve
                                                    </Button>
                                                    <Button onClick={() => handleStatusChange(event._id, 'REJECTED')} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', backgroundColor: '#dc2626', color: 'white' }}>
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                            {event.status !== 'PENDING' && (
                                                <span className="badge badge-info" style={{ background: 'transparent' }}>
                                                    Processed
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td style={{ fontWeight: 500 }}>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Button
                                                variant={u.isBlocked ? "success" : "warning"}
                                                size="small"
                                                onClick={() => handleBlockUser(u._id || u.id, u.isBlocked)}
                                            >
                                                {u.isBlocked ? 'Unblock' : 'Block'}
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="small"
                                                onClick={() => handleDeleteUser(u._id || u.id)}
                                            >
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
export default AdminDashboard;
