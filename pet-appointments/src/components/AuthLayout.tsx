import { Outlet } from 'react-router-dom';


const AuthLayout: React.FC = () => {
    return (
        <>
            <main className="container mt-4">
                <Outlet />
            </main>
        </>
    );
};

export default AuthLayout;