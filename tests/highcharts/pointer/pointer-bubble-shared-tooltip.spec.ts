import { test, expect } from '~/fixtures.ts';

test.describe.configure({
    mode: 'serial'
});

const localScripts = `
    <html>
        <head>
            <meta charset="utf-8" />
            <style> #container { width: 600px; height: 400px; } </style>
            <script src="https://code.highcharts.com/highcharts.js"></script>
            <script src="https://code.highcharts.com/highcharts-more.js"></script>
        </head>
        <body>
            <div id="container"></div>
        </body>
    </html>
`;

test('Shared tooltip keeps the directly hovered bubble point', async ({
    page
}) => {
    await page.setContent(localScripts);
    await page.waitForFunction(() => !!window.Highcharts);

    const target = await page.evaluate(() => {
        const H = window.Highcharts,
            scatterProto = H.Series.types.scatter.prototype;

        scatterProto.noSharedTooltip = false;

        const chart = H.chart('container', {
                chart: {
                    animation: false,
                    type: 'bubble',
                    width: 600
                },
                tooltip: {
                    followPointer: true,
                    shared: true
                },
                plotOptions: {
                    series: {
                        animation: false,
                        kdNow: true
                    }
                },
                series: [{
                    type: 'bubble',
                    maxSize: 120,
                    minSize: 40,
                    data: [
                        [1, 9, 2],
                        [1.2, 9, 1]
                    ]
                }, {
                    type: 'bubble',
                    maxSize: 120,
                    minSize: 40,
                    data: [
                        [1, 6, 1],
                        [1.2, 6, 1]
                    ]
                }]
            }),
            point = chart.series[1].points[0],
            rect = point.graphic?.element.getBoundingClientRect();

        if (!rect) {
            throw new Error('Could not resolve bubble graphic bounds');
        }

        for (let y = Math.floor(rect.top) + 1; y < rect.bottom; y += 2) {
            for (let x = Math.floor(rect.left) + 1; x < rect.right; x += 2) {
                const hoveredPoint = document
                    .elementsFromPoint(x, y)
                    .map((el): unknown => (el as any).point)
                    .find(Boolean);

                if (hoveredPoint === point) {
                    return {
                        x,
                        y
                    };
                }
            }
        }

        throw new Error('Could not find a visible pixel for the lower bubble');
    });

    await page.mouse.move(target.x, target.y);

    const state = await page.evaluate(() => {
        const chart = window.Highcharts.charts[0];

        return {
            hoverPoint: chart.hoverPoint && {
                index: chart.hoverPoint.index,
                series: chart.hoverPoint.series.index,
                x: chart.hoverPoint.x,
                y: chart.hoverPoint.y
            },
            hoverPoints: chart.hoverPoints?.map((point) => ({
                index: point.index,
                series: point.series.index,
                x: point.x,
                y: point.y
            }))
        };
    });

    expect(state.hoverPoint).toEqual({
        index: 0,
        series: 1,
        x: 1,
        y: 6
    });
    expect(state.hoverPoints).toEqual([
        {
            index: 0,
            series: 0,
            x: 1,
            y: 9
        },
        {
            index: 0,
            series: 1,
            x: 1,
            y: 6
        }
    ]);

    await page.evaluate(() => {
        window.Highcharts.Series.types.scatter.prototype.noSharedTooltip = true;
    });
});

test('Bubble demo points stay individually hoverable', async ({ page }) => {
    await page.setContent(localScripts);
    await page.waitForFunction(() => !!window.Highcharts);

    const targets = await page.evaluate(() => {
        const H = window.Highcharts;

        H.chart('container', {
            chart: {
                type: 'bubble',
                plotBorderWidth: 1,
                zooming: {
                    type: 'xy'
                }
            },
            tooltip: {
                followPointer: true
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}'
                    }
                }
            },
            series: [{
                data: [
                    { x: 95, y: 95, z: 13.8, name: 'BE' },
                    { x: 86.5, y: 102.9, z: 14.7, name: 'DE' },
                    { x: 80.8, y: 91.5, z: 15.8, name: 'FI' },
                    { x: 80.4, y: 102.5, z: 12, name: 'NL' },
                    { x: 80.3, y: 86.1, z: 11.8, name: 'SE' },
                    { x: 78.4, y: 70.1, z: 16.6, name: 'ES' },
                    { x: 74.2, y: 68.5, z: 14.5, name: 'FR' },
                    { x: 73.5, y: 83.1, z: 10, name: 'NO' },
                    { x: 71, y: 93.2, z: 24.7, name: 'UK' },
                    { x: 69.2, y: 57.6, z: 10.4, name: 'IT' },
                    { x: 68.6, y: 20, z: 16, name: 'RU' },
                    { x: 65.5, y: 126.4, z: 35.3, name: 'US' },
                    { x: 65.4, y: 50.8, z: 28.5, name: 'HU' },
                    { x: 63.4, y: 51.8, z: 15.4, name: 'PT' },
                    { x: 64, y: 82.9, z: 31.3, name: 'NZ' }
                ],
                colorByPoint: true
            }]
        });

        const chart = H.charts[0],
            targets: Array<{
                x: number;
                y: number;
                index: number;
                name: string;
            }> = [];

        chart.series[0].points.forEach((point) => {
            const rect = point.graphic?.element.getBoundingClientRect();

            if (!rect) {
                return;
            }

            for (let y = Math.floor(rect.top) + 1; y < rect.bottom; y += 2) {
                for (
                    let x = Math.floor(rect.left) + 1;
                    x < rect.right;
                    x += 2
                ) {
                    const hoveredPoint = document
                        .elementsFromPoint(x, y)
                        .map((el): unknown => (el as any).point)
                        .find(Boolean);

                    if (hoveredPoint === point) {
                        targets.push({
                            x,
                            y,
                            index: point.index,
                            name: point.name
                        });
                        return;
                    }
                }
            }
        });

        return targets;
    });

    const results: Array<{
        actual: string;
        expected: string;
        matches: boolean;
    }> = [];

    for (const target of targets) {
        await page.mouse.move(target.x, target.y);

        const hoverPoint = await page.evaluate(() => {
            const point = window.Highcharts.charts[0].hoverPoint;

            return point ? {
                index: point.index,
                name: point.name
            } : null;
        });

        results.push({
            actual: hoverPoint?.name || 'none',
            expected: target.name,
            matches: hoverPoint?.index === target.index
        });
    }

    expect(
        results
            .filter(({ matches }) => !matches)
            .map(({ expected, actual }) => `${expected} -> ${actual}`)
    ).toEqual([]);
});
