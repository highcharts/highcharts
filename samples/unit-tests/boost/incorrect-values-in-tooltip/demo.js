QUnit.test(
    'Scatter with boost should show correct values in tooltip (#20621)',
    function (assert) {
        var chart = Highcharts.chart('container', {
            chart: {
                type: 'scatter',
                zooming: {
                    type: 'xy'
                }
            },
            boost: {
                usePreAllocated: true
            },
            xAxis: {
                min: 0,
                max: 100
            },
            yAxis: {
                min: 0,
                max: 100
            },
            series: [
                {
                    // Force trigger boost module
                    boostThreshold: 1,

                    // Force trigger filtering points
                    cropThreshold: 1,

                    data: [
                        [0, 10],
                        [20, -20],
                        [40, 30],
                        [60, 140],
                        [80, 50],
                        [100, 60]
                    ]
                }
            ]
        });

        const points = chart.series[0].points;
        const processedXData = chart.series[0].processedXData;
        const xData = points.map(point => point.x);
        const yData = chart.series[0].yData;

        // Since two points are outside the range of the plot,
        // there should be four points in the series.
        assert.strictEqual(points.length, 4);
        assert.strictEqual(processedXData.length, 4);

        assert.deepEqual(xData, [0, 40, 80, 100]);
        assert.deepEqual(yData, [10, 30, 50, 60]);
    });