import { test, expect } from '../fixtures.ts';

test.describe('unit-tests/chart/renderto equivalent', () => {
    test.beforeEach(async ({ page }) => {
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
            </html>`,
            { waitUntil: 'networkidle' }
        );
    });

    test('Container initially hidden (#6693)', async ({ page }) => {
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

    test('Container originally detached (#5783)', async ({ page }) => {
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
