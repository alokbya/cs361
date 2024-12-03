// src/components/Navigation.tsx
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navigation: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand>
                        <span className="brand">Pet Reminders</span>
                    </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <LinkContainer to="/">
                            <Nav.Link>Home</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/portions">
                            <Nav.Link>Portions</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/schedules">
                            <Nav.Link>Schedules</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/details">
                            <Nav.Link>Details</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/events">
                            <Nav.Link>Events</Nav.Link>
                        </LinkContainer>
                    </Nav>
                    {currentUser && (
                        <Nav>
                            <LinkContainer to="/profile">
                                <Nav.Link className="me-3">
                                    <i className="bi bi-person-circle me-2"></i>
                                    {currentUser.name}
                                </Nav.Link>
                            </LinkContainer>
                            <Nav.Link 
                                onClick={handleLogout}
                                className="text-danger"
                            >
                                <i className="bi bi-box-arrow-right me-2"></i>
                                Logout
                            </Nav.Link>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;