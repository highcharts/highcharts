# Cypress tests

Only two kinds of tests still run in [Cypress](https://docs.cypress.io/):

* **Dashboards visual regression**: `dashboards/visual/`, workflow `dashboards-visual-test.yml`.
* **Lighthouse audits** for Dashboards and Grid: `{dashboards,grid}/performance/`, workflows `dashboards-lighthouse-test.yml` and `grid-lighthouse-test.yml`.

All other tests are in Playwright, see [tests/README.md](../../tests/README.md).

## Running tests locally

Requires a build of the product and `highcharts-utils` on port 3030 (`npx highcharts-utils`). Both kinds of tests compare a base run with an actual run:

```sh
npx cypress run --config-file test/cypress/dashboards/visual.config.mjs --env type=base
npx cypress run --config-file test/cypress/grid/lighthouse.config.mjs --browser chrome --env type=actual
```
