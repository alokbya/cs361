const express = require('express');
const cors = require('cors');
const app = express();
const port = 3027;

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Conversion constants
const OZ_TO_GRAMS = 28.3495;
const GRAMS_TO_OZ = 0.03527396;

// Helper functions for conversions
function convertOzToGrams(oz) {
    return Number((oz * OZ_TO_GRAMS).toFixed(2));
}

function convertGramsToOz(grams) {
    return Number((grams * GRAMS_TO_OZ).toFixed(2));
}

// Logger function
function logConversion(requestId, { value, from }, result, error = null) {
    const timestamp = new Date().toISOString();
    const status = error ? 'ERROR' : 'SUCCESS';
    
    console.log('----------------------------------------');
    console.log(`[${timestamp}] Conversion Request #${requestId}`);
    console.log('Request:', {
        value: Number(value),
        from: from,
        to: from === 'oz' ? 'grams' : 'oz'
    });
    
    if (error) {
        console.log('Status:', status);
        console.log('Error:', error.message);
    } else {
        console.log('Status:', status);
        console.log('Result:', {
            originalValue: Number(value),
            originalUnit: from,
            convertedValue: result,
            convertedUnit: from === 'oz' ? 'grams' : 'oz'
        });
    }
    console.log('----------------------------------------\n');
}

// Request counter for logging
let requestCounter = 0;

// GET endpoint for converting oz to grams
app.get('/api/convert', (req, res) => {
    const requestId = ++requestCounter;
    const { value, from } = req.query;

    try {
        // Validate required fields
        if (!value || !from) {
            const error = new Error('Missing required fields. Please provide value and from unit.');
            logConversion(requestId, { value, from }, null, error);
            return res.status(400).json({ error: error.message });
        }

        // Validate numeric value
        const numericValue = Number(value);
        if (isNaN(numericValue)) {
            const error = new Error('Value must be a valid number.');
            logConversion(requestId, { value, from }, null, error);
            return res.status(400).json({ error: error.message });
        }

        // Perform conversion
        let result;
        let toUnit;
        switch (from.toLowerCase()) {
            case 'oz':
                result = convertOzToGrams(numericValue);
                toUnit = 'grams';
                break;
            case 'grams':
                result = convertGramsToOz(numericValue);
                toUnit = 'oz';
                break;
            default:
                const error = new Error('Invalid unit. Please use "oz" or "grams".');
                logConversion(requestId, { value, from }, null, error);
                return res.status(400).json({ error: error.message });
        }

        const response = {
            originalValue: numericValue,
            originalUnit: from,
            convertedValue: result,
            convertedUnit: toUnit
        };

        logConversion(requestId, { value, from }, result);
        res.json(response);

    } catch (error) {
        logConversion(requestId, { value, from }, null, error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Unit Conversion API running at http://localhost:${port}`);
    console.log('Ready to handle conversion requests...\n');
});