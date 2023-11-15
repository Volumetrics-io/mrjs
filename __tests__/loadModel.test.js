import { loadModel, abc } from '../src/utils/loadModel';
import { jest } from '@jest/globals';
import fs from 'fs';

test('adds 1 + 2 to equal 3', () => {
    expect(abc(1, 2)).toBe(3);
});

// TODO - make this not a relative path

// Importing path module to resolve the file path
import path from 'path';

// Constructing the filePath to logo.stl

function checkLoadModel(filePath, extension) {
    expect(() => {
        loadModel(filePath, extension);
      }).not.toThrow();
}

test('checkLoadModel - stl', async () => {
        // console.log('__dirname:', __dirname);
        const filePath = path.resolve(__dirname, '..', 'dist', 'assets', 'models', 'logo.stl');
            console.log('Resolved path:', filePath);

    // loadModel('../dist/assets/models/logo.stl', 'stl');
    // const usingPath = path.resolve(process.cwd(), 'dist', 'assets', 'models', 'logo.stl');

    // Using async/await to handle potential asynchronous operations in loadModel
    await expect(async () => {
        await loadModel('../dist/assets/models/logo.stl', 'stl');
      }).not.toThrow();



    // try {
    //     await loadModel('../dist/assets/models/logo.stl', 'stl');
    // } catch (error) {
    //     // Handle any potential error thrown by loadModel
    //     console.error('Error loading model:', error);
    //     expect(error).toBeUndefined(); // Optionally, add an assertion to fail the test on error
    // }
});
test('checkLoadModel - gltf', () => {
    const usingPath = path.resolve(process.cwd(), 'dist', 'assets', 'models', 'logo.gltf');
    checkLoadModel(usingPath, "gltf");
});
test('checkLoadModel - glb', () => {
    const usingPath = path.resolve(process.cwd(), 'dist', 'assets', 'models', 'logo.glb');
    checkLoadModel(usingPath, "glb");
});
test('checkLoadModel - usd', () => {
    const usingPath = path.resolve(process.cwd(), 'dist', 'assets', 'models', 'logo.usd');
    checkLoadModel(usingPath, "usd");
});
test('checkLoadModel - usdz', () => {
    const usingPath = path.resolve(process.cwd(), 'dist', 'assets', 'models', 'logo.usdz');
    checkLoadModel(usingPath, "usdz");
});
