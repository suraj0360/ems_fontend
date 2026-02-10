import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 }}>
            <div className="container flex-between" style={{ height: '4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '-0.03em' }} className="text-gradient">
                        EMS
                    </Link>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.95rem', fontWeight: 500 }}>
                        <Link to="/" className="text-hover">Events</Link>
                        {user && user.role === 'USER' && <Link to="/user/dashboard" className="text-hover">Dashboard</Link>}
                        {user && user.role === 'ORGANIZER' && <Link to="/organizer/dashboard" className="text-hover">Organizer</Link>}
                        {user && user.role === 'ADMIN' && <Link to="/admin/dashboard" className="text-hover">Admin</Link>}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {user ? (
                        <>
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
