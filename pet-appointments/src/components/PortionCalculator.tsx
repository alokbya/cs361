import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { usePortionCalculator } from '../hooks/usePortionCalculator';
import { useUnitConversion } from '../hooks/useUnitConversion';

const PortionCalculator: React.FC = () => {
  const [weight, setWeight] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [displayUnit, setDisplayUnit] = useState<'oz' | 'grams'>('oz');
  const [convertedValue, setConvertedValue] = useState<string | null>(null);
  
  const { 
    mutate: calculatePortion, 
    data: portionData, 
    isPending: isCalculating, 
    error: calculationError 
  } = usePortionCalculator();

  const {
    mutate: convertUnit,
    isPending: isConverting,
    data: conversionData,
    error: conversionError,
    reset
  } = useUnitConversion();

  // Parse the numeric value from portion string (e.g., "2oz" -> 2)
  const getNumericPortion = () => {
    if (!portionData) return 0;
    return parseFloat(portionData.portion.replace('oz', ''));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDisplayUnit('oz'); // Reset to oz
    setConvertedValue(null); // Clear any converted value
    reset();
    calculatePortion({
      weight: parseFloat(weight),
      age: parseFloat(age),
      id: 'temp-id'
    });
  };

  const toggleUnit = () => {
    const numericPortion = getNumericPortion();
    
    if (displayUnit === 'oz') {
      // Converting to grams
      convertUnit({
        value: numericPortion,
        from: 'oz'
      });
    } else {
      // Converting to oz
      convertUnit({
        value: parseFloat(convertedValue || '0'),
        from: 'grams'
      });
    }
    setDisplayUnit(current => current === 'oz' ? 'grams' : 'oz');
  };

  // Update convertedValue when we get new conversion data
  useEffect(() => {
    if (conversionData) {
      setConvertedValue(conversionData.convertedValue.toString());
    }
  }, [conversionData]);

  const getDisplayValue = () => {
    if (!portionData) return null;
    
    if (displayUnit === 'oz') {
      return portionData.portion;
    }

    if (isConverting) {
      return (
        <Spinner animation="border" size="sm" role="status">
          <span className="visually-hidden">Converting...</span>
        </Spinner>
      );
    }

    return convertedValue ? `${convertedValue}g` : null;
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
            disabled={isCalculating}
            className="w-100"
          >
            {isCalculating ? (
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

        {(calculationError || conversionError) && (
          <Alert variant="danger" className="mt-3">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            An error occurred. Please try again.
          </Alert>
        )}

        {portionData && (
          <Alert variant="success" className="mt-3">
            <Alert.Heading className="h5 d-flex justify-content-between align-items-center">
              <span>
                <i className="bi bi-check-circle-fill me-2"></i>
                Recommended Portion Size
              </span>
              <Button
                variant="outline-success"
                size="sm"
                onClick={toggleUnit}
                disabled={isConverting}
              >
                <i className="bi bi-arrow-repeat me-2"></i>
                Switch to {displayUnit === 'oz' ? 'Grams' : 'Ounces'}
              </Button>
            </Alert.Heading>
            <p className="h3 mb-2">{getDisplayValue()}</p>
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