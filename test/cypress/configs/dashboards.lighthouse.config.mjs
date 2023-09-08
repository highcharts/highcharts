import { defineConfig } from 'cypress';
import { lighthouse, prepareAudit } from '@cypress-audit/lighthouse';

import { writeFile, mkdirSync, existsSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

import defaultConfig from '../../../cypress.config.mjs';

export default defineConfig({
    ...defaultConfig,
    env: {
        type: 'actual'
    },
    e2e: {
        ...defaultConfig.e2e,
        setupNodeEvents(on, config) {
            on('before:browser:launch', (browser = {}, launchOptions) => {
                prepareAudit(launchOptions);
            });
            on('task', {
                lighthouse: lighthouse(lighthouseReport => {
                    const reportsDir = resolve('../../../', 'tmp', 'lighthouseReports');

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
        specPattern: 'test/cypress/performance/**/*.cy.{js,jsx,ts,tsx}',
        video: false
    }
});
