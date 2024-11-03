const puppeteer = require('puppeteer');

(async () => {
    try {
        // Launch a new browser
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Step 1: Navigate to the target website
        await page.goto('https://dood.li/d/cikdke2lbtd5', { waitUntil: 'domcontentloaded' });

        // Step 2: Scrape the initial download link
        const initialLink = await page.evaluate(() => {
            const button = document.querySelector('body > div:nth-child(8) > div > div.download-content > a');
            return button ? button.href : null;
        });

        if (!initialLink) {
            console.log('Initial download link not found.');
            await browser.close();
            return;
        }

       // console.log('Initial Download Link:', initialLink);

        // Step 3: Open the initial link in a new page
        const newPage = await browser.newPage();
        await newPage.goto(initialLink, { waitUntil: 'domcontentloaded' });

        // Step 4: Scrape the final download link from the new page
        const finalLink = await newPage.evaluate(() => {
            const downloadButton = document.querySelector('body > div > div > div > a'); // Adjust selector if necessary
            return downloadButton ? downloadButton.href : null;
        });

        if (finalLink) {
            console.log(finalLink);
        } else {
            console.log('Final download link not found.');
        }

        // Close the browser
        await browser.close();
    } catch (error) {
        console.error('Error in scraping process:', error);
    }
})();
