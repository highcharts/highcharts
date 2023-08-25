import { defineConfig } from 'cypress';
import getCompareSnapshotsPlugin from 'cypress-visual-regression/dist/plugin.js';
import { lighthouse, prepareAudit } from '@cypress-audit/lighthouse';

import { writeFile, mkdirSync } from 'node:fs';
import { join } from 'node:path';

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
            on('before:browser:launch', (browser = {}, launchOptions) => {
                prepareAudit(launchOptions);
            });
            on('task', {
                lighthouse: lighthouse(lighthouseReport => {
                    const outputDir = join('tmp', 'lighthouseReports', config.env.type);
                    mkdirSync(outputDir, { recursive: true });

                    const demo = lighthouseReport.lhr.requestedUrl
                        .replace(config.baseUrl, '')
                        .replaceAll('/', '-');

                    writeFile(
                        join(
                            outputDir,
                            `${demo}.json`
                        ),
                        lighthouseReport.report
                    );
                })
            });
        },
        baseUrl: 'http://localhost:3030/samples/view?mobile=true&path=/',
        specPattern: 'test/cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
        supportFile: 'test/cypress/support/index.js',
        testIsolation: false
    }
});
