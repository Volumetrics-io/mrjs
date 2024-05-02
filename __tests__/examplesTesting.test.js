import * as puppeteer from 'puppeteer';
import fs from 'fs/promises';

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

        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
                console.error(`Console error: ${msg.text()}`);
            } else {
                console.log('PAGE LOG:', msg.text());
            }
        });

        // page.on('pageerror', error => {
        //     errors.push(error.toString());
        //     console.error(`Unhandled error: ${error}`);
        // });
    });

    afterAll(async () => {
        await browser.close();
    });

    fileNames.forEach(fileName => {
        test(`Page ${fileName} should load with no console errors`, async () => {
            errors = [];

            let htmlContent = await fs.readFile(`./dist/examples/${fileName}.html`, 'utf8');
            console.log(`Running test on: ./dist/examples/${fileName}.html`);

<<<<<<< Updated upstream
            // Adjust script path to load mr.js relatively, index.html is in propert spot already
            if (fileName != "../index") {
                htmlContent = htmlContent.replace(
                    `<script src="/mr.js"></script>`,
                    `<script src="../mr.js"></script>`
                );
=======
            // Adjust script and link paths
            if (fileName == "../index") {
                htmlContent = htmlContent.replace(
                    `<script src="/mr.js"></script>`,
                    `<script src="./dist/mr.js"></script>`);
                htmlContent = htmlContent.replace(
                    `<link rel="stylesheet" type="text/css" href="${fileName}-style.css" />`,
                    `<link rel="stylesheet" type="text/css" href="./dist/examples/${fileName}-style.css" />`);
>>>>>>> Stashed changes
            }
            
            await page.setContent(htmlContent);

<<<<<<< Updated upstream
=======
            // Assertions can be placed here if needed
            if (errors.length > 0) {
                console.log(`Console Errors in ${fileName}:`, errors);
            }
>>>>>>> Stashed changes
            expect(errors).toHaveLength(0);
        });
    });
});
