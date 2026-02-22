import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';
import { analyticsService } from '../../services/analyticsService';
import { contactService } from '../../services/contactService';
import Button from '../../components/ui/Button';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import SuccessModal from '../../components/ui/SuccessModal';
import AlertModal from '../../components/ui/AlertModal';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [users, setUsers] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('events');
    const currentUser = authService.getCurrentUser();

    // Modal States
    const [modalState, setModalState] = useState({
        type: null, // 'confirm', 'success', 'error'
        title: '',
        message: '',
        action: null // function to execute on confirm
    });

    const fetchData = async () => {
        try {
            const [eventsData, usersData, statsData, contactsData] = await Promise.all([
                eventService.getAllEvents(),
                userService.getAllUsers(),
                analyticsService.getDashboardStats(),
                contactService.getAllContacts()
            ]);
            setEvents(eventsData.data); // getAllEvents returns obj with data
            setUsers(usersData);
            setStats(statsData);
            setContacts(contactsData.data || []);
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

    const closeModal = () => {
        setModalState(prev => ({ ...prev, type: null }));
    };

    const showSuccess = (message) => {
        setModalState({
            type: 'success',
            title: 'Success',
            message,
            action: null
        });
    };

    const showError = (message) => {
        setModalState({
            type: 'error',
            title: 'Error',
            message,
            action: null
        });
    };

    const handleConfirmAction = async () => {
        if (modalState.action) {
            await modalState.action();
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await eventService.updateEvent(id, { status });
            fetchEvents();
            showSuccess(`Event ${status.toLowerCase()} successfully`);
        } catch (error) {
            showError('Failed to update event status');
        }
    };

    const handleBlockUser = (id, currentStatus) => {
        setModalState({
            type: 'confirm',
            title: currentStatus ? 'Unblock User?' : 'Block User?',
            message: `Are you sure you want to ${currentStatus ? 'unblock' : 'block'} this user?`,
            action: async () => {
                try {
                    await userService.toggleBlockUser(id, !currentStatus);
                    fetchData();
                    showSuccess(`User ${currentStatus ? 'unblocked' : 'blocked'} successfully`);
                } catch (error) {
                    showError('Failed to update user status');
                }
            }
        });
    };

    const handleDeleteUser = (id) => {
        setModalState({
            type: 'confirm',
            title: 'Delete User?',
            message: 'Are you sure you want to delete this user? This action cannot be undone.',
            action: async () => {
                try {
                    await userService.deleteUser(id);
                    fetchData();
                    showSuccess('User deleted successfully');
                } catch (error) {
                    showError('Failed to delete user');
                }
            }
        });
    };

    const handleDeleteEvent = (id) => {
        setModalState({
            type: 'confirm',
            title: 'Delete Event?',
            message: 'Are you sure you want to delete this event? This action cannot be undone.',
            action: async () => {
                try {
                    await eventService.deleteEvent(id);
                    fetchData();
                    showSuccess('Event deleted successfully');
                } catch (error) {
                    showError('Failed to delete event');
                }
            }
        });
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
                <button
                    className={`btn ${activeTab === 'contacts' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setActiveTab('contacts')}
                >
                    Contact Forms
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
                                        <Button onClick={() => navigate(`/event/${event._id}`)} className="btn-outline" 
                                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                                            View
                                            </Button>
                                            {event.status === 'PENDING' && (
                                                <>
                                            <Button onClick={() => handleStatusChange(event._id, 'APPROVED')} style={{ padding: '0.4rem 0.8rem', 
                                                fontSize: '0.85rem', backgroundColor: '#16a34a', color: 'white' }}>
                                                    Approve
                                                </Button>
                                                <Button onClick={() => handleStatusChange(event._id, 'REJECTED')} style={{ padding: '0.4rem 0.8rem',
                                                     fontSize: '0.85rem', backgroundColor: '#dc2626', color: 'white' }}>
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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(users) && users.map((u) => (
                                <tr key={u._id || u.id}>
                                    <td style={{ fontWeight: 500 }}>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        <span className={`badge ${u.role === 'ADMIN' ? 'badge-primary' : 'badge-ghost'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Button
                                                variant={u.isBlocked ? "success" : "warning"}
                                                size="small"
                                                onClick={() => handleBlockUser(u._id || u.id, u.isBlocked)}
                                                disabled={u.role === 'ADMIN'}
                                                style={u.role === 'ADMIN' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                                title={u.role === 'ADMIN' ? "Cannot block an admin" : ""}
                                            >
                                                {u.isBlocked ? 'Unblock' : 'Block'}
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="small"
                                                onClick={() => handleDeleteUser(u._id || u.id)}
                                                disabled={u.role === 'ADMIN'}
                                                style={u.role === 'ADMIN' ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                                title={u.role === 'ADMIN' ? "Cannot delete an admin" : ""}
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

            {/* Modals */}
            <ConfirmationModal
                isOpen={modalState.type === 'confirm'}
                onClose={closeModal}
                onConfirm={handleConfirmAction}
                title={modalState.title}
                message={modalState.message}
            />
            <SuccessModal
                isOpen={modalState.type === 'success'}
                onClose={closeModal}
                title={modalState.title}
                message={modalState.message}
            />
            <AlertModal
                isOpen={modalState.type === 'error'}
                onClose={closeModal}
                title={modalState.title}
                message={modalState.message}
                type="danger"
            />
        </div>
    );
};
export default AdminDashboard;
