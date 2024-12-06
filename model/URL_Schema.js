const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const URL_Schema = new Schema({
    original_url: {
        type: String,
        required: true
    },
    short_url: {
        type: String,
        required: true
    },
    short_code: {
        type: String,
        unique: true,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    clicks: {
        type: Number,
        default: 0
    },
    customAlias: {
        type: String,
        unique: true,
        sparse: true
       
    }
});

module.exports = mongoose.model('URL_Schema', URL_Schema);