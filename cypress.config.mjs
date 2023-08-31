import { defineConfig } from 'cypress';
import getCompareSnapshotsPlugin from 'cypress-visual-regression/dist/plugin.js';
import { lighthouse, prepareAudit } from '@cypress-audit/lighthouse';

import { writeFile, mkdirSync, existsSync, readFileSync } from 'node:fs';
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
                    const reportsDir = join('tmp', 'lighthouseReports');
                    const outputDir = join(reportsDir, config.env.type);
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

                    if (config.env.type === 'actual') {
                        const baseLocation = join(reportsDir, 'base', `${demo}.json`);
                        if (existsSync(baseLocation)) {
                            const baseReport = JSON.parse(readFileSync(baseLocation, 'utf-8'));
                            const basePerformanceScore = baseReport.categories.performance.score;
                            const actualPerformanceScore = lighthouseReport.lhr.categories.performance.score;
                            const wiggleRoom = 0.03;

                            if (
                                actualPerformanceScore + wiggleRoom <
                                basePerformanceScore
                            ) {
                                throw new Error(`Performance score has decreased by more than ${wiggleRoom}.
(From ${basePerformanceScore} to ${actualPerformanceScore})`);
                            }


                        }


                    }
                })
            });
        },
        baseUrl: 'http://localhost:3030/samples/view?mobile=true&path=/',
        specPattern: 'test/cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
        supportFile: 'test/cypress/support/index.js',
        testIsolation: false
    }
});
