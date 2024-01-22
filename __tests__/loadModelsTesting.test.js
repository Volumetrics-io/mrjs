import * as puppeteer from 'puppeteer';

// todo: in future dont hard code this, but the relative links based on filepath dont work
// using a server to host them works best, so just grabbing from github is fine for now.
const MODELS_URL = 'https://github.com/Volumetrics-io/mrjs/main/samples/assets/models/'

describe('loadModel Function', () => {
    let browser;
    let page;
    let errors = [];

    beforeAll(async () => {
        browser = await puppeteer.launch({ headless: "new" });
        page = await browser.newPage();

        // Listen for console events and record any errors
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });

        console.log(`Running LoadModel function tests`);

        // Define your HTML content
        const htmlContent = `
            <!DOCTYPE html>
            <html>
                <meta charset="utf-8">
                <title>MR.js - TEST PAGE</title>
                <meta name="description" content="TEST PAGE">
                <script src="../dist/mr.js"></script>
                <link rel="stylesheet" type="text/css" href="./style.css" />
                <meta name="viewport" content="width=device-width, initial-scale=1">
            <body>
                <mr-app>
                    <mr-panel class="layout">
                        <mr-div>
                            <mr-model src="${MODELS_URL}logo.glb">
                            </mr-model>
                            <mr-model src="${MODELS_URL}logo.stl">
                            </mr-model>
                            <mr-model src="${MODELS_URL}logo.fbx">
                            </mr-model>
                        </mr-div>
                    </mr-panel>
                </mr-app>
            </body>
            </html>
        `;

        // Set the content of the page
        await page.setContent(htmlContent);
    });

    afterAll(async () => {
        await browser.close();
    });

    test('Page should load with no console errors', async () => {
        if (errors.length > 0) {
            console.log(`Console Errors:`, errors);
        }
        expect(errors).toHaveLength(0);
    });
});
