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



 



import { loadModel, abc } from '../src/utils/loadModel';
import fs from 'fs';
import path from 'path';

// Avoid reassigning __dirname, it's a special Node.js variable - using currDir instead.
const currentDir = 'file://' + process.cwd();
console.log(currentDir);

test('adds 1 + 2 to equal 3', () => {
    expect(abc(1, 2)).toBe(3);
});

// test('checkLoadModel - stl', async () => {
//     const filePath = 'file://' + process.cwd() + 'dist/assets/models/logo.stl';

//     try {
//         await loadModel(filePath, 'stl');
//     } catch (error) {
//         throw error;
//     }
// });
