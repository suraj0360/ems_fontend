import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (error) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="flex-center" style={{ minHeight: '80vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1.75rem' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Login to access your account</p>
                </div>

                {error && (
                    <div style={{
                        padding: '0.75rem',
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        borderRadius: 'var(--radius)',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Input
                        id="email"
                        label="Email Address"
                        type="email"
                        placeholder="user@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button className="btn-primary" type="submit" style={{ marginTop: '0.5rem', width: '100%' }}>
                        Sign In
                    </Button>

                    <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Register</Link>
                    </p>
                </form>

                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Demo Credentials:</p>
                    <p>User: user@example.com / password123</p>
                    <p>Organizer: organizer@example.com / password123</p>
                    <p>Admin: admin@example.com / password123</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
