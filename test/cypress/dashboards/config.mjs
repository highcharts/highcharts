import { defineConfig } from 'cypress';

import defaultConfig from '../../../cypress.config.mjs';

export default defineConfig({
    ...defaultConfig,
    e2e: {
        ...defaultConfig.e2e,
        // Dashboards-only specs (no Grid integration tests here)
        specPattern: 'test/cypress/dashboards/integration/**/*.cy.{js,jsx,ts,tsx}'
    }
});
