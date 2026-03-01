import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user', companyName: '', bio: '' });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.password) {
            toast.error('All fields are required');
            return;
        }

        if (formData.role === 'organizer' && (!formData.companyName || !formData.bio)) {
            toast.error('Company Name and Bio are required for Organizers');
            return;
        }

        setLoading(true);
        try {
            await register(formData);
            toast.success('Registration successful! Please log in.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-center" style={{ minHeight: '80vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.75rem' }}>Create Account</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Input
                        label="Full Name"
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label="Email Address"
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Password"
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <div className="form-group">
                        <label htmlFor="role" className="form-label">I am a:</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="form-input"
                            style={{ height: '45px' }}
                        >
                            <option value="user">User (Book Events)</option>
                            <option value="organizer">Organizer (Create Events)</option>
                        </select>
                    </div>

                    {formData.role === 'organizer' && (
                        <>
                            <Input
                                label="Company / Organization Name"
                                id="companyName"
                                name="companyName"
                                type="text"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                            />
                            <div className="form-group">
                                <label htmlFor="bio" className="form-label">Short Bio</label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="form-input"
                                    rows="3"
                                    placeholder="Tell us about your organization..."
                                    required
                                />
                            </div>
                        </>
                    )}

                    <Button className="btn-primary" type="submit" style={{ marginTop: '0.5rem' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>

                    <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
