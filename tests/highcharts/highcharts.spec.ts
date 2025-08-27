import type { Page } from '@playwright/test';
import { test, expect, createChart, setupRoutes } from '../fixtures.ts';
import { testImageDataURL } from '../testContent.ts';

test.describe('unit-tests/chart/renderto equivalent', () => {
    test.describe.configure({ mode: 'serial'});

    // Set up page in advance to share browser between tests
    // which saves setup time for each test
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        const context = await browser.newContext();
        page = await context.newPage();
        await setupRoutes(page); // need to setup routes separately
    });

    test.afterAll(async ({ browser }) => {
        await browser.close();
    });

    test.beforeEach(async () => {
        const css = `
        #container {
            display: none;
            height: 300px;
            width: 300px;
        }

        #outer {
            visibility: hidden;
        }

        #outer-outer {
            visibility: hidden;
            display: none;
        }
        `;

        await page.setContent(
            `<html>
                <head>
                    <style>${css}</style>

                    <script src="https://code.highcharts.com/highcharts.js"></script>
                    <script src="https://code.highcharts.com/highcharts-3d.js"></script>
                </head>
                <body>
                    <div id="outer-outer">
                        <div id="outer">
                            <div id="container"></div>
                        </div>
                    </div>
                </body>
            </html>`
        );
    });

    test('Container initially hidden (#6693)', async () => {
        const height = await page.evaluate(() => {
            const outerOuter = document.createElement('div');
            outerOuter.style.visibility = 'hidden';
            outerOuter.style.display = 'none';
            document.body.appendChild(outerOuter);

            const outer = document.createElement('div');
            outer.style.visibility = 'hidden';
            outerOuter.appendChild(outer);

            const container = document.createElement('div');
            container.style.display = 'none';
            container.style.width = '300px';
            container.style.height = '300px';
            outer.appendChild(container);

            const chart = Highcharts.chart(container, {
                series: [
                    {
                        type: 'column',
                        data: [1, 3, 2, 4]
                    }
                ]
            });

            container.style.display = 'block';
            outer.style.display = 'block';
            outer.style.visibility = 'visible';
            outerOuter.style.display = 'block';
            outerOuter.style.visibility = 'visible';

            return chart.chartHeight;
        });

        expect(height).toStrictEqual(300);
    });

    test('Container originally detached (#5783)', async () => {
        const chart = await page.evaluateHandle(() => {
            const c = document.createElement('div');
            document.getElementById('container')?.appendChild(c);

            c.style.width = '200px';
            c.style.height = '200px';

            return Highcharts.chart({
                chart: {
                    renderTo: c
                },
                title: {
                    text: 'The height of the chart is set to 200px'
                },
                xAxis: {
                    categories: [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec'
                    ]
                },
                series: [
                    {
                        type: 'line',
                        data: [
                            29.9,
                            71.5,
                            106.4,
                            129.2,
                            144.0,
                            176.0,
                            135.6,
                            148.5,
                            216.4,
                            194.1,
                            95.6,
                            54.4
                        ]
                    }
                ]
            });
        });

        expect(await chart.evaluate(c => c.chartWidth)).toBe(200);

        await chart.evaluate(prevChart => (
            Highcharts.chart({
                chart: { renderTo: prevChart.container },
                title: {
                    text: 'The second chart in the same container'
                },
                xAxis: {
                    categories: [
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                        'Sep',
                        'Oct',
                        'Nov',
                        'Dec'
                    ]
                },
                series: [
                    {
                        data: [
                            29.9,
                            71.5,
                            106.4,
                            129.2,
                            144.0,
                            176.0,
                            135.6,
                            148.5,
                            216.4,
                            194.1,
                            95.6,
                            54.4
                        ],
                        type: 'column'
                    }
                ]
            })
        ));
    });
});


test.describe('samples/unit-tests/polar/polar-zoom equivalent', () => {
    test('Arc shape', async ({ page }) => {
        const handle = await createChart(
            page,
            {
                chart: {
                    zooming: {
                        type: 'xy'
                    },
                    polar: true,
                },
                series: [{
                    type: 'column',
                    data: [8, 7, 6, 5, 4, 3, 2, 1]
                }]
            },
            {
                modules: ['highcharts-more.src.js']
            }
        );

        const createdChart = await handle.jsonValue();
        expect(createdChart).toHaveProperty('polar', true);

        let [centerX, centerY] = (createdChart as any)
            .pane[0].center as [number, number];

        centerX += createdChart.plotLeft;
        centerY += createdChart.plotTop;

        await page.mouse.move(centerX - 50, centerY);
        await page.mouse.down();
        await page.mouse.move(centerX + 100, centerY);

        await expect(
            page.locator('.highcharts-selection-marker')
        ).toHaveAttribute('d', /\sA|a\s/gu) ;

        await page.mouse.up(); // Not strictly neccessary, but keeping for now
    });
});

test.describe('SVGRenderer', () => {
    test('Symbol tests', {
        annotation: [
            {
                type: 'qunit-sample',
                description: 'samples/unit-tests/svgrenderer/symbols'
            }
        ]
    }, async ({ page }) => {
        const w = 400,
            h = 400,
            url = testImageDataURL;

        const chart = await createChart(
            page,
            {
                chart: {
                    width: w,
                    height: h,
                    backgroundColor: 'none'
                }
            }
        );
        const renderer = await chart.evaluateHandle( c => c.renderer);
        await renderer.evaluate(
            (ren,  url) => {
                ren.symbol(url, 100, 100)
                    .attr({ 'data-testid':'symbol1' })
                    .add();


                // With explicit size
                ren.symbol(
                    url,
                    200,
                    100,
                    null,
                    null,
                    {
                        width: 20,
                        height: 20
                    } as any
                )
                    .attr({ 'data-testid': 'symbol2' })
                    .add();


                // Label with background
                ren.label('Hello Label', 300, 100, url)
                    .attr({
                        padding: 0,
                        width: 100,
                        height: 30,
                        'data-testid': 'label'
                    })
                    .add();

                // Symbol with wrong name #6627
                ren
                    .symbol('krakow', 100, 200, 10, 10)
                    .attr({
                        fill: 'red',
                        'data-testid': 'symbol3'
                    })
                    .add();
            },
            url
        );

        const symbol1 = page.getByTestId('symbol1');
        const symbol2 = page.getByTestId('symbol2');
        const labelImg = page.getByTestId('label')
            .locator('image');
        const symbol3 = page.getByTestId('symbol3');

        await Promise.all([
            expect(symbol1).toHaveAttribute('width', '30'),
            expect(symbol1).toHaveAttribute('transform', /translate\(-15[ ,]-15\)/),

            expect(symbol2).toHaveAttribute('width', '20'),
            expect(symbol2).toHaveAttribute('transform', /translate\(-10[ ,]-10\)/),

            expect(labelImg).toHaveAttribute('width', '30'),
            expect(labelImg).toHaveAttribute('transform', /translate\(35[ ,]0\)/),

            expect(symbol3).toHaveJSProperty('tagName', 'path'),
            expect(symbol3).toHaveAttribute('d', /A\s+5\s+5/)
        ]);

        await renderer.dispose();
    });
});
