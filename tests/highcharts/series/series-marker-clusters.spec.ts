import type { Page } from '@playwright/test';

import { test, expect, createChart } from '~/fixtures.ts';

async function getClusterStateAfterDatetimeMsGridClustering(
    page: Page,
    xAxisReversed: boolean
): Promise<{
    hasClustersArray: boolean;
    clustersLength: number | null;
}> {
    const options: Highcharts.Options = {
        chart: {
            width: 800
        },
        title: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            reversed: xAxisReversed
        },
        series: [{
            type: 'scatter',
            data: [
                { x: 1694561823000, y: 1 },
                { x: 1694561823000 + 1, y: 1 }
            ],
            cluster: {
                enabled: true,
                animation: false
            }
        }]
    };

    const chart = await createChart(page, options, {
        modules: ['modules/marker-clusters.js']
    });

    // Ensure the page event loop is responsive right after chart creation.
    // A blocked main thread would prevent the timer from firing.
    await page.evaluate(() => new Promise<void>(resolve => {
        window.setTimeout(() => resolve(), 0);
    }));

    return chart.evaluate(c => {
        const series = c.series[0];
        const markerClusterInfo = series.markerClusterInfo;
        const clusters =
            markerClusterInfo && markerClusterInfo.clusters;

        return {
            hasClustersArray: Array.isArray(clusters),
            clustersLength: clusters ? clusters.length : null
        };
    });
}

test.describe('series/marker-clusters', {
    annotation: [
        {
            type: 'qunit-sample',
            description: 'samples/unit-tests/series/marker-clusters'
        }
    ]
}, () => {
    const options = {
        chart: {
            width: 500
        },
        title: {
            text: ''
        },
        plotOptions: {
            scatter: {
                tooltip: {
                    headerFormat: '',
                    pointFormat: 'value: {point.y}',
                    clusterFormat: 'Cluster size: {point.clusterPointsAmount}'
                },
                dataLabels: {
                    enabled: true
                },
                cluster: {
                    enabled: true,
                    animation: false,
                    layoutAlgorithm: {
                        type: 'grid'
                    },
                    dataLabels: {
                        enabled: true,
                        format: '{point.clusterPointsAmount}',
                        verticalAlign: 'middle',
                        align: 'center',
                        marker: {
                            fontSize: '9px'
                        }
                    }
                }
            }
        },
        series: [
            {
                type: 'scatter',
                data: [
                    {
                        x: -751,
                        y: 356
                    },
                    {
                        x: -573,
                        y: 285
                    },
                    {
                        x: -427,
                        y: 339
                    },
                    {
                        x: -775,
                        y: 578
                    },
                    {
                        x: -770,
                        y: 570
                    },
                    {
                        x: -780,
                        y: 560
                    },
                    {
                        x: -785,
                        y: 580
                    },
                    {
                        x: -770,
                        y: 550
                    },
                    {
                        x: -740,
                        y: 520
                    },
                    {
                        x: -710,
                        y: 538
                    },
                    {
                        x: -720,
                        y: 540
                    },
                    {
                        x: -710,
                        y: 630
                    },
                    {
                        x: -715,
                        y: 670
                    },
                    {
                        x: -720,
                        y: 620
                    },
                    {
                        x: -740,
                        y: 616
                    },
                    {
                        x: -788,
                        y: 620
                    },
                    {
                        x: -780,
                        y: 616
                    },
                    {
                        x: -778,
                        y: 618
                    },
                    {
                        x: -783,
                        y: 617
                    },
                    {
                        x: -880,
                        y: 451
                    }
                ]
            }
        ]
    };
    test('General marker-clusters', async ({ page }) => {
        const chart = await createChart(
            page,
            options as Highcharts.Options,
            {
                modules: [
                    'modules/marker-clusters.js'
                ]
            }
        );

        expect(
            await chart.evaluate((c)=>{
                const [series] = c.series;
                let result = true;

                const clusterOptions = series.options.cluster;

                series.update({
                    cluster: {
                        minimumClusterSize: 3,
                        layoutAlgorithm: {
                            type: 'grid',
                            gridSize: 50
                        }
                    }
                } as any);


                series.markerClusterInfo.clusters.forEach(function (cluster) {
                    if (
                        cluster.data.length < clusterOptions.minimumClusterSize
                    ) {
                        result = false;
                    }
                });

                return result;
            }),
            'Cluster data size should be greater or equal minimumClusterSize.'
        ).toBe(true);

        const cluster = await chart.evaluateHandle(c =>{
            const [series] = c.series;
            series.update({
                cluster: {
                    minimumClusterSize: 2,
                    marker: {
                        radius: 18
                    }
                }
            } as any);

            return series.markerClusterInfo.clusters[0];
        });

        await test.step('Cluster data', async ()=>{});

        const [clusterData, clusterX, clusterY] = await cluster.evaluate(
            c => [c.data, c.x, c.y]
        );

        let posX = 0, posY = 0;
        for (const p of clusterData) {
            posX += p.x;
            posY += p.y;
        }

        const clusterLength = clusterData.length;
        expect(
            [clusterX, clusterY],
            'Cluster position should be an average of clustered points.'
        ).toEqual(
            [posX / clusterLength, posY / clusterLength],
        );

        expect(
            await cluster.evaluate(
                c => Number(c.point.graphic.getBBox().width / 2).toFixed(2)
            ),
            'Cluster marker size should be two times bigger than radius.'
        ).toEqual(
            '18.00'
        );
    });

    test('Grid algorithm should not hang on datetime data', async ({ page }) => {
        // Related to #19740
        // If the grid clustering algorithm regresses into an infinite loop,
        // this test should fail quickly by hitting the timeout below.
        test.setTimeout(15000);
        expect(
            await getClusterStateAfterDatetimeMsGridClustering(page, false),
            'Clustering should complete and keep browser responsive.'
        ).toEqual({
            hasClustersArray: true,
            clustersLength: 0
        });
    });

    test('Grid algorithm should not hang on datetime data with reversed xAxis', async ({ page }) => {
        // Related to #19740 — reversed axis can change grid math paths.
        test.setTimeout(15000);
        expect(
            await getClusterStateAfterDatetimeMsGridClustering(page, true),
            'Clustering should complete and keep browser responsive.'
        ).toEqual({
            hasClustersArray: true,
            clustersLength: 0
        });
    });
});
