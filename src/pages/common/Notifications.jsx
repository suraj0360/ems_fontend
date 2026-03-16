import { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

const Notifications = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const data = await notificationService.getNotifications();
            if (data && data.data) {
                setNotifications(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchNotifications();
    }, [user, navigate]);

    const handleMarkAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(notifications.map(n =>
                n._id === id ? { ...n, read: true } : n
            ));
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            handleMarkAsRead(notification._id);
        }
        if (notification.link) {
            navigate(notification.link);
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '2rem 0', textAlign: 'center' }}>
                <p>Loading notifications...</p>
            </div>
        );
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="container" style={{ padding: '2rem 0', maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                <h1 style={{ fontSize: '2rem', margin: 0 }}>Notifications</h1>
                {unreadCount > 0 && (
                    <Button variant="outline" onClick={handleMarkAllAsRead}>
                        Mark all as read
                    </Button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No notifications</p>
                    <p>You're all caught up!</p>
                </div>
            ) : (
                <div className="card" style={{ overflow: 'hidden' }}>
                    {notifications.map((notification, index) => (
                        <div
                            key={notification._id}
                            onClick={() => handleNotificationClick(notification)}
                            style={{
                                padding: '1.5rem',
                                borderBottom: index < notifications.length - 1 ? '1px solid var(--border)' : 'none',
                                backgroundColor: notification.read ? 'transparent' : 'rgba(79, 70, 229, 0.05)',
                                cursor: 'pointer',
                                display: 'flex',
                                gap: '1rem',
                                transition: 'background-color 0.2s'
                            }}
                            className="text-hover"
                        >
                            <div style={{ flex: 1 }}>
                                <div style={{
                                    fontSize: '1.1rem',
                                    color: notification.read ? 'var(--text-secondary)' : 'var(--text-primary)',
                                    fontWeight: notification.read ? 'normal' : '500',
                                    marginBottom: '0.5rem'
                                }}>
                                    {notification.message}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    {new Date(notification.createdAt).toLocaleString(undefined, {
                                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </div>
                            </div>
                            {!notification.read && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleMarkAsRead(notification._id);
                                    }}
                                    style={{
                                        background: 'none', border: 'none', color: 'var(--primary)',
                                        cursor: 'pointer', padding: '0.5rem', alignSelf: 'center',
                                        fontSize: '1.2rem'
                                    }}
                                    title="Mark as read"
                                >
                                    ✓
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
