import { defineConfig } from 'cypress';
import getCompareSnapshotsPlugin from 'cypress-visual-regression/dist/plugin.js';

import defaultConfig from '../../../cypress.config.mjs';

import { resolve } from 'node:path';

const screenshotsFolder = resolve('../../../','cypress/snapshots/actual');

console.log(screenshotsFolder)

export default defineConfig({
    ...defaultConfig,
    screenshotsFolder,
    trashAssetsBeforeRuns: true,
    env: {
        ALWAYS_GENERATE_DIFF: false,
        ALLOW_VISUAL_REGRESSION_TO_FAIL: true,
        SNAPSHOT_DIFF_DIRECTORY	: resolve('../../../','cypress/snapshots/diff'),
        SNAPSHOT_BASE: resolve('../../../','cypress/snapshots/base'),
        type: 'base'
    },
    e2e: {
        ...defaultConfig.e2e,
        setupNodeEvents(on, config) {
            getCompareSnapshotsPlugin(on, config);
        },
        specPattern: 'test/cypress/visual/**/*.cy.{js,jsx,ts,tsx}',
        video: false
    }
});
