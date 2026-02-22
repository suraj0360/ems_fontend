import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { notificationService } from '../services/notificationService';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const getLinkStyle = (path) => {
        return isActive(path)
            ? { color: 'var(--primary)', fontWeight: '700', borderBottom: '2px solid var(--primary)' }
            : { color: 'inherit' };
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    // Fetch Notifications
    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const data = await notificationService.getNotifications();
            if (data && data.data) {
                setNotifications(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Setup polling every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [user]);

    // Handle outside click for dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAsRead = async (id, e) => {
        e.stopPropagation();
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
            setShowNotifications(false);
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            handleMarkAsRead(notification._id, { stopPropagation: () => { } });
        }
        setShowNotifications(false);
        if (notification.link) {
            navigate(notification.link);
        }
    };

    return (
        <nav style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 }}>
            <div className="container flex-between" style={{ height: '4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '-0.03em' }} className="text-gradient">
                        EMS
                    </Link>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.95rem', fontWeight: 500, height: '4rem', alignItems: 'center' }}>

                        <Link to="/about" className="text-hover" style={{ ...getLinkStyle('/about'), display: 'flex', alignItems: 'center', height: '100%' }}>About</Link>
                        <Link to="/contact" className="text-hover" style={{ ...getLinkStyle('/contact'), display: 'flex', alignItems: 'center', height: '100%' }}>Contact</Link>
                        {user && user.role === 'USER' && <Link to="/user/dashboard" className="text-hover" style={{ ...getLinkStyle('/user/dashboard'), display: 'flex', alignItems: 'center', height: '100%' }}>Dashboard</Link>}
                        {user && user.role === 'ORGANIZER' && <Link to="/organizer/dashboard" className="text-hover" style={{ ...getLinkStyle('/organizer/dashboard'), display: 'flex', alignItems: 'center', height: '100%' }}>Organizer</Link>}
                        {user && user.role === 'ADMIN' && <Link to="/admin/dashboard" className="text-hover" style={{ ...getLinkStyle('/admin/dashboard'), display: 'flex', alignItems: 'center', height: '100%' }}>Admin</Link>}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {user ? (
                        <>
                            {/* Notification Bell */}
                            <div ref={notificationRef} style={{ position: 'relative', marginRight: '1rem' }}>
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    style={{
                                        background: 'transparent', border: 'none', cursor: 'pointer',
                                        fontSize: '1.2rem', position: 'relative', display: 'flex', alignItems: 'center'
                                    }}
                                >
                                    🔔
                                    {unreadCount > 0 && (
                                        <span style={{
                                            position: 'absolute', top: '-5px', right: '-8px',
                                            backgroundColor: 'var(--primary)', color: 'white',
                                            borderRadius: '50%', padding: '0.1rem 0.4rem',
                                            fontSize: '0.7rem', fontWeight: 'bold'
                                        }}>
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* Dropdown Menu */}
                                {showNotifications && (
                                    <div style={{
                                        position: 'absolute', top: '100%', right: 0, marginTop: '0.8rem',
                                        width: '320px', backgroundColor: 'var(--bg-card)',
                                        border: '1px solid var(--border)', borderRadius: '0.5rem',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', zIndex: 100,
                                        maxHeight: '400px', display: 'flex', flexDirection: 'column'
                                    }}>
                                        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h3 style={{ margin: 0, fontSize: '1rem' }}>Notifications</h3>
                                            {unreadCount > 0 && (
                                                <button onClick={handleMarkAllAsRead} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem' }}>
                                                    Mark all as read
                                                </button>
                                            )}
                                        </div>
                                        <div style={{ overflowY: 'auto', flex: 1 }}>
                                            {notifications.length === 0 ? (
                                                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                    No notifications yet
                                                </div>
                                            ) : (
                                                notifications.map(notification => (
                                                    <div
                                                        key={notification._id}
                                                        onClick={() => handleNotificationClick(notification)}
                                                        style={{
                                                            padding: '1rem', borderBottom: '1px solid var(--border)',
                                                            backgroundColor: notification.read ? 'transparent' : 'rgba(79, 70, 229, 0.05)',
                                                            cursor: 'pointer', display: 'flex', gap: '0.8rem',
                                                            transition: 'background-color 0.2s'
                                                        }}
                                                        className="notification-item"
                                                    >
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontSize: '0.9rem', color: notification.read ? 'var(--text-secondary)' : 'var(--text-primary)', fontWeight: notification.read ? 'normal' : '500', marginBottom: '0.3rem' }}>
                                                                {notification.message}
                                                            </div>
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                                {new Date(notification.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                        </div>
                                                        {!notification.read && (
                                                            <button
                                                                onClick={(e) => handleMarkAsRead(notification._id, e)}
                                                                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '0.2rem' }}
                                                                title="Mark as read"
                                                            >
                                                                ✓
                                                            </button>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <div style={{ padding: '0.5rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                                            <Link to="/notifications" onClick={() => setShowNotifications(false)} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
                                                View All
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Hi, {user.name}</span>
                            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-ghost">Login</Link>
                            <Link to="/register" className="btn btn-primary">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
