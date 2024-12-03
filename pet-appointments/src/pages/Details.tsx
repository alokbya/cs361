import { useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useUsers } from '../hooks/useUsers';
import { usePets } from '../hooks/usePets';
import { useFeedingReport } from '../hooks/useReport';
import PetDetailsModal from '../components/PetDetailsModal';
import { reportService } from '../api/services/reportService';

const Details: React.FC = () => {
    const [selectedPetId, setSelectedPetId] = useState<string>('');
    const [showModal, setShowModal] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
        endDate: new Date().toISOString().split('T')[0] // today
    });

    const { data: users, isLoading: isLoadingUsers } = useUsers();
    const { data: pets, isLoading: isLoadingPets } = usePets(users?.[0]?.id ?? '', {
        enabled: !!users?.[0]
    });

    const { data: report, isLoading: isLoadingReport } = useFeedingReport({
        petId: selectedPetId,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
    });

    const handleGenerateReport = async () => {
        if (!selectedPetId || !pets) return;
    
        const selectedPet = pets.find(p => p.id === selectedPetId);
        if (!selectedPet) return;
    
        try {
            setIsGenerating(true); // Add this state if you haven't already
            await reportService.downloadFeedingReport({
                petId: selectedPetId,
                petName: selectedPet.name,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate
            });
        } catch (error) {
            console.error('Failed to generate report:', error);
            // Add a toast or alert here
        } finally {
            setIsGenerating(false);
        }
    };

    if (isLoadingUsers || isLoadingPets) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="py-4">
            <h1 className="mb-4">Pet Details & Reports</h1>
            
            <Row className="mb-4">
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Select Pet</Form.Label>
                        <Form.Select 
                            value={selectedPetId}
                            onChange={(e) => setSelectedPetId(e.target.value)}
                        >
                            <option value="">Choose a pet...</option>
                            {pets?.map(pet => (
                                <option key={pet.id} value={pet.id}>{pet.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            {selectedPetId && (
                <Row className="mb-4">
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <Card.Title>Generate Feeding Report</Card.Title>
                                <Form.Group className="mb-3">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={dateRange.startDate}
                                        onChange={(e) => setDateRange(prev => ({
                                            ...prev,
                                            startDate: e.target.value
                                        }))}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={dateRange.endDate}
                                        onChange={(e) => setDateRange(prev => ({
                                            ...prev,
                                            endDate: e.target.value
                                        }))}
                                    />
                                </Form.Group>
                                <div className="d-flex gap-2">
                                    <Button
                                        variant="primary"
                                        onClick={handleGenerateReport}
                                        disabled={isLoadingReport}
                                    >
                                        {isLoadingReport ? 'Generating...' : 'Generate Report'}
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setShowModal(true)}
                                    >
                                        View Quick Details
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    {report && (
                        <Col md={6}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Feeding Report</Card.Title>
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Date</th>
                                                    <th>Time</th>
                                                    <th>Fed By</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {report.events.map(event => (
                                                    <tr key={event.id}>
                                                        <td>{new Date(event.eventTime).toLocaleDateString()}</td>
                                                        <td>{new Date(event.eventTime).toLocaleTimeString()}</td>
                                                        <td>{event.userName}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    )}
                </Row>
            )}

            {selectedPetId && pets && (
                <PetDetailsModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    pet={pets.find(p => p.id === selectedPetId)!}
                    userNames={[]} // You'll need to populate this based on your data
                />
            )}
        </Container>
    );
};

export default Details;