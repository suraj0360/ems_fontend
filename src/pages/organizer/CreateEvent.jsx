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
    });
    const [imageFile, setImageFile] = useState(null);
    const [existingImage, setExistingImage] = useState('');
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        if (isEditMode) {
            const fetchEvent = async () => {
                try {
                    const eventData = await eventService.getEventById(id);
                    // Extract existing image if it maps to a URL (or skip if we just use string form)
                    const { image, ...rest } = eventData;
                    if (image) setExistingImage(image);

                    // Format date to YYYY-MM-DD for input compatibility if needed
                    if (rest.date) {
                        rest.date = new Date(rest.date).toISOString().split('T')[0];
                    }
                    setFormData(rest);
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

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        // Cleanup object URL to avoid memory leaks
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = new FormData();

            // Append all textual content
            Object.keys(formData).forEach(key => {
                if (formData[key] !== undefined && formData[key] !== null) {
                    submitData.append(key, formData[key]);
                }
            });

            // Re-enforce number conversions correctly
            submitData.set('price', Number(formData.price));
            submitData.set('totalTickets', Number(formData.totalTickets));
            submitData.append('organizerId', user._id);

            // Append image file if present
            if (imageFile) {
                submitData.append('image', imageFile);
            }

            if (isEditMode) {
                await eventService.updateEvent(id, submitData);
            } else {
                await eventService.createEvent(submitData);
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

                    <div className="form-group">
                        <label htmlFor="image" className="form-label">Event Banner Image</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                            {(imagePreview || existingImage) && (
                                <div style={{
                                    width: '100%',
                                    height: '250px',
                                    borderRadius: '0.5rem',
                                    overflow: 'hidden',
                                    border: '1px solid var(--border)',
                                    backgroundImage: `url(${imagePreview || existingImage})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundColor: 'var(--bg-default)'
                                }} />
                            )}
                            <input
                                type="file"
                                id="image"
                                accept="image/jpeg, image/png, image/webp"
                                onChange={handleImageChange}
                                className="form-input"
                                style={{ padding: '0.5rem' }}
                                required={!isEditMode && !existingImage}
                            />
                            {imageFile && (
                                <div style={{ fontSize: '0.85rem', color: 'var(--success)' }}>
                                    Selected: {imageFile.name}
                                </div>
                            )}
                        </div>
                    </div>

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
