export default {
    testEnvironment: 'node',
    transform: {},
    testMatch: ['**/*.test.js'],
    setupFiles: ['@esm'],
    preset: 'ts-jest',
    extensionsToTreatAsEsm: ['.js'],
    transformIgnorePatterns: [],
}
