# Playwright Testing Quick Start

## Installation

Check out the `tools/playwright` branch

```sh
npm i
```

```sh
# Install Playwright browsers (first time only)
npx playwright install
```

## Running Tests

```sh
# Run specific project
npx playwright test --project=highcharts
npx playwright test --project=dashboards
npx playwright test --project=qunit
npx playwright test --project=internal
npx playwright test --project=visual [--update-snapshots]

# Run a specific test file
npx playwright test tests/highcharts/themes.spec.ts

# Run tests in UI mode (interactive)
npx playwright test --ui

# Run tests in headed or debug mode (see browser)
npx playwright test --project=highcharts --headed
npx playwright test --project=highcharts --debug
```

## Viewing Results

```sh
# Open HTML report after test run
npx playwright show-report
```

## Writing Your First Test

Create a new file `tests/highcharts/my-test.spec.ts`:

```typescript
import { test, expect, createChart } from '../fixtures.ts';

test('my first chart test', async ({ page }) => {
    // Create a chart
    const chart = await createChart(
        page,
        {
            title: { text: 'My Test Chart' },
            series: [{
                type: 'line',
                data: [1, 3, 2, 4, 5]
            }]
        }
    );

    // Test chart properties
    const title = await chart.evaluate(c => c.title.textStr);
    expect(title).toBe('My Test Chart');

    const seriesLength = await chart.evaluate(c => c.series.length);
    expect(seriesLength).toBe(1);

    const dataLength = await chart.evaluate(c => c.series[0].data.length);
    expect(dataLength).toBe(5);
});
```

Run your test:

```sh
npx playwright test tests/highcharts/my-test.spec.ts
```

## Common Test Patterns

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

## Debugging Failed Tests

### View trace for failed tests

```sh
# Traces are automatically captured on first retry
npx playwright show-trace playwright-report/data/<trace-id>.zip
```

### Debug interactively

```sh
# Run with debugger
npx playwright test --debug

# Run specific test with debugger
npx playwright test tests/highcharts/my-test.spec.ts --debug
```

### Check console output

Add `--reporter=list` for detailed console output:

```sh
npx playwright test --reporter=list
```

## Environment Variables

```sh
# Run single test path (for visual tests)
VISUAL_TEST_PATH=samples/highcharts/demo/line-basic npx playwright test --project=visual

# Skip route rewrites (test against live CDN)
NO_REWRITES=1 npx playwright test
```

## Next Steps

Once you're comfortable with the basics, explore:

- **Code examples**: `docs/playwright-setup-summary.md` - Detailed examples of utilities and advanced patterns
- **Example tests**: `tests/highcharts/themes.spec.ts` - Real-world test implementations
- **Fixture source**: `tests/fixtures.ts` - Understanding `createChart` and route handling
- **Utils source**: `tests/utils.ts` - Karma emulation and sample loading

## Getting Help

- Playwright documentation: https://playwright.dev
- Project setup details: `docs/playwright-setup-summary.md`

## Setting Up a Page from Scratch

When you need full control over the page setup (custom HTML, ESM modules, or manual Highcharts loading), you can set up a page manually instead of using `createChart`.

### Basic Manual Setup

```typescript
import { test, expect } from '../fixtures.ts';
import { setupRoutes } from '../fixtures.ts';

test('manual page setup', async ({ page }) => {
    // Routes are already set up via the fixture, but you can also call setupRoutes manually
    // if using base test: await setupRoutes(page);

    // Set custom HTML content
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

### Using ESM Modules

```typescript
import { test, expect } from '../fixtures.ts';

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

### Using ESM with createChart

You can also pass a pre-loaded Highcharts instance to `createChart`:

```typescript
import { test, expect, createChart } from '../fixtures.ts';

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
import { test, expect, createChart } from '../fixtures.ts';

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
import { test, expect, createChart } from '../fixtures.ts';

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

## Common Issues

### "Browser not installed"

```sh
npx playwright install
```

### "Local file missing" errors

Make sure you've built the project first:

```sh
npm run gulp
```


### Flaky tests

Tests run offline by default. If you see flaky behavior, check:
- Animations are disabled (automatic with `createChart`)
- Data is deterministic (avoid `Math.random()`)
- Timing-sensitive operations use `waitForFunction` or `expect.poll`
