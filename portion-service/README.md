# Portions Service

A microservice for calculating pet food portion sizes based on weight and age. This service is part of the Pet Care monorepo.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
```bash
cd services/portions-service
npm install
```

### Running the Service
```bash
npm start
```
The service will start on `http://localhost:3025`.

### Development
```bash
npm run dev
```
This will start the service with hot reloading enabled.

## API Endpoints

### Calculate Portion Size
Calculate the recommended portion size based on pet weight and age.

**Endpoint:** `POST /api/calculate-portion`

**Request Body:**
```json
{
  "weight": number,  // Weight in pounds
  "age": number,     // Age in years
  "id": string      // Pet ID
}
```

**Response:**
```json
{
  "portion": string  // e.g., "8oz"
}
```

### Example Usage
```bash
curl -X POST \
  http://localhost:3025/api/calculate-portion \
  -H 'Content-Type: application/json' \
  -d '{
    "weight": 15,
    "age": 5,
    "id": "pet123"
  }'
```

## Configuration
- Port: 3025 (default)
- CORS: Enabled for frontend origin (`http://localhost:5173`)

## Contributing
This service is part of the main Pet Care monorepo. Please follow the repository's contribution guidelines.