import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/Layout';

// Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Home from '../pages/common/Home';
import EventDetails from '../pages/common/EventDetails';
import NotFound from '../pages/common/NotFound';
import AboutUs from '../pages/common/AboutUs';
import ContactUs from '../pages/common/ContactUs';

import UserDashboard from '../pages/user/UserDashboard';
import BookingPage from '../pages/user/BookingPage';
import PaymentPage from '../pages/user/PaymentPage';
import FeedbackPage from '../pages/user/FeedbackPage';

import OrganizerDashboard from '../pages/organizer/OrganizerDashboard';
import CreateEvent from '../pages/organizer/CreateEvent';

import AdminDashboard from '../pages/admin/AdminDashboard';

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/event/:id" element={<EventDetails />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />

                {/* User Routes */}
                <Route element={<ProtectedRoute allowedRoles={['user']} />}>
                    <Route path="/user/dashboard" element={<UserDashboard />} />
                    <Route path="/booking/:eventId" element={<BookingPage />} />
                    <Route path="/payment" element={<PaymentPage />} /> {/* Ideally /payment/:bookingId */}
                    <Route path="/feedback" element={<FeedbackPage />} />
                </Route>

                {/* Organizer Routes */}
                <Route element={<ProtectedRoute allowedRoles={['organizer']} />}>
                    <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
                    <Route path="/organizer/create-event" element={<CreateEvent />} />
                    <Route path="/organizer/edit-event/:id" element={<CreateEvent />} /> {/* Reuse Create form */}
                </Route>

                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Route>

                {/* Catch All */}
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
