// src/components/PortionCalculator.tsx
import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { usePortionCalculator } from '../hooks/usePortionCalculator';

const PortionCalculator: React.FC = () => {
  const [weight, setWeight] = useState<string>('');
  const [age, setAge] = useState<string>('');
  
  const { 
    mutate: calculatePortion, 
    data, 
    isPending, 
    error 
  } = usePortionCalculator();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculatePortion({
      weight: parseFloat(weight),
      age: parseFloat(age),
      id: 'temp-id'
    });
  };

  return (
    <Card className="shadow-sm hover:shadow-lg transition-shadow duration-200 mt-4">
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="h4 mb-0">
              <i className="bi bi-cup-hot me-2"></i>
              Portions
            </h3>
            <small className="text-muted">Calculate recommended portion size</small>
          </div>
        </Card.Title>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-arrow-down-up me-2"></i>
              Pet Weight (lbs)
            </Form.Label>
            <Form.Control
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight"
              required
              min="0"
              step="0.1"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <i className="bi bi-calendar3 me-2"></i>
              Pet Age (years)
            </Form.Label>
            <Form.Control
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter age"
              required
              min="0"
              step="0.1"
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            disabled={isPending}
            className="w-100"
          >
            {isPending ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Calculating...
              </>
            ) : (
              <>
                <i className="bi bi-calculator me-2"></i>
                Calculate Portion
              </>
            )}
          </Button>
        </Form>

        {error && (
          <Alert variant="danger" className="mt-3">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            An error occurred while calculating the portion.
          </Alert>
        )}

        {data && (
          <Alert variant="success" className="mt-3">
            <Alert.Heading className="h5">
              <i className="bi bi-check-circle-fill me-2"></i>
              Recommended Portion Size
            </Alert.Heading>
            <p className="h3 mb-2">{data.portion}</p>
            <p className="text-muted small mb-0">
              <i className="bi bi-info-circle me-2"></i>
              This is the recommended portion size per meal, assuming two meals per day.
            </p>
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default PortionCalculator;