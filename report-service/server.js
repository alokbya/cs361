const express = require('express');
const cors = require('cors');
const axios = require('axios');
const https = require('https');
const app = express();
const port = 3026;

// SSL Configuration for development
if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const petRemindersApi = axios.create({
    baseURL: 'https://localhost:7255',
    headers: {
        'Content-Type': 'application/json'
    },
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Helper function to filter events by date range
const filterEventsByDateRange = (events, startDate, endDate) => {
    // Parse the input dates as ISO 8601 strings to ensure they are treated as UTC
    const start = new Date(startDate);
    const end = new Date(new Date(endDate).setUTCHours(23, 59, 59, 999));

    console.log(`Filtering events from ${start.toISOString()} to ${end.toISOString()}`);

    // Filter the events based on the parsed dates
    return events.filter(event => {
        const eventDate = new Date(event.eventTime);
        console.log(`Event date: ${eventDate.toISOString()}`);
        const isInRange = eventDate >= start && eventDate <= end;
        console.log(`Is in range: ${isInRange}`);
        return isInRange;
    });
};

// HTML Report Generator function
const generateHtmlReport = (petName, data, startDate, endDate) => {
    const feedingsByDay = data.events.reduce((acc, event) => {
        const date = new Date(event.eventTime).toLocaleDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(event);
        return acc;
    }, {});

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Feeding Report - ${petName}</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 40px; 
                    color: #333;
                    line-height: 1.6;
                }
                .header { 
                    text-align: center; 
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #eee;
                }
                .report-info { 
                    margin-bottom: 20px;
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 5px;
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin-top: 20px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                th, td { 
                    border: 1px solid #ddd; 
                    padding: 12px 8px;
                    text-align: left;
                }
                th { 
                    background-color: #f4f4f4;
                    font-weight: 600;
                }
                tr:nth-child(even) { 
                    background-color: #f9f9f9;
                }
                tr:hover {
                    background-color: #f5f5f5;
                }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    color: #666;
                    font-size: 0.9em;
                }
                .stats {
                    display: flex;
                    justify-content: space-around;
                    margin: 20px 0;
                    text-align: center;
                }
                .stat-item {
                    padding: 10px;
                    background: #fff;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Feeding Report</h1>
                <h2>${petName}</h2>
            </div>
            
            <div class="report-info">
                <p><strong>Period:</strong> ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}</p>
            </div>

            <div class="stats">
                <div class="stat-item">
                    <h3>Total Feedings</h3>
                    <p>${data.events.length}</p>
                </div>
                <div class="stat-item">
                    <h3>Days Covered</h3>
                    <p>${Object.keys(feedingsByDay).length}</p>
                </div>
                <div class="stat-item">
                    <h3>Avg Feedings/Day</h3>
                    <p>${(data.events.length / Object.keys(feedingsByDay).length).toFixed(1)}</p>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Fed By</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.events.map(event => `
                        <tr>
                            <td>${new Date(event.eventTime).toLocaleDateString()}</td>
                            <td>${new Date(event.eventTime).toLocaleTimeString()}</td>
                            <td>${event.userName}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="footer">
                <p>Generated on ${new Date().toLocaleString()}</p>
            </div>
        </body>
        </html>
    `;
};

app.get('/api/feeding-report', async (req, res) => {
    const { petId, startDate, endDate, petName, format = 'json' } = req.query;

    if (!petId || !startDate || !endDate || !petName) {
        return res.status(400).json({
            error: 'Missing required fields. Please provide petId, petName, startDate, and endDate.'
        });
    }

    try {
        // Get events from C# API
        const response = await petRemindersApi.get(`/reminderevents/pet/${petId}`);
        const allEvents = response.data;
        
        // Filter events by date range
        const filteredEvents = filterEventsByDateRange(allEvents, startDate, endDate);

        const reportData = {
            petId,
            period: {
                start: startDate,
                end: endDate
            },
            events: filteredEvents
        };

        if (format === 'html') {
            const htmlContent = generateHtmlReport(petName, reportData, startDate, endDate);
            res.setHeader('Content-Type', 'text/html');
            res.setHeader('Content-Disposition', `attachment; filename="feeding-report-${petName}-${startDate}.html"`);
            return res.send(htmlContent);
        }

        res.json(reportData);

    } catch (error) {
        console.error('Error fetching data from C# API:', error);
        res.status(500).json({ 
            error: 'Failed to generate report',
            details: process.env.NODE_ENV !== 'production' ? error.message : undefined
        });
    }
});

app.listen(port, () => {
    console.log(`Pet Report Generator API running at http://localhost:${port}`);
});