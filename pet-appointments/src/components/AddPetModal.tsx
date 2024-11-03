// src/components/AddPetModal.tsx
import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useCreatePet } from '../hooks/usePets';

interface AddPetModalProps {
  show: boolean;
  onHide: () => void;
  userId: string;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const AddPetModal = ({ 
  show, 
  onHide, 
  userId,
  onSuccess,
  onError 
}: AddPetModalProps) => {
  const [petName, setPetName] = useState('');
  const createPetMutation = useCreatePet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!petName.trim()) return;

    try {
      await createPetMutation.mutateAsync({
        name: petName,
        userId: userId
      });
      setPetName('');
      onSuccess(`Successfully created pet ${petName}!`);
      onHide();
    } catch (error) {
      onError(`Failed to create pet. Please try again.`);
      console.error('Failed to create pet:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Pet</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Pet Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter pet name"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            disabled={createPetMutation.isPending || !petName.trim()}
          >
            {createPetMutation.isPending ? 'Adding...' : 'Add Pet'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddPetModal;