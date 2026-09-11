# Playwright Testing

This directory contains the Playwright test suite for Highcharts products.

## Table of Contents

- [Installation](#installation)
- [Your First Test](#your-first-test)
- [Running Tests](#running-tests)
- [Viewing Results](#viewing-results)
- [Writing Tests](#writing-tests)
  - [Using createChart](#using-createchart)
  - [Testing with Modules](#testing-with-modules)
  - [Testing Stock Charts](#testing-stock-charts)
  - [Testing Map Charts](#testing-map-charts)
  - [Manual Page Setup](#manual-page-setup)
  - [Using ESM Modules](#using-esm-modules)
  - [Custom Container Element](#custom-container-element)
  - [Adding Custom CSS](#adding-custom-css)
- [Best Practices](#best-practices)
- [Route Rewrites](#route-rewrites)
- [Path Aliases](#path-aliases)
- [Debugging](#debugging)
  - [QUnit browser logs](#qunit-browser-logs)
- [Environment Variables](#environment-variables)
- [Playwright Visual Comparisons](#playwright-visual-comparisons)
- [FAQ](#faq)
- [Common Issues](#common-issues)
- [Resources](#resources)

## Installation

```sh
npm i
```

```sh
# Install Playwright browsers (first time only)
npx playwright install
```

## Your First Test

This section walks you through creating and running a simple test.

### 1. Create the Test File

Create a new file at `tests/highcharts/chart/my-first-test.spec.ts`:

```typescript
import { test, expect, createChart } from '~/fixtures.ts';

test('chart renders with correct title', async ({ page }) => {
    // Create a chart with some basic options
    const chart = await createChart(page, {
        title: { text: 'Hello Highcharts' },
        series: [{
            type: 'line',
            data: [1, 3, 2, 4]
        }]
    });

    // Verify the title rendered correctly
    const title = await chart.evaluate(c => c.title.textStr);
    expect(title).toBe('Hello Highcharts');
});
```

### 2. Run the Test

```sh
npx playwright test tests/highcharts/chart/my-first-test.spec.ts
```

You should see output indicating the test passed.

### 3. Understanding the Code

- **`test('...', async ({ page }) => { ... })`** - Defines a test. The `page` object is Playwright's representation of a browser tab.

- **`createChart(page, options)`** - A helper function that loads Highcharts in the browser and creates a chart with the given options. It returns a handle to the chart object.

- **`chart.evaluate(c => ...)`** - Runs a function inside the browser and returns the result. The `c` parameter is the actual Highcharts chart instance. Use this to inspect chart properties or call chart methods.

- **`expect(...).toBe(...)`** - Playwright's assertion syntax. If the values don't match, the test fails.

### 4. Try Interactive Mode

Run your test with the UI to see what's happening:

```sh
npx playwright test tests/highcharts/chart/my-first-test.spec.ts --ui
```

Or run in headed mode to watch the browser:

```sh
npx playwright test tests/highcharts/chart/my-first-test.spec.ts --headed
```

## Running Tests

### By Project

```sh
npx playwright test --project=highcharts
npx playwright test --project=dashboards
npx playwright test --project=qunit
npx playwright test --project=internal
npx playwright test --project=visual [--update-snapshots]
```

Available projects include browser variants:

- `highcharts`, `highcharts-firefox`, `highcharts-webkit`
- `dashboards`, `dashboards-firefox`, `dashboards-webkit`
- `qunit`, `qunit-firefox`
- `visual`, `internal`

### By File

```sh
npx playwright test tests/highcharts/themes/themes.spec.ts
```

### Interactive Modes

```sh
# UI mode (interactive test explorer)
npx playwright test --ui

# Headed mode (see browser)
npx playwright test --project=highcharts --headed

# Debug mode (step through tests)
npx playwright test --project=highcharts --debug
```

## Viewing Results

```sh
# Open HTML report after test run
npx playwright show-report
```

## Writing Tests

### Using createChart

The `createChart` utility from `fixtures` creates a chart with sensible defaults for testing:

```typescript
const chart = await createChart(
    page,
    { /* Highcharts options */ },
    { /* Options for chart creation */ }
);
```

Available options for `createChart`:

| Option | Default | Description |
|--------|---------|-------------|
| `container` | `'container'` | Container element ID or `ElementHandle` |
| `modules` | `[]` | Highcharts modules to load (e.g., `['modules/exporting.js']`) |
| `chartConstructor` | `'chart'` | Constructor method: `'chart'`, `'stockChart'`, `'ganttChart'`, `'mapChart'` |
| `HC` | `undefined` | Custom Highcharts instance (for ESM usage) |
| `css` | `''` | Custom CSS to inject |
| `applyTestOptions` | `true` | Disable animations and certain features for testing |
| `emulateKarma` | `false` | Load all scripts from karma-files.json |
| `chartCallback` | `undefined` | Callback function passed to the chart constructor |

### Testing with Modules

```typescript
const chart = await createChart(
    page,
    { /* options */ },
    {
        modules: ['modules/exporting.js', 'modules/accessibility.js']
    }
);
```

### Testing Stock Charts

```typescript
const chart = await createChart(
    page,
    {
        rangeSelector: { selected: 1 },
        series: [{ data: [[1, 10], [2, 20], [3, 30]] }]
    },
    { chartConstructor: 'stockChart' }
);
```

### Testing Map Charts

```typescript
const chart = await createChart(
    page,
    {
        chart: { map: 'custom/world' },
        series: [{ data: [['us', 10], ['gb', 20]] }]
    },
    { chartConstructor: 'mapChart' }
);
```

### Manual Page Setup

When you need full control over the page setup (custom HTML, ESM modules, or manual Highcharts loading), you can set up a page manually instead of using `createChart`.

There are two main approaches:

#### Using `page.setContent()`

Inject HTML directly into the page:

```typescript
import { test, expect, setupRoutes } from '~/fixtures.ts';

test('manual page setup', async ({ page }) => {
    // Routes are already set up via the fixture, but you can also call
    // setupRoutes manually if using base test: await setupRoutes(page);

    await page.setContent(`
        <!DOCTYPE html>
        <html>
        <head>
            <script src="https://code.highcharts.com/highcharts.src.js"></script>
            <style>
                #container { width: 600px; height: 400px; }
            </style>
        </head>
        <body>
            <div id="container"></div>
        </body>
        </html>
    `);

    // Wait for Highcharts to load
    await page.waitForFunction(() => !!window.Highcharts);

    // Create chart manually
    const chart = await page.evaluateHandle(() => {
        return window.Highcharts.chart('container', {
            series: [{ data: [1, 2, 3] }]
        });
    });

    // Run assertions
    const pointCount = await chart.evaluate(c => c.series[0].data.length);
    expect(pointCount).toBe(3);
});
```

#### Using `page.goto()`

Navigate to an existing HTML file or URL:

```typescript
import { test, expect } from '~/fixtures.ts';

test('test existing sample', async ({ page }) => {
    // Navigate to a sample page
    await page.goto('/samples/highcharts/demo/line-basic/index.html');

    // Wait for Highcharts to be available
    await page.waitForFunction(() => !!window.Highcharts);

    // Get the chart instance
    const chart = await page.evaluateHandle(() => {
        return window.Highcharts.charts[0];
    });

    // Run assertions
    const title = await chart.evaluate(c => c.title.textStr);
    expect(title).toBeTruthy();
});
```

This is useful when testing existing demos or samples in the repository.

### Using ESM Modules

```typescript
import { test, expect } from '~/fixtures.ts';

test('ESM module setup', async ({ page }) => {
    await page.setContent(`
        <!DOCTYPE html>
        <html>
        <body>
            <div id="container"></div>
        </body>
        </html>
    `);

    // Load Highcharts via ESM and get a handle to it
    const HC = await page.evaluateHandle(async () => {
        const Highcharts = await import(
            'https://code.highcharts.com/esm/highcharts.src.js'
        );
        // Load additional modules
        await import(
            'https://code.highcharts.com/esm/modules/exporting.src.js'
        );
        return Highcharts.default;
    });

    // Create chart using the ESM Highcharts instance
    const chart = await page.evaluateHandle(
        (Highcharts) => {
            return Highcharts.chart('container', {
                title: { text: 'ESM Chart' },
                series: [{ data: [1, 2, 3, 4, 5] }]
            });
        },
        HC
    );

    const title = await chart.evaluate(c => c.title.textStr);
    expect(title).toBe('ESM Chart');
});
```

You can also pass a pre-loaded Highcharts instance to `createChart`:

```typescript
import { test, expect, createChart } from '~/fixtures.ts';

test('createChart with ESM', async ({ page }) => {
    await page.setContent('<div id="container"></div>');

    // Load Highcharts with indicators via ESM
    const HC = await page.evaluateHandle(async () => {
        await import(
            'https://code.highcharts.com/esm/modules/stock-tools.src.js'
        );
        return (await import(
            'https://code.highcharts.com/esm/indicators/indicators-all.src.js'
        )).default;
    });

    const chart = await createChart(
        page,
        {
            series: [{
                type: 'line',
                data: [1, 2, 3, 4, 5]
            }]
        },
        { HC }
    );

    expect(await chart.evaluate(c => c.series.length)).toBe(1);
});
```

### Custom Container Element

```typescript
import { test, expect, createChart } from '~/fixtures.ts';

test('custom container element', async ({ page }) => {
    await page.setContent('<div class="my-chart-wrapper"></div>');

    const container = await page.locator('.my-chart-wrapper').elementHandle();

    const chart = await createChart(
        page,
        {
            series: [{ data: [1, 2, 3] }]
        },
        { container }
    );

    const renderedTo = await chart.evaluate(
        c => c.renderTo.className
    );
    expect(renderedTo).toBe('my-chart-wrapper');
});
```

### Adding Custom CSS

```typescript
import { test, expect, createChart } from '~/fixtures.ts';

test('chart with custom CSS', async ({ page }) => {
    const chart = await createChart(
        page,
        {
            series: [{ data: [1, 2, 3] }]
        },
        {
            css: `
                #container {
                    width: 800px;
                    height: 600px;
                    border: 1px solid #ccc;
                }
            `
        }
    );

    const width = await chart.evaluate(c => c.chartWidth);
    expect(width).toBe(800);
});
```

## Best Practices

### Keep Tests Isolated

By default, each test gets a fresh browser context. This ensures tests don't affect each other and can run in parallel. Prefer this approach for most tests:

```typescript
test('first test', async ({ page }) => {
    // Fresh browser context
});

test('second test', async ({ page }) => {
    // Another fresh browser context
});
```

Use `test.describe` blocks to group related tests and share setup logic via `beforeEach`/`afterEach` hooks:

```typescript
test.describe('axis formatting', () => {
    test.beforeEach(async ({ page }) => {
        // Common setup for all tests in this block
    });

    test('formats date axis correctly', async ({ page }) => {
        // Test code
    });

    test('formats numeric axis correctly', async ({ page }) => {
        // Test code
    });
});
```

### Use Deterministic Data

Avoid `Math.random()` or time-dependent data in tests. Use fixed datasets for reproducible results:

```typescript
// Good - deterministic
const chart = await createChart(page, {
    series: [{ data: [1, 2, 3, 4, 5] }]
});

// Bad - non-deterministic
const chart = await createChart(page, {
    series: [{ data: Array.from({ length: 5 }, () => Math.random() * 100) }]
});
```

### Wait for Async Operations

When testing features that involve async operations (data loading, animations), use explicit waits:

```typescript
// Wait for a condition
await page.waitForFunction(() => {
    const chart = window.Highcharts?.charts[0];
    return chart?.series[0]?.data.length > 0;
});

// Or use expect.poll for assertions that may take time
await expect.poll(async () => {
    return await chart.evaluate(c => c.series[0].data.length);
}).toBeGreaterThan(0);
```

### Write Focused Assertions

Test one thing per assertion for clearer failure messages:

```typescript
// Good - clear what failed
const title = await chart.evaluate(c => c.title.textStr);
expect(title).toBe('My Chart');

const seriesCount = await chart.evaluate(c => c.series.length);
expect(seriesCount).toBe(2);

// Less clear - combines multiple checks
const result = await chart.evaluate(c => ({
    title: c.title.textStr,
    seriesCount: c.series.length
}));
expect(result).toEqual({ title: 'My Chart', seriesCount: 2 });
```

If you need to group related assertions, use `test.step` for better reporting:

```typescript
test('chart configuration', async ({ page }) => {
    const chart = await createChart(page, { /* options */ });

    await test.step('verify title', async () => {
        const title = await chart.evaluate(c => c.title.textStr);
        expect(title).toBe('My Chart');
    });

    await test.step('verify series', async () => {
        const seriesCount = await chart.evaluate(c => c.series.length);
        expect(seriesCount).toBe(2);

        const firstSeriesType = await chart.evaluate(c => c.series[0].type);
        expect(firstSeriesType).toBe('line');
    });
});
```

## Route Rewrites

Tests run offline by default using route rewrites. The test fixture intercepts network requests and serves local files instead, enabling:

- **Offline testing**: No network dependency for faster, more reliable tests
- **Local code testing**: Tests run against your local build in `code/`
- **Consistent data**: Sample data is served from `samples/data/`

### How It Works

When a test requests `https://code.highcharts.com/highcharts.src.js`, the fixture intercepts it and serves `code/highcharts.src.js` from your local repository instead.

### Default Rewrites

The following URL patterns are automatically rewritten:

| Pattern | Local Path | Description |
|---------|------------|-------------|
| `**/code.highcharts.com/**` | `code/` | Highcharts library files |
| `**/code.highcharts.com/connectors/morningstar/**` | `node_modules/@highcharts/connectors-morningstar/` | Morningstar connector |
| `**/**/mapdata/**` | `node_modules/@highcharts/map-collection/` | Map data files |
| `**/{samples/data}/**` | `samples/data/` | Sample data files |
| `https://demo-live-data.highcharts.com/**` | `samples/data/` | Demo live data |
| `https://code.jquery.com/qunit/**` | `tests/qunit/vendor/` | QUnit assets |
| `https://fonts.googleapis.com/**` | Empty stylesheet | Google Fonts |
| `**/font-awesome/**` | Empty stylesheet | Font Awesome |
| `**/grid-lite.js`, `**/grid-pro.js` | `code/grid/` | Grid modules |
| `**/grid-lite.css`, `**/grid-pro.css` | `css/grid/` | Grid styles |
| `**/{samples/graphics}/**` | `samples/graphics/` | Sample graphics |
| `**/testimage.png` | `test/testimage.png` | Test image |
| `**/shim.html` | Empty HTML page | Shim page |
| JSON sources from `samples/data/json-sources/index.json` | Various | External API mocks |

### Adding New Rewrites

To add a new rewrite, edit `fixtures.ts` and add a route to the `routes` array in `setupRoutes()`:

```typescript
// In fixtures.ts, inside setupRoutes()
const routes: RouteType[] = [
    // ... existing routes ...
    {
        pattern: '**/my-custom-api.com/**',
        handler: async (route) => {
            const url = route.request().url();
            const localPath = 'samples/data/my-local-data.json';

            try {
                const body = await readFile(join(__dirname, '..', localPath));

                test.info().annotations.push({
                    type: 'redirect',
                    description: `${url} --> ${localPath}`
                });

                await route.fulfill({
                    status: 200,
                    body,
                    contentType: 'application/json'
                });
            } catch {
                await route.abort();
                throw new Error(`Missing local file for ${localPath}`);
            }
        }
    }
];
```

Route handlers receive a `Route` object and should either:
- Call `route.fulfill()` with the response
- Call `route.abort()` to block the request

Always add an annotation to track rewrites in test reports:

```typescript
test.info().annotations.push({
    type: 'redirect',
    description: `${url} --> ${localPath}`
});
```

### Mocking Routes in a Single Test

To mock a route for a specific test without modifying `fixtures.ts`, use Playwright's `page.route()` directly:

```typescript
import { test, expect, createChart } from '~/fixtures.ts';

test('chart with mocked API data', async ({ page }) => {
    // Mock the API endpoint for this test only
    await page.route('**/api.example.com/data.csv', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'text/csv',
            body: 'x,y\n1,10\n2,20\n3,15'
        });
    });

    const chart = await createChart(page, {
        data: {
            csvURL: 'https://api.example.com/data.csv'
        },
        series: [{ type: 'line' }]
    });

    const pointCount = await chart.evaluate(c => c.series[0].data.length);
    expect(pointCount).toBe(3);
});
```

To share a mock across multiple tests, use `test.beforeEach()` in a `describe` block:

```typescript
import { test, expect, createChart } from '~/fixtures.ts';

test.describe('charts with mocked API', () => {
    test.beforeEach(async ({ page }) => {
        await page.route('**/api.example.com/data', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([{ x: 1, y: 10 }])
            });
        });
    });

    test('first test', async ({ page }) => {
        // Mock is active here
    });

    test('second test', async ({ page }) => {
        // Mock is active here too
    });
});
```

## Path Aliases

The test suite uses TypeScript path aliases for cleaner imports. These are configured in `tsconfig.json`:

| Alias | Maps To | Example |
|-------|---------|---------|
| `~/` | `tests/` (this folder) | `import { test } from '~/fixtures.ts'` |
| `~code/` | `code/` (build output) | `import type Highcharts from '~code/esm/highcharts.src'` |
| `~ts/` | `ts/` (source files) | `import type Grid from '~ts/Grid/Core/Grid'` |

### Usage Examples

```typescript
// Import from test utilities
import { test, expect, createChart } from '~/fixtures.ts';
import { captureError } from '~/qunit/utils/error-capture.ts';

// Import types from built code
import type Highcharts from '~code/esm/highcharts.src';

// Import types from source
import type Grid from '~ts/Grid/Core/Grid';
```

### Benefits

- **Cleaner imports**: No more `../../` chains
- **Refactoring-friendly**: Moving files doesn't break imports
- **Explicit paths**: Clear where imports come from

## Debugging

### Check console output

Add `--reporter=list` for detailed console output:

```sh
npx playwright test --reporter=list
```

For visual runs, keep the configured reporter list. A command-line
`--reporter` value replaces that list and can remove the visual reporter that
validates complete results and writes `test/visual-test-complete`.

### QUnit browser logs

When QUnit tests fail, browser logs are written to per-worker files:

```text
tests/qunit/console-worker-*.log
```

At the end of a run with failures, a note with this path is printed in the console.

### Debug interactively

```sh
# Run with debugger
npx playwright test --debug

# Run specific test with debugger
npx playwright test tests/highcharts/chart/my-test.spec.ts --debug
```

### View trace for failed tests

```sh
# Default config uses retries=0, so traces are not created automatically.
# To capture traces, rerun with retries enabled (non-QUnit projects):
npx playwright test --project=highcharts --retries=1

# Then open a generated trace file from test-results/
npx playwright show-trace test-results/<test-folder>/trace.zip
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NO_REWRITES` | Skip route rewrites, test against live CDN |
| `QUNIT_TEST_PATH` | Glob-enabled QUnit test path (e.g., `unit-tests/rangeselector/*`) |
| `QUNIT_VERBOSE` | Show detailed output for passing QUnit tests |
| `VISUAL_TEST_PATH` | Filter visual tests by one or more path substrings |
| `VISUAL_TEST_MANIFEST` | Select the exact visual sample IDs listed in a JSON manifest; mutually exclusive with `VISUAL_TEST_PATH` |
| `VISUAL_TEST_REFERENCE` | Set to `1` to write reference SVGs instead of comparing |

Examples:

```sh
# Run single QUnit test
QUNIT_TEST_PATH=unit-tests/rangeselector/update npx playwright test --project=qunit

# Run single visual test
VISUAL_TEST_PATH=samples/highcharts/demo/line-basic npx playwright test --project=visual

# Run the full visual manifest
VISUAL_TEST_MANIFEST=tests/visual/samples.json npx playwright test --project=visual

# Test against live CDN
NO_REWRITES=1 npx playwright test
```

## Playwright Visual Comparisons

> **Note:** Playwright and Karma run the same eligible sample set in different
> browsers. Successful Playwright runs for same-repository
> PRs publish to production Visual Review and can replace the current Karma
> review for that PR with results for the selected manifest only.

The `visual` Playwright project (`tests/visual/visual.spec.ts`) renders samples to
SVG, compares them against references, and records a pixel-difference count. It
runs on Chromium only. Sample discovery uses the shared Karma visual exclusions.
The CI workflow starts with the IDs in `tests/visual/samples.json`. A selection
test checks that this manifest contains every eligible candidate sample. CI
compares the subset present and eligible on both revisions, matching Karma's
handling of samples without master references. The selected IDs are saved in
the workflow artifacts as `visual-samples.json`. An entry excluded
by Karma is rejected; it cannot be used to run an ignored sample. `VISUAL_TEST_PATH` remains
a substring filter for focused local runs and cannot be combined with a
manifest.

The manifest currently covers 2,034 samples across Highcharts, Stock, Maps, and
Gantt, including both demos and focused API-option samples. It includes
multi-chart rendering, polar and range series, network diagrams, stock
navigation and indicators, map projections and color axes, and Gantt progress,
hierarchy, and grid columns. New entries must pass reference
generation and comparison with the existing offline routes and Karma exclusions.
Discovery includes `demo.js` and TypeScript sources compiled by Karma's `--ts`
mode. Module-only `demo.mjs` samples are not loaded by Karma and are excluded.
The visual runner preloads the Morningstar connector, as Karma does. Its five
API-backed samples use recorded responses in `tests/visual/data`; these routes
are limited to the visual project and retain offline execution. See the
[fixture provenance](visual/data/README.md) before refreshing those responses.

SVG capture waits for the sample's initial XHR data requests to finish. Charts
can emit their load event before CSV data arrives, so chart existence or
`hasLoaded` alone is insufficient. Pending requests share the chart's 10-second
readiness timeout and are aborted during sample cleanup. No fixed settling delay
is added to samples without requests, and empty datasets remain valid.

### Workflow

Run the two commands in order for the same manifest or sample:

**1. Generate the references** (write once, or to refresh):

```sh
VISUAL_TEST_MANIFEST=tests/visual/samples.json \
VISUAL_TEST_REFERENCE=1 \
npx playwright test tests/visual/visual.spec.ts --project=visual
```

This writes `samples/<path>/reference.svg` files and exits. References are
generated locally and are ignored by Git. Reference mode does not produce
candidate output, results JSON, or a completion marker. Re-running it overwrites
the existing files, so only run this intentionally.

**2. Run the candidate comparison**:

```sh
VISUAL_TEST_MANIFEST=tests/visual/samples.json \
npx playwright test tests/visual/visual.spec.ts --project=visual
```

For a focused local run, generate and compare one sample with
`VISUAL_TEST_PATH=samples/highcharts/demo/area-missing`. The path value is matched
as a substring, while manifest entries are exact sample IDs.

### Outputs

| File | Written when |
|------|-------------|
| `samples/<path>/reference.svg` | Reference mode only |
| `samples/<path>/candidate.svg` | Candidate mode, numeric difference > 0 |
| `samples/<path>/diff.gif` | Candidate mode, numeric difference > 0 |
| `test/visual-test-results.json` | Candidate mode, always (pixel count per sample) |
| `test/visual-test-errors.log` | Any sample or terminal error during the run |
| `test/visual-test-complete` | Candidate mode, after every selected sample finishes, including completed sample errors |

### Failure semantics

A **numeric pixel difference** recorded in `test/visual-test-results.json` is
diagnostic and does not itself fail the Playwright run. The following conditions
are failures:

- The sample script throws or the chart does not load within the timeout
- The browser context or Playwright process terminates unexpectedly
- `reference.svg` is absent when candidate mode is run
- `test/visual-test-errors.log` is non-empty after the run
- expected results are missing, the selected sample set is invalid, or an
  explicitly requested manifest ID is excluded by Karma
- `test/visual-test-complete` is absent after the run (indicates the full
  candidate run did not finish normally)

A completed sample execution error fails CI and remains in the error log, but
does not prevent the completion signal when all selected samples finish.
Interrupted runs, unexecuted samples, and fixture or browser failures omit the
signal. Completion alone is not permission to publish: the workflow also
requires successful reference and candidate outcomes and an empty error log.

The CI workflow uploads diagnostics from both revisions and gates the result on
the reference and candidate outcomes plus the candidate completion marker.
Locally these markers are informational.

### Production publishing

After validation, same-repository PR runs use `gulp update-pr-testresults` to
publish the complete result JSON and SVG/GIF artifacts for differing samples to
`https://vrevs.highsoft.com`. Both runners use the existing PR review identity;
the latest published run is current, and reviews are not combined. The Playwright
PR comment identifies the number of selected samples. Manual workflow runs and
fork PRs only upload GitHub Actions diagnostics.

Publishing uses `VISUAL_REVIEW_INGESTION_API_KEY` and the PR head SHA, with
`GITHUB_RUN_ID` supplying both the submission ID and its globally unique run
number. Upload failures fail CI, and GitHub artifacts remain available even if
publishing fails. A numeric visual difference is still a valid completed run and
is published for review.

## FAQ

### How do I stop tests after the first failure?

Use the `-x` flag to stop immediately after the first test failure:

```sh
npx playwright test -x
```

For more control, use `--max-failures` to stop after N failures:

```sh
# Stop after 3 failures
npx playwright test --max-failures=3
```

### What reporters are available?

Playwright supports multiple reporters. Use `--reporter` to specify one or more (comma-separated):

```sh
# List reporter - shows each test on its own line
npx playwright test --reporter=list

# Dot reporter - minimal output, one dot per test
npx playwright test --reporter=dot

# Line reporter - shows currently running test
npx playwright test --reporter=line

# HTML reporter - generates an interactive HTML report
npx playwright test --reporter=html

# JSON reporter - outputs results as JSON
npx playwright test --reporter=json

# JUnit reporter - outputs JUnit XML format
npx playwright test --reporter=junit
```

You can combine reporters:

```sh
# Show list output and generate HTML report
npx playwright test --reporter=list,html
```

The default configuration uses multiple reporters:

- Line reporter locally (`line`) or dot reporter in CI (`dot`)
- HTML reporter (`playwright-report/`)
- Custom QUnit browser-log note reporter
- Custom visual completion reporter (`tests/visual/visual-reporter.ts`)

For visual runs, retain all configured reporters. Passing `--reporter` replaces
the configuration, so omitting the visual reporter prevents completion
validation.

View the HTML report with:

```sh
npx playwright show-report
```

### How do I get verbose output for QUnit tests?

By default, QUnit tests only output details for failing tests. To see output for each passing test, set the `QUNIT_VERBOSE` environment variable:

```sh
QUNIT_VERBOSE=true npx playwright test --project=qunit
```

This shows timing information and test counts for each passing test file.

## Common Issues

### "Browser not installed"

```sh
npx playwright install
```

### Flaky tests

Tests run offline by default. If you see flaky behavior, check:

- Animations are disabled (automatic with `createChart`)
- Data is deterministic (avoid `Math.random()`)
- Timing-sensitive operations use `waitForFunction` or `expect.poll`

### Missing local files

If you see errors about missing local files, ensure you have built the project:

```sh
npx gulp
```

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Test API](https://playwright.dev/docs/api/class-test)
- [Playwright Assertions](https://playwright.dev/docs/api/class-genericassertions)
- [Playwright Locators](https://playwright.dev/docs/locators)
- [Highcharts API Reference](https://api.highcharts.com)
