# Highcharts Unit tests

Unit tests for the compiled Highcharts modules in pure Typescript + Node. No DOM required.

## Overview
These tests utilise the built-in [assert](https://nodejs.org/api/assert.html) and [test](https://nodejs.org/api/test.html) modules of Node,
as well as [tsx](https://tsx.is/) to run from TypeScript sources.

## How-to:
From the root folder run `node --import tsx --test test/ts-node-unit-tests/tests/**`.

Optionally the `--watch` flag can be used to automatically rerun on changes.

The tests will also run as part of the pre-commit script.

## Caveats
* `ts-node` doesn't support all the settings in `.tsconfig.json`, such as path rewriting. As a result, imports will have to be relative from the test folder.

## Benchmark tests

Run using `npm run benchmark`.

Optional arguments:
* `--context [base|actual]`, sets the context for comparisions
* `--pattern [regex]`, match benchmark files by the given pattern.
I.e. `*.bench.local.ts`.

Reports for each test will be output to `tmp/benchmarks/actual/` (or `tmp/benchmarks/base/` depending on the context).

### Benchmark files
Goes in `/ts-node-unit-tests/test/benchmarks/`. Tests files should generally
end with `.bench.ts`.

The file should be an ES-module containing a `config` object, a `before` function
and a default export, which is the main test.

The config for now only contains the sample sizes the test is run with.

The test can return any number, but generally it is assumed to be a duration.

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

