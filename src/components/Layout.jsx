import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
    return (
        <div className="main-layout">
            <Navbar />
            <main className="container main-content">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
