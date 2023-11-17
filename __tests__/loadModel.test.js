import { loadModel } from '../src/utils/loadModel';

// todo: in future dont hard code this, but the relative links based on filepath dont work
// using a server to host them works best, so just grabbing from github is fine for now.
const MODELS_URL = 'https://github.com/Volumetrics-io/MR.js/blob/main/assets/models/'

test('checkLoadModel - stl', async () => {
    // Using async/await to handle potential asynchronous operations in loadModel
    await expect(async () => {
        await loadModel(`${MODELS_URL}logo.stl`, 'stl');
      }).not.toThrow();
});

test('checkLoadModel - glb', async () => {
    // Using async/await to handle potential asynchronous operations in loadModel
    await expect(async () => {
        await loadModel(`${MODELS_URL}logo.glb`, 'glb');
      }).not.toThrow();
});
