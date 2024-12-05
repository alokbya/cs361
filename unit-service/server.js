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

// Middleware to parse JSON bodies
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

// GET endpoint for converting oz to grams
app.get('/api/convert', (req, res) => {
    const { value, from } = req.query;

    // Validate required fields
    if (!value || !from) {
        return res.status(400).json({
            error: 'Missing required fields. Please provide value and from unit.'
        });
    }

    // Validate numeric value
    const numericValue = Number(value);
    if (isNaN(numericValue)) {
        return res.status(400).json({
            error: 'Value must be a valid number.'
        });
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
            return res.status(400).json({
                error: 'Invalid unit. Please use "oz" or "grams".'
            });
    }

    res.json({
        originalValue: numericValue,
        originalUnit: from,
        convertedValue: result,
        convertedUnit: toUnit
    });
});

app.listen(port, () => {
    console.log(`Unit Conversion API running at http://localhost:${port}`);
});