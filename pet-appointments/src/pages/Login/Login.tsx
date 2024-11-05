// src/pages/Login/Login.tsx
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

interface LocationState {
    message?: string;
}

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    const location = useLocation();
    const state = location.state as LocationState;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (error) {
            setError('Invalid email or password');
        }
    };

    return (
        <Container className="d-flex flex-column align-items-center justify-content-between min-vh-100 py-4">
            <div className="w-100 max-w-md d-flex flex-column align-items-center">
                <h1 className="display-4 fw-bold mb-4 text-uppercase text-nowrap">
                    Pet Reminders
                </h1>

                {state?.message && (
                    <Alert variant="success" className="w-100 mb-4">
                        {state.message}
                    </Alert>
                )}

                {error && (
                    <Alert variant="danger" className="w-100 mb-4">
                        {error}
                    </Alert>
                )}

                <div className="d-flex justify-content-center align-items-center rounded-circle bg-secondary mb-4" 
                    style={{ 
                        width: '256px', 
                        height: '256px',
                        overflow: 'hidden',
                    }}>
                    <img 
                        src="/src/assets/collie.png" 
                        alt="Dog illustration" 
                        className="w-100 h-100 object-fit-cover"
                    />
                </div>

                <Form onSubmit={handleSubmit} className="w-100 max-w-sm">
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="email"
                            placeholder="EMAIL.ADDRESS@OREGONSTATE.EDU"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="rounded-pill text-center text-uppercase py-2"
                        />
                        <span>We will not sell your email address or spam you.</span>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="password"
                            placeholder="PASSWORD"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="rounded-pill text-center text-uppercase py-2"
                        />
                    </Form.Group>

                    <div className="text-center mb-3">
                        <span>New user? </span>
                        <Link to="/register" className="text-primary text-decoration-none">
                            Create account
                        </Link>
                    </div>

                    <Button 
                        type="submit" 
                        variant="outline-dark"
                        className="w-100 rounded-pill text-uppercase py-2 mb-4"
                    >
                        Login
                    </Button>
                </Form>

                <p className="text-center text-muted px-4" style={{ maxWidth: '400px' }}>
                    Coordinate care, track meals, and ensure your pet's health – all in one place. Join our community of responsible pet owners!
                </p>
            </div>
        </Container>
    );
};

export default Login;