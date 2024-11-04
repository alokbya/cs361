import { useState } from 'react';
import { Modal, Button, Form, Nav, Alert } from 'react-bootstrap';
import { useCreatePet, usePet } from '../hooks/usePets';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { petService } from '../api/services/petService';

interface AddPetModalProps {
  show: boolean;
  onHide: () => void;
  userId: string;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

type AddMode = 'create' | 'existing';

const AddPetModal = ({ 
  show, 
  onHide, 
  userId,
  onSuccess,
  onError 
}: AddPetModalProps) => {
  const [mode, setMode] = useState<AddMode>('create');
  const [petName, setPetName] = useState('');
  const [petId, setPetId] = useState('');
  const [validationError, setValidationError] = useState('');
  
  const queryClient = useQueryClient();
  const createPetMutation = useCreatePet();
  
  // Add mutation for associating existing pet with user
  const associatePetMutation = useMutation({
    mutationFn: async (petId: string) => {
      const response = await petService.addUserToPet(petId, userId);
      return response;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['pets', 'user', userId] });
      queryClient.invalidateQueries({ queryKey: ['users', userId] });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    
    try {
      if (mode === 'create') {
        if (!petName.trim()) return;
        
        await createPetMutation.mutateAsync({
          name: petName,
          userId: userId
        });
        onSuccess(`Successfully created pet ${petName}!`);
      } else {
        if (!petId.trim()) return;
        
        await associatePetMutation.mutateAsync(petId);
        onSuccess('Successfully added existing pet!');
      }
      
      // Reset form and close modal
      setPetName('');
      setPetId('');
      onHide();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Operation failed. Please try again.';
      setValidationError(errorMessage);
      onError(errorMessage);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Pet</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Nav variant="pills" className="mb-3">
            <Nav.Item>
              <Nav.Link 
                active={mode === 'create'} 
                onClick={() => setMode('create')}
              >
                Create New Pet
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={mode === 'existing'} 
                onClick={() => setMode('existing')}
              >
                Add Existing Pet
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {validationError && (
            <Alert variant="danger" className="mb-3">
              {validationError}
            </Alert>
          )}

          {mode === 'create' ? (
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
          ) : (
            <Form.Group className="mb-3">
              <Form.Label>Pet ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter pet ID"
                value={petId}
                onChange={(e) => setPetId(e.target.value)}
                autoFocus
              />
              <Form.Text className="text-muted">
                Enter the unique identifier of the existing pet
              </Form.Text>
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            disabled={
              (mode === 'create' && !petName.trim()) ||
              (mode === 'existing' && !petId.trim()) ||
              createPetMutation.isPending ||
              associatePetMutation.isPending
            }
          >
            {createPetMutation.isPending || associatePetMutation.isPending
              ? 'Processing...'
              : mode === 'create'
                ? 'Create Pet'
                : 'Add Pet'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddPetModal;