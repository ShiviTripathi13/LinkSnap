const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statisticsSchema = new Schema({
    original_url: {
        type: String, 
        ref: 'URL', 
        required: true 
    },
    short_url: {
        type: String, 
        required: true 
    },
    short_code: {
        type: String, 
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
    referrers: [
        { 
            type: String 
        }
    ],
    user_agents: [
        { 
            type: String 
        }
    ],
    // for storing locations like 'US', 'IN', etc.
    geo_locations: [
        { 
            type: String 
        }
    ], 
    timestamps: [
        { 
            type: Date 
        }
    ]
});

module.exports = mongoose.model('statisticsSchema', statisticsSchema);