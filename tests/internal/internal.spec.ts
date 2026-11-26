import type {} from 'qunit';
import { rm } from 'node:fs/promises';
import { relative, sep } from 'node:path';
import { test as base, expect, createChart } from '~/fixtures.ts';
import { getSample } from '~/utils.ts';
import {
    qunitAssetUrl,
    qunitScript,
    qunitStyles,
    qunitVersion
} from '~/qunit/assets.ts';
import {
    initializeFreshPage,
    initializeWarmPage,
    installWarmSampleHooks,
    prepareWarmSample,
    writeQUnitSetupFile
} from '~/qunit/page.ts';
import { captureQUnitErrorDetails } from '~/qunit/utils/error-capture.ts';
import { formatQUnitErrorDetails } from '~/qunit/utils/error-formatter.ts';
import { waitForQUnitWithTimeout } from '~/qunit/utils/timeout-handler.ts';

const test = base.extend<{ qunitSetupFile: string }>({
    qunitSetupFile: async ({}, use, testInfo) => {
        const path = testInfo.outputPath('setup.json');
        try {
            await use(path);
        } finally {
            await rm(path, { force: true });
        }
    }
});

test.describe('getSample', () => {
    test('should get sample with Windows-style path', () => {
        const sample = getSample('samples\\unit-tests\\chart\\alignthresholds');
        expect(sample.script).toContain('QUnit.test(\'alignThresholds');
    });
});

test('QUnit fails the sample when asynchronous setup throws or rejects', async ({
    qunitSetupFile,
    page
}) => {
    await writeQUnitSetupFile(qunitSetupFile, [
        `
            setTimeout(() => { throw new Error('setup timer threw'); }, 0);
            Promise.reject(new Error('setup promise rejected'));
            //# sourceURL=async-qunit-setup.js
        `
    ]);
    await initializeFreshPage(page, qunitSetupFile);
    await page.waitForFunction(() =>
        window.__qunitFailedAssertions__?.length === 2
    );

    await page.addScriptTag({
        content: 'QUnit.test(\'passing case\', assert => assert.ok(true));'
    });
    await page.evaluate(() => window.QUnit.start());

    const results = await waitForQUnitWithTimeout(page, 'async setup', 5000);
    expect(results).toMatchObject({ status: 'failed', passed: 1, failed: 2 });

    const details = await captureQUnitErrorDetails(page, 'async setup');
    expect(details.failedAssertions.map(({ message }) => message).sort())
        .toEqual(['setup promise rejected', 'setup timer threw']);
});

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
        description: 'https://code.highcharts.com/dashboards/datagrid.src.js --> code/grid/grid-pro.src.js'
    });

    await expect.poll(()=> test.info().annotations).toContainEqual({
        type: 'redirect',
        description: 'https://code.highcharts.com/dashboards/css/datagrid.css --> code/grid/css/grid-pro.css'
    });
});

test('QUnit sample assets are served locally', async ({ page }) => {
    const sample = getSample('samples/unit-tests/chart/alignthresholds');
    const resources = sample.details?.resources?.filter(url =>
        url.includes('code.jquery.com/qunit/')
    ) ?? [];
    expect(resources).toEqual([
        `${qunitAssetUrl}.js`,
        `${qunitAssetUrl}.css`
    ]);

    const [script, stylesUrl] = resources;
    const scriptUrl = `${script}?cache=1`;
    const template = `<html>
    <head>
        <script src="${scriptUrl}"></script>
        <link rel="stylesheet" href="${stylesUrl}">
    </head>
    <body></body>
    </html>`;

    await page.setContent(template);

    const localScript = relative(process.cwd(), qunitScript)
        .split(sep).join('/');
    const localStyles = relative(process.cwd(), qunitStyles)
        .split(sep).join('/');
    await expect.poll(() => test.info().annotations).toContainEqual({
        type: 'redirect',
        description: `${scriptUrl} --> ${localScript}`
    });

    await expect.poll(() => test.info().annotations).toContainEqual({
        type: 'redirect',
        description: `${stylesUrl} --> ${localStyles}`
    });

    await expect.poll(() => page.evaluate(() => window.QUnit?.version))
        .toBe(qunitVersion);
});

