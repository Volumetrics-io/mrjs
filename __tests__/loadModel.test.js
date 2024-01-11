import fetchMock from 'jest-fetch-mock';

import { Model } from '../src/utils/Model';

fetchMock.enableMocks();

const MRJS_TESTING_SERVER = 'https://localhost:8080';

// todo: in future dont hard code this, but the relative links based on filepath dont work
// using a server to host them works best, so just grabbing from github is fine for now.
const MODELS_URL = 'https://github.com/Volumetrics-io/MR.js/blob/main/assets/models/';

describe('loadModel function tests', () => {
  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto(MRJS_TESTING_SERVER);
  });

  test('checkLoadModel - stl', async () => {
    // Mock the network response for STL model
    fetchMock.mockResponseOnce('mocked STL model response');

    // Call your loadModel function with Puppeteer
    const response = await page.evaluate(() => 
      Model.loadModel('${MODELS_URL}logo.stl', 'stl')
    );

    expect(response).toBe('mocked STL model response'); // Update assertion as per your logic
  });

  test('checkLoadModel - glb', async () => {
    // Mock the network response for GLB model
    fetchMock.mockResponseOnce('mocked GLB model response');

    // Call your loadModel function with Puppeteer
    const response = await page.evaluate(() => 
      Model.loadModel('${MODELS_URL}logo.glb', 'glb')
    );

    expect(response).toBe('mocked GLB model response'); // Update assertion as per your logic
  });

  test('checkLoadModel - fbx', async () => {
    // Mock the network response for FBX model
    fetchMock.mockResponseOnce('mocked FBX model response');

    // Call your loadModel function with Puppeteer
    const response = await page.evaluate(() => 
      Model.loadModel('${MODELS_URL}logo.fbx', 'fbx')
    );

    expect(response).toBe('mocked FBX model response'); // Update assertion as per your logic
  });

  // Additional tests for GLB and FBX...
});
