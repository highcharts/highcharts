import { defineConfig } from 'cypress';
import { getProducts } from './tools/gulptasks/lib/test.js';

const products = new Set();

for (const product of getProducts()) {
    switch (product) {
        case 'Dashboards':
            products.add('dashboards');
            continue;
        case 'Grid':
            // Grid tests run in Playwright
            continue;
        default:
            products.add('highcharts');
            continue;
    }
}

const productsPattern = (
    products.length ?
        `{${Array.from(products).join(',')}}` :
        '**'
);

export default defineConfig({
    fixturesFolder: 'test/cypress/fixtures',
    e2e: {
        baseUrl: 'http://localhost:3030/samples/view?mobile=true&path=/',
        specPattern: `test/cypress/${productsPattern}/integration/**/*.cy.{js,jsx,ts,tsx}`,
        supportFile: 'test/cypress/support/index.js',
        testIsolation: false
    }
});