test('QUnit safely parses query parameter names', async ({ page }) => {
    await page.route('**/qunit-parser?*', route => route.fulfill({
        contentType: 'text/html',
        body: `<html><head>
            <script>window.QUnit = { config: { autostart: false } };</script>
            <script src="${qunitAssetUrl}.js"></script>
            </head><body></body></html>`
    }));
    await page.goto('/qunit-parser?' +
        '%5F%5Fproto%5F%5F=first&__proto__=second&constructor=literal&' +
        'toString=text&empty=&empty=second&repeat=one&repeat=two&' +
        'flag&greeting=hello+world%21');

    const result = await page.evaluate(() => ({
        version: QUnit.version,
        nullPrototype: Object.getPrototypeOf(QUnit.urlParams) === null,
        entries: Object.entries(QUnit.urlParams),
        objectPrototypeKeys: Object.keys(Object.prototype)
    }));
    expect(result).toEqual({
        version: qunitVersion,
        nullPrototype: true,
        entries: [
            ['__proto__', ['first', 'second']],
            ['constructor', 'literal'],
            ['toString', 'text'],
            ['empty', ['', 'second']],
            ['repeat', ['one', 'two']],
            ['flag', true],
            ['greeting', 'hello world!']
        ],
        objectPrototypeKeys: []
    });
    const counts = await page.evaluate(() => new Promise(resolve => {
        window.QUnit.on('runEnd', ({ testCounts }) => resolve(testCounts));
        QUnit.test('ordinary assertions still run', assert => assert.ok(true));
        QUnit.start();
    }));
    expect(counts).toEqual({
        failed: 0, passed: 1, skipped: 0, todo: 0, total: 1
    });
});

test('QUnit samples run as independent classic scripts', async ({
    qunitSetupFile,
    context
}) => {
    await writeQUnitSetupFile(qunitSetupFile);
    async function runSample(name: string, source: string) {
        const page = await context.newPage();
        try {
            await initializeFreshPage(page, qunitSetupFile);
            await page.addScriptTag({ content: source });
            await page.evaluate(() => window.QUnit.start());
            await waitForQUnitWithTimeout(page, name, 5000);
            await page.evaluate(() => window.getFinalQUnitResults());
            return await captureQUnitErrorDetails(page, name);
        } finally {
            await page.close();
        }
    }

    const first = await runSample('first sample', `
        'use strict';
        const label = 'first';
        var qunitSampleGlobal = label;
        function qunitSampleFunction() { return label; }
        QUnit.test('first sample', assert => {
            assert.strictEqual(window.qunitSampleGlobal, label);
            assert.strictEqual(window.qunitSampleFunction(), label);
            assert.notOk('label' in window);
            Highcharts.setOptions({ time: { timezone: 'America/New_York' } });
            const timestamp = Date.UTC(2024, 0, 1);
            assert.strictEqual(
                Highcharts.format('{timestamp:%H:%M}', { timestamp }), '19:00'
            );
            assert.strictEqual(label, 'expected', 'deliberate failure');
        });
        //# sourceURL=first-sample.js
    `);
    expect(first.qunitResults).toMatchObject({
        status: 'failed', total: 1, failed: 1
    });
    expect(first.failedAssertions).toMatchObject([{
        name: 'first sample',
        message: 'deliberate failure',
        actual: 'first',
        expected: 'expected'
    }]);
    expect(first.failedAssertions[0].source).toContain('first-sample.js:15:');

    const late = await runSample('late errors with fake timers', `
        QUnit.test('passes before the rejection', assert => {
            // Leave the fake timer installed to simulate interrupted cleanup.
            lolex.install({ toFake: ['setTimeout'] });
            assert.ok(true);
        });
        QUnit.on('runEnd', () => {
            Promise.reject(new Error('rejected after runEnd'));
            const reason = { value: 42n };
            reason.self = reason;
            Promise.reject(reason);
        });
    `);
    expect(late.qunitResults).toMatchObject({
        status: 'failed', total: 3, passed: 1, failed: 2
    });
    expect(late.failedAssertions.map(({ name }) => name)).toEqual([
        'Uncaught error after QUnit runEnd',
        'Uncaught error after QUnit runEnd'
    ]);
    const formatted = formatQUnitErrorDetails(late);
    expect(formatted).toContain('rejected after runEnd');
    expect(formatted).toContain('value: 42n');
    expect(formatted).toContain('[Circular *1]');

    const chartOnly = await runSample('chart-only destruction', `
        QUnit.config.failOnZeroTests = false;
        Highcharts.chart('container', {
            chart: {
                events: {
                    destroy() {
                        throw new Error('chart destruction failed');
                    }
                }
            }
        });
    `);
    expect(chartOnly.qunitResults).toMatchObject({
        status: 'failed', total: 1, passed: 0, failed: 1
    });
    expect(chartOnly.failedAssertions).toMatchObject([{
        name: 'Uncaught error after QUnit runEnd',
        message: 'chart destruction failed'
    }]);

    const second = await runSample('second sample', `
        const label = 'second';
        QUnit.test('second sample', assert => {
            assert.strictEqual(label, 'second');
            assert.strictEqual(window.qunitSampleGlobal, undefined);
            assert.strictEqual(window.qunitSampleFunction, undefined);
        });
        QUnit.test('time format is restored', assert => {
            const timestamp = Date.UTC(2024, 0, 1);
            assert.strictEqual(
                Highcharts.format('{timestamp:%H:%M}', { timestamp }), '00:00'
            );
        });
    `);
    expect(second.qunitResults).toMatchObject({
        status: 'passed', total: 2, passed: 2
    });
    expect(second.failedAssertions).toEqual([]);
});

