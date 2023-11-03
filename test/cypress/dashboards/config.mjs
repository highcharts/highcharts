import { defineConfig } from 'cypress';

import defaultConfig from '../../../cypress.config.mjs';

export default defineConfig({
    ...defaultConfig,
    e2e: {
        ...defaultConfig.e2e,
        specPattern: 'test/cypress/{dashboards,data-grid}/integration/**/*.cy.{js,jsx,ts,tsx}'
    }
});
