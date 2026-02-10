import { useState } from 'react';
import Button from '../../components/ui/Button';

const FeedbackPage = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <h2>Thank you for your feedback!</h2>
                <p>We appreciate your input.</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1>Feedback</h1>
            <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Tell us about your experience.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <textarea
                    placeholder="Your comments here..."
                    required
                    style={{
                        width: '100%',
                        minHeight: '150px',
                        padding: '1rem',
                        borderRadius: 'var(--radius)',
                        border: '1px solid var(--border)',
                        fontFamily: 'inherit'
                    }}
                />
                <Button type="submit">Submit Feedback</Button>
            </form>
        </div>
    );
};

export default FeedbackPage;
