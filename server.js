require('dotenv').config();
require('./database/connection');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');

const express = require('express');
const app = express();
app.use(bodyParser.json());

// importing routes
const urlRoute = require('./routes/urlRoute');

// Rate Limiting Middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: {
        error: "Too many requests, please try again later.",
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply Rate Limiting Middleware Globally
app.use(limiter);

// using routes
app.use('/api/urls', urlRoute);

const PORT = process.env.PORT || require('./config/keys').PORT;

app.use(express.static('public'));

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    console.log(err);
});

module.exports = app;