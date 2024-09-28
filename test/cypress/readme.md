# Cypress tests

[Cypress](https://docs.cypress.io/) tests for Highcharts.

## Why Cypress?

Cypress allows us to more easily run tests that simulate user interactions, by automating clicks, keyboard inputs, and browser events. It also has functionality that can make prototyping easier, including [stubbing and spying](https://docs.cypress.io/guides/guides/stubs-spies-and-clocks), and being able to [simulate network requests](https://docs.cypress.io/guides/guides/network-requests).

If your tests does not require any of these features, consider if it is better to use [Karma](../readme.md) or the [Node-based](../ts-node-unit-tests/readme.md) setup. One reason to prefer Karma is that the tests are run on a broader range of browsers and operating systems.

## Overview

Tests go in `test/cypress/integration/{product}/`.

Since we are using `highcharts-utils` for our server we can re-use current samples for testing. If you prefer to create a new sample for the Cypress test it should be placed in `samples/cypress/`.

Re-usable commands can be added in `test/cypress/support/index.js`.

Screenshots and videos will end up in the top-level `cypress` folder, which should be ignored by git.

## Testing best practices

The Cypress docs has a good [article](https://docs.cypress.io/guides/references/best-practices) on this, but here are a few key takeaways:
  * Avoid doing time-consuming operations in the `beforeEach`/`afterEach` hooks, such as navigating to a page. This can add unnecessary time to each test.
  * Similarly, avoid using timeouts with `cy.wait()` if it is not necessary.
  * It is usually better to chain together tests when possible.

## Running tests locally

Requires `highcharts-utils` to be running (`npx highcharts-utils` should do the trick). Cypress can then be run in the CLI using `npx cypress run`. Run `npx cypress info` to get a list of available browsers. To run a specific test, use the `--spec` parameter, like `npx cypress run --spec "test/cypress/integration/Highcharts/mouse-wheel-zoom/zoom-chart.cy.js"`.

For good amount of helpful debugging functionality you can also use the GUI with `npx cypress open`.