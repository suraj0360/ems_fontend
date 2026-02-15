import React, { useState } from 'react';
import Button from '../../components/ui/Button';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        console.log('Contact form submitted:', formData);
        setSubmitted(true);
    };

    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '600px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>Contact Us</h1>

            {submitted ? (
                <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                    <h2 style={{ marginBottom: '1rem' }}>Message Sent!</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Thank you for reaching out. We will get back to you shortly.</p>
                </div>
            ) : (
                <div className="card" style={{ padding: '2rem' }}>
                    <p style={{ marginBottom: '2rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        Have questions or support requests? Fill out the form below.
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="Your Name"
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="your@email.com"
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor="message" className="form-label">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                className="form-input"
                                rows="5"
                                placeholder="How can we help?"
                                style={{ resize: 'vertical' }}
                            ></textarea>
                        </div>
                        <Button type="submit" className="btn-primary" style={{ width: '100%' }}>
                            Send Message
                        </Button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ContactUs;
