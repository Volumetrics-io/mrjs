const { chromium } = require('playwright');

describe('Model Loading Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await chromium.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:3000'); // Replace with the URL of your three.js app
  });

  afterEach(async () => {
    await page.close();
  });

  test('check model loading - stl', async () => {
    // Replace the below selector with an appropriate one for your stl model
    const modelLoaded = await page.waitForSelector('#stl-model', { state: 'attached' });
    expect(modelLoaded).toBeTruthy();
  });

  test('check model loading - glb', async () => {
    // Replace the below selector with an appropriate one for your glb model
    const modelLoaded = await page.waitForSelector('#glb-model', { state: 'attached' });
    expect(modelLoaded).toBeTruthy();
  });

  test('check model loading - fbx', async () => {
    // Replace the below selector with an appropriate one for your fbx model
    const modelLoaded = await page.waitForSelector('#fbx-model', { state: 'attached' });
    expect(modelLoaded).toBeTruthy();
  });

  // Add any additional tests specific to your application
});
