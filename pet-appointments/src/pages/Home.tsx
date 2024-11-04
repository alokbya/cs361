// src/pages/Home.tsx
import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { usePets } from '../hooks/usePets';
import { Button, Col, Container, Form, Row, Toast, ToastContainer } from 'react-bootstrap';
import IUser from '../interfaces/IUser';
import IPet from '../interfaces/IPet';
import PetCard from '../components/PetCard';
import AddPetModal from '../components/AddPetModal';
import AddUserModal from '../components/AddUserModal';

export const Home = () => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [showAddPetModal, setShowAddPetModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const { data: users, isLoading: isLoadingUsers, error: userError } = useUsers();
  const { 
    data: pets, 
    isLoading: isLoadingPets 
  } = usePets(selectedUserId, { enabled: !!selectedUserId });

  const getUserNames = (userIds: string[]): string[] => {
    if (!users) return [];
    
    return userIds
      .map(id => {
        const user = users.find(u => u.id === id);
        return user?.name;
      })
      .filter((name): name is string => name !== undefined);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
  };

  if (isLoadingUsers) return <div>Loading users...</div>;
  if (userError) return <div>Error loading users</div>;

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col md={8} lg={6} className="mx-auto">
          <div className="d-flex align-items-end gap-3">
            <Form.Group className="flex-grow-1">
              <Form.Label className="h5 mb-3">Select User</Form.Label>
              <Form.Select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="form-select-lg"
              >
                <option value="">Choose a user...</option>
                {users?.map((user: IUser) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowAddPetModal(true)}
              disabled={!selectedUserId}
            >
              <i className="bi bi-plus-lg me-2"></i>
              Add Pet
            </Button>

            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowAddUserModal(true)}
              disabled={!selectedUserId}
            >
              <i className="bi bi-plus-lg me-2"></i>
              Add User
            </Button>
          </div>
        </Col>
      </Row>

      {isLoadingPets ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : !pets?.length ? (
        <div className="text-center py-5">
          <div className="mb-3">
            <i className="bi bi-emoji-frown display-4 text-muted"></i>
          </div>
          <h3 className="h4 text-muted">No pets found</h3>
          <p className="text-muted mb-4">This user doesn't have any pets yet.</p>
          <Button 
            variant="primary" 
            onClick={() => setShowAddPetModal(true)}
            disabled={!selectedUserId}
          >
            Add Your First Pet
          </Button>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {pets.map((pet: IPet) => (
            <Col key={pet.id}>
              <PetCard
                pet={pet}
                userNames={getUserNames(pet.userIds)}
                currentUserId={selectedUserId}
                onSuccess={(msg) => showToast(msg, 'success')}
                onError={(msg) => showToast(msg, 'error')}
              />
            </Col>
          ))}
        </Row>
      )}

      <AddPetModal
        show={showAddPetModal}
        onHide={() => setShowAddPetModal(false)}
        userId={selectedUserId}
        onSuccess={(msg) => showToast(msg, 'success')}
        onError={(msg) => showToast(msg, 'error')}
      />

      <AddUserModal
        show={showAddUserModal}
        onHide={() => setShowAddUserModal(false)}
        onSuccess={(msg) => showToast(msg, 'success')}
        onError={(msg) => showToast(msg, 'error')}
      />

      <ToastContainer position="bottom-end" className="p-3">
        <Toast 
          show={toast.show} 
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
          delay={3000}
          autohide
          bg={toast.type === 'success' ? 'success' : 'danger'}
        >
          <Toast.Header>
            <strong className="me-auto">
              {toast.type === 'success' ? 'Success' : 'Error'}
            </strong>
          </Toast.Header>
          <Toast.Body className={toast.type === 'success' ? 'text-white' : ''}>
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default Home;