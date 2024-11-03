import { Container, Nav, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Navigation: React.FC = () => {
    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/login"><span className="brand">Pet Reminders</span></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <LinkContainer to="/">
                            <Nav.Link href="/">Home</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/schedules">
                            <Nav.Link href="/schedules">Schedules</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/details">
                            <Nav.Link href="/details">Details</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/events">
                            <Nav.Link href="/events">Events</Nav.Link>
                        </LinkContainer>
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default Navigation;