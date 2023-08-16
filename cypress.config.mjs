import { defineConfig } from 'cypress';
import getCompareSnapshotsPlugin from 'cypress-visual-regression/dist/plugin.js';

export default defineConfig({
    env: {
        screenshotsFolder: './cypress/snapshots/actual',
        trashAssetsBeforeRuns: true,
        video: false,
        ALWAYS_GENERATE_DIFF: false,
        ALLOW_VISUAL_REGRESSION_TO_FAIL: true,
        type: 'base' // default screenshot type, can be 'actual' or 'base'
    },
    fixturesFolder: 'test/cypress/fixtures',
    e2e: {
        setupNodeEvents(on, config) {
            getCompareSnapshotsPlugin(on, config);
        },
        baseUrl: 'http://localhost:3030/samples/view?mobile=true&path=/',
        specPattern: 'test/cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
        supportFile: 'test/cypress/support/index.js',
        testIsolation: false
    }
});
