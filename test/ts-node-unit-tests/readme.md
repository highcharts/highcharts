# Highcharts Unit tests

Unit tests for the compiled Highcharts modules in pure Typescript + Node. No DOM required.

## Overview

These tests utilise the built-in [assert](https://nodejs.org/api/assert.html) module of Node.

The test-runner (found in `index.ts`) runs through every exported function of any `.test.ts` file in `ts-node-unit-tests/tests/`. If the exported function throws an error, the test is considered as failing.

## How-to:

From the root folder run `npx ts-node test/ts-node-unit-tests`.

The tests will also run as part of the pre-commit script.

## Caveats

-   `ts-node` doesn't support all the settings in `.tsconfig.json`, such as path rewriting. As a result, imports will have to be relative from the test folder.
