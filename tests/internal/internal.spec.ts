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

    await expect.poll(()=> test.info().annotations).toContainEqual({
        type: 'redirect',
        description: 'https://code.highcharts.com/highcharts.src.js --> code/highcharts.src.js'
    });

    await expect.poll(()=> test.info().annotations).toContainEqual({
        type: 'redirect',
        description: 'https://code.highcharts.com/maps/highmaps.js --> code/highmaps.src.js'
    });

    await expect.poll(()=> test.info().annotations).toContainEqual({
        type: 'redirect',
        description: 'https://code.highcharts.com/esm/highcharts-gantt.js --> code/esm/highcharts-gantt.src.js'
    });

    await expect.poll(()=> test.info().annotations).toContainEqual({
        type: 'redirect',
        description: 'https://code.highcharts.com/dashboards/datagrid.src.js --> code/dashboards/datagrid.src.js'
    });

    await expect.poll(()=> test.info().annotations).toContainEqual({
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

        await page.setContent(template);

        await expect.poll(()=> test.info().annotations).toContainEqual({
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

        await page.setContent(template);

        await expect.poll(()=> test.info().annotations).toContainEqual({
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
        await page.setContent(template);

        await expect.poll(()=> test.info().annotations).toContainEqual({
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

        await page.setContent(template);

        await expect.poll(() => test.info().annotations).toContainEqual({
            type: 'redirect',
            description: 'https://demo-live-data.highcharts.com/aapl-c.json --> samples/data/aapl-c.json'
        });
    });

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

        await page.setContent(template);

        await expect.poll(() => test.info().annotations).toContainEqual({
            type: 'redirect',
            description: 'https://code.highcharts.com/mapdata/custom/asia.topo.json --> node_modules/@highcharts/map-collection/custom/asia.topo.json'
        });
    });
});

test.describe('createChart', () => {
    test('can create a chart', async ({ page }) => {
        const chart = await createChart(
            page,
            {
                title: {
                    text: 'CUSTOM CHART'
                }
            } as any,
            {
                container: 'test',
            }
        );

        expect(
            await chart.evaluate(c => c.options.title)
        ).toHaveProperty('text', 'CUSTOM CHART');
        await expect(page.locator('#test')).toBeVisible();
    });

    test('can create a stock chart', async ({ page }) => {
        const chart = await createChart(
            page, {}, { chartConstructor: 'stockChart' }
        );
        expect(
            await chart.evaluate(c => c.options)

        ).toHaveProperty('isStock', true);
    });

    test('can create a gantt chart', async ({ page }) => {
        const chart = await createChart(
            page, {}, { chartConstructor: 'ganttChart' }
        );
        expect(
            await chart.evaluate(c => c.options)
        ).toHaveProperty('isGantt', true);
    });

    test('can create a map chart', async ({ page }) => {
        const chart = await createChart(
            page, {}, { chartConstructor: 'mapChart' }
        );
        expect(await chart.evaluate(c => c.options)).toHaveProperty('mapView');
    });


    test('elementHandle container from locator', async ({ page }) => {
        await page.setContent('<div class="test">Test</div>');

        const chart = await createChart(
            page,
            {
                title: {
                    text: 'LOCATOR CHART'
                }
            },
            {
                container: await page.locator('.test').elementHandle()
            }
        );

        expect(
            await chart.evaluate(c => c.options.title)
        ).toHaveProperty('text', 'LOCATOR CHART');
    });

    test('elementHandle container from evaluate', async ({ page }) => {
        const container = await page.evaluateHandle(() =>
            document.body.appendChild(document.createElement('div'))
        );

        const chart = await createChart(
            page,
            {
                title: {
                    text: 'LOCATOR CHART'
                }
            } as any,
            { container }
        );

        expect(
            await chart.evaluate(c => c.options.title)
        ).toHaveProperty('text', 'LOCATOR CHART');
        expect(
            await container.evaluate(c => c.dataset)
        ).toHaveProperty('highchartsChart', '0');
    });

    test('modules are loaded', async ({ page }) => {
        await createChart(
            page,
            {},
            {
                modules: [
                    'modules/venn.src.js',
                    'modules/histogram-bellcurve.src.js',
                ]
            }
        );

        const seriesTypes = await page.evaluate(
            () => Object.keys((Highcharts as any).SeriesRegistry.seriesTypes));

        ['venn', 'histogram', 'bellcurve'].forEach(seriesType => {
            expect(seriesTypes).toContain(seriesType);
        });
    });

    test('Custom Highcharts instance', async ({ page }) => {
        const HC = await page.evaluateHandle<typeof Highcharts>(async () => {
            // @ts-expect-error cannot find import
            const esmHC = (await import('https://code.highcharts.com/esm/highcharts.js')).default;

            esmHC.setOptions({
                title: {
                    text: 'CUSTOM DEFAULT TEXT'
                }
            });

            return esmHC;
        });

        const chart = await createChart(page, {}, { HC });

        expect(
            await chart.evaluate(c => c.options.title)
        ).toHaveProperty('text', 'CUSTOM DEFAULT TEXT');
    });

    test('css property', async ({ page }) => {
        await createChart(page, {}, { css: 'body { background-color: orange; }' });

        const bgColor = await page.locator('body')
            .evaluate(el => window.getComputedStyle(el).backgroundColor);

        expect(bgColor).toBe('rgb(255, 165, 0)');
    });


    test('most options combined', async ({ page }) => {
        const HC = await page.evaluateHandle<typeof Highcharts>(async () => {
            // @ts-expect-error cannot find import
            await import('https://code.highcharts.com/esm/modules/stock-tools.src.js');
            // @ts-expect-error cannot find import
            await import('https://code.highcharts.com/esm/modules/annotations-advanced.src.js');
            // @ts-expect-error cannot find import
            return (await import('https://code.highcharts.com/esm/indicators/indicators-all.src.js')).default;
        });

        const chart = await createChart(
            page,
            {
                chart: {
                    styledMode: true
                },
                series: [
                    {
                        type: 'line',
                        data: [1, 2, 3, 4],
                        animation: false
                    }
                ]
            },
            {
                HC,
                modules: [], // cannot be combined with HC
                css: `@import url("https://code.highcharts.com/css/highcharts.css");
                    @import url("https://code.highcharts.com/css/stocktools/gui.css");
                    @import url("https://code.highcharts.com/css/annotations/popup.css");

                    #stock-container {
                    height: 500px;
                }`,
                chartConstructor: 'stockChart',
                container: 'stock-container',
                applyTestOptions: false
            }
        );


        await expect.poll(()=> test.info().annotations).toContainEqual({
            type: 'redirect',
            description: 'https://code.highcharts.com/css/highcharts.css --> code/css/highcharts.css'
        });

        expect(
            await chart.evaluate(c => c.options)
        ).toHaveProperty('stockTools');

        // Example of waiting for series animations
        await page.waitForFunction(
            ({ chart }) =>
                chart.series.every(
                    (s: any) => s.finishedAnimating
                ),
            { chart }
        );

        await page.locator('.highcharts-submenu-item-arrow').first()
            .click();
        await page.getByTitle('Label', { exact: true }).locator('button')
            .click();
        await page.getByRole('listitem', { name: 'Simple shapes' }).getByRole('button').first().click();


        const [width, height] = await chart.evaluate(c => [
            c.plotWidth,
            c.plotHeight
        ]);

        await page.mouse.click(width / 2, height / 2);
        await expect(page.locator('.highcharts-annotation')).toBeVisible();
    });
});
