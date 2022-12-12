import { defineConfig } from 'cypress'

export default defineConfig({
  fixturesFolder: 'test/cypress/fixtures',
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: 'http://localhost:3030/samples/view?mobile=true&path=/',
    specPattern: 'test/cypress/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'test/cypress/support/index.js',
    testIsolation: false,
  },
})
