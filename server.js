require('dotenv').config();
require('./database/connection');
const express = require('express');
const app = express();


const PORT = process.env.PORT || require('./config/keys').PORT;

app.use(express.static('public'));

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    console.log(err);
});

module.exports = app;