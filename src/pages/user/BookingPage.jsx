import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { ticketService } from '../../services/ticketService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const BookingPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [ticketTypes, setTicketTypes] = useState([]);
    const [selectedTicketType, setSelectedTicketType] = useState(null);
    const [tickets, setTickets] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventData, ticketsData] = await Promise.all([
                    eventService.getEventById(eventId),
                    ticketService.getTicketsByEventId(eventId)
                ]);
                setEvent(eventData);
                setTicketTypes(ticketsData);
                if (ticketsData.length > 0) {
                    setSelectedTicketType(ticketsData[0]);
                }
            } catch (error) {
                alert('Event or tickets not found');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [eventId, navigate]);

    const handleProceed = () => {
        if (!selectedTicketType) {
            alert('No tickets available for this event');
            return;
        }
        navigate('/payment', {
            state: {
                event,
                tickets,
                ticketType: selectedTicketType,
                totalAmount: selectedTicketType.price * tickets
            }
        });
    };

    if (loading) return <div className="flex-center" style={{ minHeight: '50vh' }}>Loading...</div>;
    if (!event) return null;

    return (
        <div className="flex-center" style={{ minHeight: '60vh', paddingBottom: '3rem' }}>
            <div className="card" style={{ maxWidth: '600px', width: '100%', padding: '2.5rem' }}>
                <h1 style={{ marginBottom: '2rem', fontSize: '1.75rem', textAlign: 'center' }}>Confirm Booking</h1>

                <div style={{
                    background: 'var(--bg-body)',
                    padding: '1.5rem',
                    borderRadius: 'var(--radius)',
                    marginBottom: '2rem',
                    border: '1px solid var(--border)'
                }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>{event.title}</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        {new Date(event.date).toLocaleDateString()} at {event.time}
                    </p>
                    {selectedTicketType ? (
                        <>
                            <p style={{ fontWeight: 600 }}>Ticket Type: {selectedTicketType.name}</p>
                            <p style={{ fontWeight: 600 }}>Price per ticket: ₹{selectedTicketType.price}</p>
                            <p style={{
                                fontWeight: 600,
                                color: selectedTicketType.quantity > 0 ? 'green' : 'red',
                                marginTop: '0.5rem'
                            }}>
                                {selectedTicketType.quantity > 0
                                    ? `Available Tickets: ${selectedTicketType.quantity}`
                                    : 'Sold Out'}
                            </p>
                        </>
                    ) : (
                        <p style={{ color: 'red' }}>No tickets available for this event.</p>
                    )}
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <Input
                        type="number"
                        label="Number of Tickets"
                        min="1"
                        max="10"
                        value={tickets}
                        onChange={(e) => setTickets(parseInt(e.target.value) || 1)}
                        disabled={!selectedTicketType}
                    />
                </div>

                <div className="flex-between" style={{
                    marginBottom: '2rem',
                    padding: '1rem',
                    background: '#f8fafc',
                    borderRadius: 'var(--radius)',
                    border: '1px dashed var(--border)'
                }}>
                    <span style={{ fontSize: '1.1rem' }}>Total Amount:</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                        ₹{selectedTicketType ? selectedTicketType.price * tickets : 0}
                    </span>
                </div>

                <Button
                    onClick={handleProceed}
                    className="btn-primary"
                    style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
                    disabled={!selectedTicketType}
                >
                    Proceed to Payment
                </Button>
            </div>
        </div>
    );
};

export default BookingPage;
