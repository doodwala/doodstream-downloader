const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3000;

// Route for scraping
app.get('/', async (req, res) => {
    const targetUrl = req.query.url;

    // Validate the URL
    if (!targetUrl || !/^https?:\/\//.test(targetUrl)) {
        return res.status(400).json({ error: 'Invalid URL format. Use a valid URL starting with http:// or https://.' });
    }

    try {
        // Launch Puppeteer
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Navigate to the target URL
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });

        // Scrape data from the page (adjust selector as needed)
        const data = await page.evaluate(() => {
            const button = document.querySelector('body > div:nth-child(8) > div > div.download-content > a');
            return button ? button.href : null;
        });

        await browser.close();

        if (data) {
            res.json({ Link: data });
        } else {
            res.status(404).json({ error: 'Download link not found.' });
        }

    } catch (error) {
        console.error('Error scraping:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
