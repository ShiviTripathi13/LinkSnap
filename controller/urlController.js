const URL_Schema = require('../model/URL_Schema');
const { urlValidationSchema } = require('../validation-middleware/urlValidation');
const qr = require('qr-image');

const createShortUrl = async (req, res) => {
    try {
        const { longUrl, customAlias } = req.body;
        // Validate the request body using Joi
        const { error } = urlValidationSchema.validate({ longUrl, customAlias });
        if (error) {
            return res.status(400).json({
                error: error.details[0].message, // Return the first validation error
            });
        }

        const url = await URL_Schema.findOne({ original_url: longUrl, customAlias });
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
        });
        await newUrl.save();
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
      // Find the URL by its short code
      const url = await URL_Schema.findOne({ short_code: req.params.code });
      
      if (!url) {
        return res.status(404).json({ error: 'URL not found' });
      }
  
      // Increment the click count by 1
      url.clicks += 1;
  
      // Save the updated click count in the database
      await url.save();
  
      // Redirect the user to the original URL
      res.redirect(url.original_url);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
const getUrlDetails = async (req, res) => {
    try {
        console.log(req.params.code);
        const url = await URL_Schema.findOne({ short_code: req.params.code });
        if (!url) {
            return res.status(404).json({ error: 'Url not found' });
        }
        res.json({
            original_url: url.original_url,
            short_url: url.short_url,
            created_at: url.created_at,
            clicks: url.clicks,
            customAlias: url.customAlias
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
const getStats = async (req, res) => {
    try {
        const url = await URL_Schema.findOne({ short_code: req.params.code });
        if (!url) {
            return res.status(404).json({ error: 'Url not found' });
        }
        res.json({ clicks: url.clicks });
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