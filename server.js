require('dotenv').config();
require('./database/connection');
const bodyParser = require('body-parser');

const express = require('express');
const app = express();
app.use(bodyParser.json());

// importing routes
const urlRoute = require('./routes/urlRoute');

const {redirectUrl} = require('./controller/urlController');
app.get('/:code', redirectUrl);

// Rate limiting
const apiLimiter = require('./middleware/apiLimiter');
app.use('/api/', apiLimiter);


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