import * as puppeteer from 'puppeteer';
import fs from 'fs/promises'; // Node.js file system module with promises

// todo: in future dont hard code this, but the relative links based on filepath dont work
// using a server to host them works best, so just grabbing from github is fine for now.
const MODELS_URL = 'https://github.com/Volumetrics-io/mrjs/main/samples/assets/models/'

const fileNames = ['../index', 'anchors', 'embed']; // Replace with your actual file names

describe('Test the Examples', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({ headless: "new" });
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    fileNames.forEach(fileName => {
        test(`Page ${fileName} should load with no console errors`, async () => {
            let errors = [];

            page.on('console', msg => {
                if (msg.type() === 'error') {
                    errors.push(msg.text());
                }
            });

            // Define your HTML content from the sample
            let htmlContent = await fs.readFile(`./dist/examples/${fileName}.html`, 'utf8');
            console.log(`Running test on: ./dist/examples/${fileName}.html`);
            // Modify the src and style tag to be for this example.
            htmlContent = htmlContent.replace(
                `<script src="/mr.js"></script>`,
                `<script src="../dist/mr.js"></script>`);
            htmlContent = htmlContent.replace(
                `<link rel="stylesheet" type="text/css" href="${fileName}-style.css" />`,
                `<link rel="stylesheet" type="text/css" href="./dist/examples/${fileName}-style.css" />`);

            await page.setContent(htmlContent);

            if (errors.length > 0) {
                console.log(`Console Errors in ${fileName}:`, errors);
            }
            expect(errors).toHaveLength(0);
        });
    });
});
