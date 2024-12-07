const URL_Schema = require('../model/URL_Schema');
const statisticsSchema = require('../model/statistics_Schema');
const { urlValidationSchema } = require('../middleware/urlValidation');
const qr = require('qr-image');
const he = require('he');

const createShortUrl = async (req, res) => {
    try {
        // to avoid HTML-encoding in the POST request body (e.g., &amp; instead of &)
        req.body.longUrl = he.decode(req.body.longUrl);
        const { longUrl, customAlias, expirationDate } = req.body;
        
        // Validate the request body using Joi
        const { error } = urlValidationSchema.validate({ longUrl, customAlias });
        if (error) {
            return res.status(400).json({
                error: error.details[0].message, // Return the first validation error
            });
        }

        const url = await URL_Schema.findOne({ original_url: longUrl, customAlias, expirationDate });
        if (url) {
            return res.json(url);
        }

        let shortCode;

        // Check for uniqueness only if customAlias is provided
        if (customAlias && customAlias.trim() !== "") {
            const existingAlias = await URL_Schema.findOne({ customAlias });
            if (existingAlias) {
                return res.status(400).json({ error: "Custom alias already exists" });
            }
            shortCode = customAlias;
        } else {
            // Generate random shortcode if no customAlias is provided
            shortCode = Math.random().toString(36).substring(2, 8);
        }
        const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
        const qrCode = qr.imageSync(shortUrl, { type: 'png' }).toString('base64');
        const newUrl = new URL_Schema({
            original_url: longUrl,
            short_url: shortUrl,
            short_code: shortCode,
            qr_code: qrCode,
            customAlias: customAlias && customAlias.trim() !== "" ? customAlias : null ,
            clicks: 0,
            expirationDate: expirationDate ? new Date(expirationDate) : null,
        });
        await newUrl.save();

        const newStats = new statisticsSchema({
            original_url: longUrl,
            short_url: shortUrl,
            short_code: shortCode,
            clicks: 0,
            referrers: [],
            user_agents: [],
            geo_locations: [],
            timestamps: [],
        });
        await newStats.save();
        
        res.json({shortUrl, qrCode, created_at: newUrl.created_at});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getUrls = async (req, res) => {
    try {
        const urls = await URL_Schema.find();
        res.json(urls);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const redirectUrl = async (req, res) => {
    try {
        const shortCode = req.params.code;
    
        if (!shortCode) {
            return res.status(400).json({ error: 'Short code is required' });
        }

        
        
        // Find the URL by its short code and increment the click count atomically
        const url = await URL_Schema.findOneAndUpdate(
            { short_code: shortCode },
            { $inc: { clicks: 1 } }, // Increment clicks by 1
            { new: true } // Return the updated document
        );

        const newStats = await statisticsSchema.findOneAndUpdate(
            { short_code: shortCode },
            { $inc: { clicks: 1 } }, // Increment clicks by 1
            { new: true } // Return the updated document
        );

        if (!url) {
            return res.status(404).json({ error: 'URL not found' });
        }

        // Check if the URL is expired
        if (url.expirationDate && new Date() > url.expirationDate) {
            return res.status(410).json({ error: 'URL has expired' });
        }
        
        // Check if the original_url is a valid URL
        const originalUrl = url.original_url;
        const isValidUrl = /^https?:\/\/\S+/i.test(originalUrl); // Validate URL format (must start with http:// or https://)

        if (!isValidUrl) {
            return res.status(400).json({ error: 'Invalid URL format' });
        }
        // Redirect the user to the original URL
        return res.redirect(originalUrl);
        // Redirect the user to the original URL
        // return res.redirect(url.original_url);
        
    } catch (error) {
      console.error('Error during URL redirection:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  
const getUrlDetails = async (req, res) => {
    try {
        const url = await URL_Schema.findOne({ short_code: req.params.code });
        if (!url) {
            return res.status(404).json({ error: 'Url not found' });
        }
        res.json({
            original_url: url.original_url,
            short_url: url.short_url,
            created_at: url.created_at,
            clicks: url.clicks,
            customAlias: url.customAlias,
            expirationDate: url.expirationDate,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const getStats = async (req, res) => {
    try {
        const url = await statisticsSchema.findOne({ short_code: req.params.code });
        if (!url) {
            return res.status(404).json({ error: 'Url not found' });
        }
        res.json({
            original_url: url.original_url,
            short_url: url.short_url,
            clicks: url.clicks,
            referrers: url.referrers,
            user_agents: url.user_agents,
            geo_locations: url.geo_locations,
            timestamps: url.timestamps,

        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const getQR = async (req, res) => {
    try {
        const url = await URL_Schema
        .findOne({ short_code: req.params.code });
        if (!url) {
            return res.status(404).json({ error: 'Url not found' });
        }

        res.setHeader('Content-Type', 'image/png');

        const qrCode = qr.image(url.short_code, { type: 'png' });
        qrCode.pipe(res);
    }
    catch (error) {
        console.error('QR Code Generation failed: ',error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const deleteUrl = async (req, res) => {
    try {
        const url = await URL_Schema.findOneAndDelete({ short_code: req.params.code });
        if (!url) {
            return res.status(404).json({ error: 'Url not found' });
        }
        res.json({url, message: 'Url deleted successfully'});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
module.exports = { createShortUrl, getUrls, redirectUrl, getUrlDetails, getStats, getQR, deleteUrl };