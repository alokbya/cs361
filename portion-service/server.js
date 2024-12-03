const express = require('express');
const cors = require('cors'); // You'll need to install this package
const app = express();
const port = 3025;

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Your React app's URL
  methods: ['POST'], // We only need POST for this API
  allowedHeaders: ['Content-Type']
}));

// Middleware to parse JSON bodies
app.use(express.json());

// POST endpoint for calculating portion size
app.post('/api/calculate-portion', (req, res) => {
    const { weight, age, id } = req.body;

    // Validate required fields
    if (!weight || !age || !id) {
        return res.status(400).json({ 
            error: 'Missing required fields. Please provide weight, age, and id.' 
        });
    }

    // Portion calculation logic
    function calculatePortion(weight, age) {
        let dailyAmount = weight * 1;
        
        if (age < 1) {
            dailyAmount *= 1.2;
        } else if (age >= 7) {
            dailyAmount *= 0.8;
        }
        
        const perMealPortion = Math.round(dailyAmount / 2);
        return perMealPortion;
    }

    const portion = calculatePortion(weight, age);

    res.json({
        portion: `${portion}oz`
    });
});

app.listen(port, () => {
    console.log(`Pet Portion Calculator API running at http://localhost:${port}`);
});