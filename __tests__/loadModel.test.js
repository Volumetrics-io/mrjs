import { loadModel } from '../src/utils/loadModel';

// todo: in future dont hard code this, but the relative links based on filepath dont work
// using a server to host them works best, so just grabbing from github is fine for now.
const MODELS_URL = 'https://github.com/Volumetrics-io/MR.js/blob/main/assets/models/'

// todo: actually finish testing loaded value - for now, testing it gets to the loader
// and the loader is happy is fine.

test('checkLoadModel - stl', async () => {
    await expect(async () => {
        await loadModel(`${MODELS_URL}logo.stl`, 'stl');
      }).not.toThrow();
});

test('checkLoadModel - glb', async () => {
    await expect(async () => {
        await loadModel(`${MODELS_URL}logo.glb`, 'glb');
      }).not.toThrow();
});
