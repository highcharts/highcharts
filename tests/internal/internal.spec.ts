import { test, expect, createChart } from '../fixtures.ts';

test('Chart creation', async ({ page }) => {
    await page.setContent('<div id="container"></container>');
    await page.addScriptTag({ path: './code/highcharts.src.js' });

    await page.evaluate(() => {
        window.Highcharts.chart('container', {});
    });

    await expect(page.locator('#container'))
        .toHaveAttribute('data-highcharts-chart', '0');
});

test('Redirects are applied for code', async ({ page }) => {
    const template = `<html>
    <head>
        <script src="https://code.highcharts.com/highcharts.src.js"></script>
        <script src="https://code.highcharts.com/maps/highmaps.js"></script>

        <script src="https://code.highcharts.com/esm/highcharts-gantt.js"></script>

        <script src="https://code.highcharts.com/dashboards/datagrid.src.js"></script>
        <script src="https://code.highcharts.com/dashboards/css/datagrid.css"></script>
    </head>
    <body>
        <div id="container"></container>
    </body>
    </html>`;

    await page.setContent(template);

    await page.evaluate(() => {
        window.Highcharts.chart('container', {});
    });

    await expect(page.locator('#container'))
        .toHaveAttribute('data-highcharts-chart', '0');

    const { annotations } = test.info();

    expect(annotations).toContainEqual({
        type: 'redirect',
        description: 'https://code.highcharts.com/highcharts.src.js --> code/highcharts.src.js'
    });

    expect(annotations).toContainEqual({
        type: 'redirect',
        description: 'https://code.highcharts.com/maps/highmaps.js --> code/highmaps.src.js'
    });

    expect(annotations).toContainEqual({
        type: 'redirect',
        description: 'https://code.highcharts.com/esm/highcharts-gantt.js --> code/esm/highcharts-gantt.src.js'
    });

    expect(annotations).toContainEqual({
        type: 'redirect',
        description: 'https://code.highcharts.com/dashboards/datagrid.src.js --> code/dashboards/datagrid.src.js'
    });

    expect(annotations).toContainEqual({
        type: 'redirect',
        description: 'https://code.highcharts.com/dashboards/css/datagrid.css --> code/dashboards/css/datagrid.css'
    });
});

test.describe('Redirects for data', () => {
    test('jsonSources', async ({ page }) => {
        const template = `<html>
    <head>
    </head>
    <body>
        <script type="module">
            await fetch('https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=64.128288&lon=-21.827774')
        </script>
    </body>
    </html>`;

        await page.setContent(template, { waitUntil: 'networkidle' });

        const { annotations } = test.info();

        expect(annotations).toContainEqual({
            type: 'redirect',
            description: 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=64.128288&lon=-21.827774 --> samples/data/json-sources/weather-forecast.json'
        });

    });

    test('jsDelivr', async ({ page }) => {
        const template = `<html>
    <head>
    </head>
    <body>
        <script type="module">
            await fetch('https://cdn.jsdelivr.net/gh/highcharts/highcharts@f0e61a1/samples/data/aapl-c.json')
        </script>
    </body>
    </html>`;

        await page.setContent(template, { waitUntil: 'networkidle' });

        const { annotations } = test.info();

        expect(annotations).toContainEqual({
            type: 'redirect',
            description: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@f0e61a1/samples/data/aapl-c.json --> samples/data/aapl-c.json'
        });
    });

    test('highcharts.com sample data', async ({ page }) => {
        const template = `<html>
    <head>
    </head>
    <body>
        <script type="module">
            await fetch('https://www.highcharts.com/samples/data/aapl-c.json')
        </script>
    </body>
    </html>`;

        await page.setContent(template, { waitUntil: 'networkidle' });

        const { annotations } = test.info();

        expect(annotations).toContainEqual({
            type: 'redirect',
            description: 'https://www.highcharts.com/samples/data/aapl-c.json --> samples/data/aapl-c.json'
        });
    });

    test('demo-live-data sample data', async ({ page }) => {
        const template = `<html>
    <head>
    </head>
    <body>
        <script type="module">
            await fetch('https://demo-live-data.highcharts.com/aapl-c.json')
        </script>
    </body>
    </html>`;

        await page.setContent(template, { waitUntil: 'networkidle' });

        const { annotations } = test.info();

        expect(annotations).toContainEqual({
            type: 'redirect',
            description: 'https://demo-live-data.highcharts.com/aapl-c.json --> samples/data/aapl-c.json'
        });
    });


    // 'https://code.highcharts.com/mapdata/custom/asia.topo.json'
    test('highcharts.com mapdata', async ({ page }) => {
        const template = `<html>
    <head>
    </head>
    <body>
        <script type="module">
            await fetch('https://code.highcharts.com/mapdata/custom/asia.topo.json')
        </script>
    </body>
    </html>`;

        await page.setContent(template, { waitUntil: 'networkidle' });

        const { annotations } = test.info();

        expect(annotations).toContainEqual({
            type: 'redirect',
            description: 'https://code.highcharts.com/mapdata/custom/asia.topo.json --> node_modules/@highcharts/map-collection/custom/asia.topo.json'
        });
    });
});

test.describe.fixme('createChart', () => {
    test('can create a chart', async ({ page }) => {
        const chart = await createChart(
            page,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            {
                title: {
                    text: 'CUSTOM CHART'
                }
            // ...more chart options
            } as any,
            {
                container: 'test', // default: "container"? Or uuid? If a HTMLElement, only passes it
                // chartConstructor: 'stockChart', // Default: chart
                modules: [] // default: should load main module of chartconstructor?
            }
        );

        expect(await chart.evaluate(c => c.options.title)).toHaveProperty('text', 'CUSTOM CHART');
        await expect(page.locator('#test')).toBeVisible();
    });


});
