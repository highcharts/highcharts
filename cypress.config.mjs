import { defineConfig } from 'cypress';
import { getProducts } from './tools/gulptasks/lib/test.js';

const products = [];

for (const product of getProducts()) {
    switch (product) {
        case 'Dashboards':
            if (!products.includes('dashboards')) {
                products.push('dashboards');
            }
            if (!products.includes('data-grid')) {
                products.push('data-grid');
            }
            continue;
        default:
            if (!products.includes('highcharts')) {
                products.push('highcharts');
            }
            continue;
    }
}

const productsPattern = products.length ? `{${products.join(',')}}` : '**';

export default defineConfig({
    fixturesFolder: 'test/cypress/fixtures',
    e2e: {
        baseUrl: 'http://localhost:3030/samples/view?mobile=true&path=/',
        specPattern: `test/cypress/${productsPattern}/integration/*.cy.{js,jsx,ts,tsx}`,
        supportFile: 'test/cypress/support/index.js',
        testIsolation: false
    }
});
