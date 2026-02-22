import { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';
import EventCard from '../../components/EventCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await eventService.getAllEvents();
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const approvedEvents = data.filter(e => {
                    const eventDate = new Date(e.date);
                    return e.status === 'APPROVED' && eventDate >= today;
                });

                setEvents(approvedEvents);
                setFilteredEvents(approvedEvents);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        let result = events;

        if (searchTerm) {
            result = result.filter(e =>
                e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== 'All') {
            result = result.filter(e => e.category === selectedCategory);
        }

        setFilteredEvents(result);
    }, [searchTerm, selectedCategory, events]);

    const categories = ['All', 'Social', 'Corporate', 'Educational'];

    if (loading) return <div className="flex-center" style={{ minHeight: '50vh' }}>Loading events...</div>;

    return (
        <div>
            <section className="section-spacing" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                    Discover Amazing Events
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
                    A one-stop platform for Social, Corporate, and Educational event management.
                </p>
            </section>

            <div className="section-spacing" style={{ maxWidth: '800px', margin: '0 auto 3rem auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Input
                        placeholder="Search events by title or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '1rem' }}
                    />

                    <div className="flex-center" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
                        {categories.map(cat => (
                            <Button
                                key={cat}
                                variant={selectedCategory === cat ? 'primary' : 'outline'}
                                onClick={() => setSelectedCategory(cat)}
                                style={{ borderRadius: '2rem', padding: '0.5rem 1.5rem' }}
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {filteredEvents.length === 0 ? (
                <div className="flex-center" style={{ flexDirection: 'column', padding: '4rem', color: 'var(--text-muted)' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No events found</h3>
                    <p>Try adjusting your search or filters to find what you're looking for.</p>
                </div>
            ) : (
                <div className="grid-cards">
                    {filteredEvents.map(event => (
                        <EventCard key={event._id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
