import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const CreateEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: 'Social',
        price: 0,
        totalTickets: 0,
        image: '',
    });

    useEffect(() => {
        if (isEditMode) {
            const fetchEvent = async () => {
                try {
                    const eventData = await eventService.getEventById(id);
                    setFormData(eventData);
                } catch (error) {
                    alert('Event not found');
                    navigate('/organizer/dashboard');
                }
            };
            fetchEvent();
        }
    }, [id, isEditMode, navigate]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                organizerId: user._id,
                price: Number(formData.price),
                totalTickets: Number(formData.totalTickets)
            };

            if (isEditMode) {
                await eventService.updateEvent(id, payload);
            } else {
                await eventService.createEvent(payload);
            }
            navigate('/organizer/dashboard');
        } catch (error) {
            alert('Failed to save event');
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>{isEditMode ? 'Edit Event' : 'Create New Event'}</h1>
            <div className="card" style={{ padding: '2.5rem' }}>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
                    <Input
                        id="title"
                        label="Event Title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <Input
                            id="date"
                            label="Date"
                            type="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            id="time"
                            label="Time"
                            type="time"
                            value={formData.time}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <Input
                        id="location"
                        label="Location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />

                    <div className="form-group">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="form-input"
                            style={{ minHeight: '120px', resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <Input
                            id="price"
                            label="Price (₹)"
                            type="number"
                            min="0"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            id="totalTickets"
                            label="Total Tickets"
                            type="number"
                            min="1"
                            value={formData.totalTickets || ''}
                            onChange={handleChange}
                            required
                        />
                        <div className="form-group">
                            <label htmlFor="category" className="form-label">Category</label>
                            <select
                                id="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="form-input"
                                style={{ height: '45px' }}
                            >
                                <option value="Social">Social</option>
                                <option value="Corporate">Corporate</option>
                                <option value="Educational">Educational</option>
                            </select>
                        </div>
                    </div>

                    <Input
                        id="image"
                        label="Image URL"
                        placeholder="https://..."
                        value={formData.image}
                        onChange={handleChange}
                    />

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                        <Button type="button" onClick={() => navigate('/organizer/dashboard')} variant="ghost">Cancel</Button>
                        <Button type="submit" className="btn-primary" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
                            {isEditMode ? 'Update Event' : 'Create Event'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;
