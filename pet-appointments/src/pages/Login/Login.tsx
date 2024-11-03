import { Container, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Login.css';


interface LoginProps {
    // Add any props if needed
}

const Login: React.FC<LoginProps> = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add login logic here
        console.log('Login attempted:', { email, password });
    };

    return (
        <Container className="d-flex flex-column align-items-center justify-content-between min-vh-100 py-4">
            {/* Main Content */}
            <div className="w-100 max-w-md d-flex flex-column align-items-center">
                {/* Title */}
                <h1 className="display-4 fw-bold mb-4 text-uppercase text-nowrap" 
                    style={{ 
                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                        letterSpacing: '0.1em',
                        whiteSpace: 'nowrap'
                    }}>
                    Pet Reminders
                </h1>

                {/* Logo */}
                <div className="d-flex justify-content-center align-items-center rounded-circle bg-secondary mb-4" 
                    style={{ 
                        width: '256px', 
                        height: '256px',
                        overflow: 'hidden',
                    }}>
                    <img 
                        src="src\assets\collie.png" 
                        alt="Dog illustration" 
                        className="w-100 h-100 object-fit-cover"
                    />
                </div>

                {/* Form */}
                <Form onSubmit={handleSubmit} className="w-100 max-w-sm">
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="email"
                            placeholder="EMAIL.ADDRESS@OREGONSTATE.EDU"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="rounded-pill text-center text-uppercase py-2"
                        />
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

                    {/* Create Account Link */}
                    <div className="text-center mb-3">
                        <span>New user? </span>
                        <Link to="/create-account" className="text-primary text-decoration-none">
                            Create account
                        </Link>
                    </div>

                    {/* Login Button */}
                    <Button 
                        type="submit" 
                        variant="outline-dark"
                        className="w-100 rounded-pill text-uppercase py-2 mb-4"
                    >
                        Login
                    </Button>
                </Form>

                {/* Inclusivity Message */}
                <p className="text-center text-muted px-4" style={{ maxWidth: '400px' }}>
                    Coordinate care, track meals, and ensure your pet's health – all in one place. Join our community of responsible pet owners!
                </p>
            </div>

            {/* Footer placeholder if needed */}
            <div className="w-100 bg-dark text-white text-center py-3 mt-4">
                <p className="mb-0 text-uppercase">Footer</p>
            </div>
        </Container>
    );
};

export default Login;