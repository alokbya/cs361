import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';


const Layout: React.FC = () => {
    return (
        <>
            <Navigation />
            <main className="container mt-4">
                <Outlet />
            </main>
        </>
    );
};

export default Layout;