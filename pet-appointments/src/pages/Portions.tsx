// src/pages/Portions.tsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PortionCalculator from '../components/PortionCalculator';

const Portions: React.FC = () => {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <PortionCalculator />
        </Col>
      </Row>
    </Container>
  );
};

export default Portions;