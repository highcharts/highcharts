import { defineConfig } from 'cypress';

// Base config for the Dashboards visual and the Lighthouse configs
export default defineConfig({
    fixturesFolder: 'test/cypress/fixtures',
    e2e: {
        baseUrl: 'http://localhost:3030/samples/view?mobile=true&path=/',
        supportFile: 'test/cypress/support/index.js',
        testIsolation: false
    }
});
