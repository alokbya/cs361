import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useCreateUser } from '../hooks/useUsers';

interface AddUserModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const AddUserModal = ({ 
  show, 
  onHide,
  onSuccess,
  onError 
}: AddUserModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const createUserMutation = useCreateUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim() || !formData.name.trim() || !formData.password.trim()) return;

    try {
      await createUserMutation.mutateAsync(formData);
      setFormData({ name: '', email: '', password: '' });
      onSuccess(`Successfully created user ${formData.name}!`);
      onHide();
    } catch (error) {
      onError(`Failed to create user. Please try again.`);
      console.error('Failed to create user:', error);
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
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add New User</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleChange}
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
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
            disabled={createUserMutation.isPending || 
              !formData.email.trim() || 
              !formData.name.trim() || 
              !formData.password.trim()}
          >
            {createUserMutation.isPending ? 'Creating...' : 'Create User'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddUserModal;