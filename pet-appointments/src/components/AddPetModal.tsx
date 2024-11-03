import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useCreatePet } from '../hooks/usePets';
import type { UseMutationResult } from '@tanstack/react-query';
import type IPet from '../interfaces/IPet';
import type ICreatePetRequest from '../interfaces/requests/ICreatePetRequest';

interface AddPetModalProps {
  show: boolean;
  onHide: () => void;
  userId: string;
}

const AddPetModal = ({ show, onHide, userId }: AddPetModalProps) => {
  const [petName, setPetName] = useState('');
  const createPetMutation: UseMutationResult<
    IPet,
    Error,
    ICreatePetRequest,
    unknown
  > = useCreatePet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!petName.trim()) return;

    try {
      await createPetMutation.mutateAsync({
        name: petName,
        userId: userId
      });
      setPetName('');
      onHide();
    } catch (error) {
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