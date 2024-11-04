// src/pages/Profile/Profile.tsx
import { Container, Card, Row, Col, Badge } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { usePets } from '../../hooks/usePets';
import PetCard from '../../components/PetCard';

const Profile = () => {
    const { currentUser } = useAuth();
    const { data: userPets, isLoading } = usePets(currentUser?.id || '', {
        enabled: !!currentUser
    });

    if (!currentUser) return null;

    return (
        <Container className="py-4">
            <Row>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <div className="text-center mb-4">
                                <div className="display-1 mb-3">
                                    <i className="bi bi-person-circle text-primary"></i>
                                </div>
                                <h2 className="h4 mb-1">{currentUser.name}</h2>
                                <p className="text-muted">{currentUser.email}</p>
                            </div>

                            <div className="mb-3">
                                <h6 className="text-muted mb-2">Account Details</h6>
                                <p className="mb-1">
                                    <strong>Member since:</strong>{' '}
                                    {new Date(currentUser.createdAt).toLocaleDateString()}
                                </p>
                                <p className="mb-1">
                                    <strong>Last login:</strong>{' '}
                                    {currentUser.lastLoginAt 
                                        ? new Date(currentUser.lastLoginAt).toLocaleString()
                                        : 'Never'}
                                </p>
                                <p className="mb-1">
                                    <strong>Pets:</strong>{' '}
                                    <Badge bg="primary">{userPets?.length || 0}</Badge>
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <h3 className="mb-4">My Pets</h3>
                    {isLoading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : !userPets?.length ? (
                        <Card body className="text-center py-5 border-dashed">
                            <div className="display-1 mb-3 text-muted">
                                <i className="bi bi-emoji-neutral"></i>
                            </div>
                            <h4>No Pets Yet</h4>
                            <p className="text-muted">
                                Add your first pet from the home page to get started!
                            </p>
                        </Card>
                    ) : (
                        <Row xs={1} md={2} className="g-4">
                            {userPets.map(pet => (
                                <Col key={pet.id}>
                                    <PetCard
                                        pet={pet}
                                        userNames={[currentUser.name]}
                                        currentUserId={currentUser.id}
                                        onSuccess={(msg) => console.log(msg)}
                                        onError={(msg) => console.error(msg)}
                                    />
                                </Col>
                            ))}
                        </Row>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;