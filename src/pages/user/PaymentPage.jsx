import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { bookingService } from '../../services/bookingService';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { event, tickets, totalAmount, ticketType } = location.state || {};

    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [processing, setProcessing] = useState(false);

    if (!event || !ticketType) {
        return (
            <div className="flex-center" style={{ minHeight: '50vh', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>No booking details found.</p>
                <Button onClick={() => navigate('/')}>Go Home</Button>
            </div>
        );
    }

    const handlePayment = async (e) => {
        e.preventDefault();
        setProcessing(true);

        // Simulate payment delay
        setTimeout(async () => {
            try {
                // Determine ticketTypeId - if passed from state use it, else generic logic?
                // Now we strictly expect it from state
                await bookingService.createBooking({
                    eventId: event.id || event._id,
                    ticketTypeId: ticketType._id || ticketType.id,
                    quantity: tickets
                });
                alert('Booking Successful!');
                navigate('/user/dashboard');
            } catch (error) {
                console.error(error);
                alert('Booking Failed: ' + (error.response?.data?.message || error.message));
                setProcessing(false);
            }
        }, 1500);
    };

    return (
        <div className="flex-center" style={{ minHeight: '70vh', paddingBottom: '3rem' }}>
            <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '2.5rem' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Payment Details</h2>

                <div style={{ marginBottom: '2rem', textAlign: 'center', padding: '1rem', background: 'var(--bg-body)', borderRadius: 'var(--radius)' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Amount</p>
                    <strong style={{ fontSize: '2rem', color: 'var(--primary)' }}>₹{totalAmount}</strong>
                </div>

                <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Input
                        label="Card Number"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Input
                            label="Expiry Date"
                            placeholder="MM/YY"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            required
                        />
                        <Input
                            label="CVV"
                            placeholder="123"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit" className="btn-primary" disabled={processing} style={{ marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }}>
                        {processing ? 'Processing Payment...' : `Pay ₹${totalAmount}`}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default PaymentPage;
