import * as puppeteer from 'puppeteer';
import fs from 'fs/promises'; // Node.js file system module with promises

// todo: in future dont hard code this, but the relative links based on filepath dont work
// using a server to host them works best, so just grabbing from github is fine for now.
const fileNames = ['../index', 'anchors', 'audio', 'debug', 'embed', 'images', 'models', 'panels', 'skybox', 'video'];

describe('Test the Examples', () => {
    let browser;
    let page;
    let errors = [];

    beforeAll(async () => {
        browser = await puppeteer.launch({ headless: true });
        page = await browser.newPage();

        // Listen for console errors right after creating the page
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
                console.error(`Console error: ${msg.text()}`);
            }
        });

        // Catch unhandled promise rejections
        page.on('pageerror', error => {
            errors.push(error.toString());
            console.error(`Unhandled error: ${error}`);
        });
    });

    afterAll(async () => {
        await browser.close();
    });

    fileNames.forEach(fileName => {
        test(`Page ${fileName} should load with no console errors`, async () => {
            // Reset errors array for each file
            errors = [];

            let htmlContent = await fs.readFile(`./dist/examples/${fileName}.html`, 'utf8');
            console.log(`Running test on: ./dist/examples/${fileName}.html`);

            // Adjust script and link paths
            htmlContent = htmlContent.replace(
                `<script src="/mr.js"></script>`,
                `<script src="../dist/mr.js"></script>`);
            htmlContent = htmlContent.replace(
                `<link rel="stylesheet" type="text/css" href="${fileName}-style.css" />`,
                `<link rel="stylesheet" type="text/css" href="./dist/examples/${fileName}-style.css" />`);

            await page.setContent(htmlContent);
            await page.waitForTimeout(1000); // wait for a second to allow all scripts to execute

            // Assertions can be placed here if needed
            expect(errors).toHaveLength(0);
        });
    });
});
