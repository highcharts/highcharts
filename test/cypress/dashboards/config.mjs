import { defineConfig } from 'cypress';

import defaultConfig from '../../../cypress.config.mjs';
import { readdirSync } from 'node:fs';

const dashboardsDir = '../../../samples/dashboards/';

function getDemoFiles(dir) {
    return readdirSync(dir,{ recursive: true })
        .filter((file) => file.endsWith('.html'))
        .map((file) => file.replace('\/demo.html', ''));
}

export default defineConfig({
    ...defaultConfig,
    e2e: {
        ...defaultConfig.e2e,
        specPattern: 'test/cypress/dashboards/integration/**/*.cy.{js,jsx,ts,tsx}',
        setupNodeEvents(on, config) {
            config.env.demoPaths = {
                dashboardsPaths: getDemoFiles(dashboardsDir),
            };
            return config;
        }
    }
});
