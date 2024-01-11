export default {
    transform: {},
    rootDir: './',
    preset: 'jest-puppeteer',

    // Change the test environment to Puppeteer's environment
    testEnvironment: 'jest-environment-puppeteer',

    // Puppeteer specific configurations
    testEnvironmentOptions: {
        'jest-puppeteer': {
            launch: {
                headless: true,
                // Additional Puppeteer launch options
            },
        },
    },
}
