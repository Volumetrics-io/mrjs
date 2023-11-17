// import { loadModel, abc } from '../src/utils/loadModel';
// import { jest } from '@jest/globals';
// import fs from 'fs';
// import path from 'path';
// const __dirname = path.resolve();

// test('adds 1 + 2 to equal 3', () => {
//     expect(abc(1, 2)).toBe(3);
// });

// test('checkLoadModel - stl', async () => {
//     const filePath = path.resolve(__dirname, '..', 'dist', 'assets', 'models', 'logo.stl');

//     // Using async/await to handle potential asynchronous operations in loadModel
//     await expect(async () => {
//         await loadModel(filePath, 'stl');
//       }).not.toThrow();
// });



 



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
