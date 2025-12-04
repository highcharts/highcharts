import { defineConfig } from 'cypress';

import defaultConfig from '../../../cypress.config.mjs';
import { readdirSync } from 'node:fs';

const gridLiteDir = '../../../samples/grid-lite/';
const gridProDir =  '../../../samples/grid-pro/';

function getDemoFiles(dir) {
    return readdirSync(dir,{ recursive: true })
        .filter((file) => file.endsWith('.html'))
        .map((file) => file.replace('\/demo.html', ''));
}

export default defineConfig({
    ...defaultConfig,
    e2e: {
        ...defaultConfig.e2e,
        specPattern: 'test/cypress/grid/integration/**/*.cy.{js,jsx,ts,tsx}',
        setupNodeEvents(on, config) {
            config.env.demoPaths = {
                gridLitePaths: getDemoFiles(gridLiteDir),
                gridProPaths: getDemoFiles(gridProDir)
            };
            return config;
        }
    }
});
