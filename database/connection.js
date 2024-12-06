const MONGO_DB_URI = process.env.MONGO_DB_URI || require('../config/keys').MONGO_DB_URI;
const mongoose = require('mongoose');

mongoose.connect(MONGO_DB_URI)
        .then(() => {
            console.log("Conneted To Mongodb Database");
        })
        .catch((err) => {
            console.log(err);
        });

