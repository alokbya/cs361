// src/pages/Register/Register.tsx
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCreateUser } from '../../hooks/useUsers';
import { apiClient } from '../../api/client';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
    
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }
    
        try {
            // Create new user
            await apiClient.post('/users', {
                email: formData.email,
                name: formData.name,
                password: formData.password
            });
    
            // Redirect to login page on success
            navigate('/login', { 
                state: { 
                    message: 'Account created successfully! Please log in.' 
                }
            });
        } catch (error: any) {
            // More detailed error handling
            const errorMessage = error.response?.data || 'Failed to create account';
            console.error('Registration error:', error);
            setError(typeof errorMessage === 'string' ? errorMessage : 'Failed to create account');
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Container className="d-flex flex-column align-items-center justify-content-between min-vh-100 py-4">
            <div className="w-100 max-w-md d-flex flex-column align-items-center">
                <h1 className="display-4 fw-bold mb-4">Create Account</h1>

                {error && (
                    <Alert variant="danger" className="w-100 mb-4">
                        {error}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit} className="w-100 max-w-sm">
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="NAME"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="rounded-pill text-center text-uppercase py-2"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="EMAIL.ADDRESS@OREGONSTATE.EDU"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="rounded-pill text-center text-uppercase py-2"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="password"
                            name="password"
                            placeholder="PASSWORD"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="rounded-pill text-center text-uppercase py-2"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            type="password"
                            name="confirmPassword"
                            placeholder="CONFIRM PASSWORD"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="rounded-pill text-center text-uppercase py-2"
                        />
                    </Form.Group>

                    <div className="text-center mb-3">
                        <span>Already have an account? </span>
                        <Link to="/login" className="text-primary text-decoration-none">
                            Login
                        </Link>
                    </div>

                    <Button 
                        type="submit" 
                        variant="outline-dark"
                        className="w-100 rounded-pill text-uppercase py-2 mb-4"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </Form>
            </div>
        </Container>
    );
};

export default Register;