test('QUnit shared page resets samples and reports teardown errors', async ({
    page,
    qunitSetupFile
}) => {
    await writeQUnitSetupFile(qunitSetupFile);
    const source = await initializeWarmPage(page, qunitSetupFile);
    const nativeTimers = await page.evaluateHandle(() => ({
        setTimeout: Reflect.get(window, 'setTimeout'),
        clearTimeout: Reflect.get(window, 'clearTimeout')
    }));

    async function runSample(name: string, script: string) {
        const warm = await prepareWarmSample(page, source, name);
        try {
            await installWarmSampleHooks(page, warm);
            await page.addScriptTag({ content: script });
            await page.evaluate(() => window.QUnit.start());
            await waitForQUnitWithTimeout(page, name, 5000);
            await warm.evaluate(sample => sample.reset());
            await page.evaluate(() => window.getFinalQUnitResults());
            return await captureQUnitErrorDetails(page, name);
        } finally {
            try {
                await warm.evaluate(sample => sample.restore());
            } finally {
                await warm.dispose();
            }
        }
    }

    try {
        const first = await runSample('changes state', `
            QUnit.test('changes state', assert => {
                window.warmSampleProperty = true;
                window.addEventListener('warmSampleEvent', () => {
                    window.warmSampleProperty = true;
                });
                setInterval(() => {
                    window.warmSampleProperty = true;
                }, 25);
                Highcharts.setOptions({ time: { timezone: 'America/New_York' } });
                Highcharts.animate(undefined, undefined, { duration: 10000 });
                assert.strictEqual(Highcharts.Fx.timers.length, 1);
                lolex.install({ toFake: ['setTimeout', 'clearTimeout'] });
                assert.true(window.warmSampleProperty);
            });
        `);
        expect(first.qunitResults).toMatchObject({
            status: 'passed', passed: 1, failed: 0
        });
        expect(await nativeTimers.evaluate(timers =>
            timers.setTimeout === window.setTimeout &&
            timers.clearTimeout === window.clearTimeout
        )).toBe(true);

        await page.evaluate(() => new Promise<void>(resolve => {
            window.addEventListener('unhandledrejection', () => resolve(), {
                once: true
            });
            void Promise.reject(new Error('idle rejection'));
        }));
        const second = await runSample('observes fresh sample state', `
            QUnit.test('observes fresh sample state', async assert => {
                assert.timeout(1000);
                window.dispatchEvent(new Event('warmSampleEvent'));
                await new Promise(resolve => setTimeout(resolve, 60));
                await new Promise(resolve => Highcharts.animate(
                    undefined, undefined, { duration: 25, complete: resolve }
                ));
                assert.strictEqual(window.warmSampleProperty, undefined);
                const timestamp = Date.UTC(2024, 0, 1);
                assert.strictEqual(
                    Highcharts.format('{timestamp:%H:%M}', { timestamp }), '00:00'
                );
            });
        `);
        expect(second.failedAssertions).toEqual([]);
        expect(second.qunitResults).toMatchObject({
            status: 'passed', passed: 1, failed: 0
        });

        const chartOnly = await runSample('chart-only destruction', `
            QUnit.config.failOnZeroTests = false;
            Highcharts.chart('container', {
                chart: {
                    events: {
                        destroy() {
                            Promise.reject(new Error('rejected during destroy'));
                            throw new Error('chart destruction failed');
                        }
                    }
                }
            });
        `);
        expect(chartOnly.qunitResults).toMatchObject({
            status: 'failed', total: 2, failed: 2
        });
        expect(chartOnly.failedAssertions.map(({ message }) => message).sort())
            .toEqual(['chart destruction failed', 'rejected during destroy']);

        const idleMessage = 'After shared sample changes state: idle rejection';
        const finishError = await page.evaluate(() =>
            window.__qunitWarmState.finish()
        ).then(() => '', (error: Error) => error.message);
        expect(finishError.split(idleMessage)).toHaveLength(2);
        await expect(page.evaluate(() => window.__qunitWarmState.finish()))
            .resolves.toBeUndefined();
    } finally {
        await nativeTimers.dispose();
        await source.dispose();
    }
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
            },
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
            },
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

    test('emulateKarma', async ({ page }) => {
        const chart = await createChart(page, {}, {
            chartConstructor: 'mapChart',
            emulateKarma: true
        });
        await page.waitForFunction(()=>  typeof window['proj4'] !== 'undefined' );
        await expect.poll(() => test.info().annotations).toContainEqual({
            type: 'emulateKarma'
        });

        expect(await chart.evaluate(c => c)).toHaveProperty('mapView');

    });

    test('chartCallback option', async ({ page }) => {
        const chart = await createChart(page, {}, {
            chartCallback: (chart) => {
                window['chartCreated'] = true;
                chart['chartCallbackCalled'] = true;
            }
        });

        await page.waitForFunction(() => typeof window['chartCreated'] !== 'undefined');
        expect(await page.evaluate(()=> window['chartCreated'])).toBeTruthy();
        expect(await chart.evaluate((c)=> c['chartCallbackCalled'])).toBeTruthy();
    });
});
