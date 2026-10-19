# Highcharts Node tests

Node tests for Highcharts modules and repository tooling. No DOM required.

## Overview
These tests utilise the built-in [assert](https://nodejs.org/api/assert.html) and [test](https://nodejs.org/api/test.html) modules of Node,
as well as [tsx](https://tsx.is/) to run from TypeScript sources.

## How-to:
From the repository root, run `npm run test-node` for the module and doclet
tests, or `npm run test-node:tooling` for the visual and benchmark tooling
tests. The module command builds Highcharts before running the tests. The
tooling command does not need a build.

Run `npm run test-node:watch` to rerun module tests on changes.

The module tests also run as part of the pre-commit script and the Highcharts CI
workflow's Node unit tests job. Dependency changes in `package.json` or
`package-lock.json` trigger the workflow as well.

Relevant staged files trigger the tooling tests through lint-staged. The Test
tooling workflow runs them on Linux and Windows with both LTS and latest
Node.js. Nightly CI runs both commands.

## Caveats
* `ts-node` doesn't support all the settings in `.tsconfig.json`, such as path rewriting. As a result, imports will have to be relative from the test folder.

## Benchmark tests

Run using `npm run benchmark`.

Optional arguments:
* `--context [base|actual]`, sets the context for comparisions
* `--pattern [substring]`, match file paths containing the literal text, e.g.
  `Stock/` or `.bench.local.ts`. Regular expressions and wildcards are not
  interpreted.

Reports for each test will be output to `tmp/benchmarks/actual/` (or `tmp/benchmarks/base/` depending on the context).

### Benchmark files
Goes in `/ts-node-unit-tests/test/benchmarks/`. Tests files should generally
end with `.bench.ts`.

The file should be an ES-module containing a `config` object, a `before` function
and a default export, which is the main test.

The config for now only contains the sample sizes the test is run with.

The test must return a finite number (including zero), usually a duration.

Import errors, missing default functions, invalid results and failed benchmark
iterations stop the runner with a nonzero exit code. Failed iterations are not
recorded as timings.

The `before` function is optional, but if defined it should return an object that contains a fileName and a function used to generate a dataset. The dataset is cached locally to speed up the total testing time.

```ts
export const config = {
    sizes: [100, 1000, 10_000, 100_000, 1_000_000, 2_500_000]
}

export function before(size: number) {
    return {
        fileName: `data-${size}.json`,
        func: () => generateColumnData(size, 5)
    }
}

export default async function benchmarkTest(
    {
        CODE_PATH,
        data,
        size
    }: BenchmarkContext
): Promise<BenchmarkResult> {

    // setup

    performance.mark('Start');

    // Code to be benchmarked

    performance.mark('End');

    return performance.measure('Start to Now', 'Start', 'End').duration;
}

```


### Comparison
To compare the base case vs your current performance you can run `npm run benchmark-compare`.

This will produce a `table.md`, containing a comparison of the averages from each context, and a `report.html` containing Highcharts™️  visualizations of the data.

