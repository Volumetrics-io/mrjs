export default {
    transform: {},
    rootDir: './',
    preset: 'jest-puppeteer',
    testMatch: ['**/__tests__/**/*.js'],
    testEnvironment: 'jest-environment-puppeteer',

    // Puppeteer specific configurations
    testEnvironmentOptions: {
        'jest-puppeteer': {
            launch: {
                headless: "new", // new instead of true due to chromium change, this'll prob need to change back later
                ignoreHTTPSErrors: true, // Add this line
            },
        },
    },
}
