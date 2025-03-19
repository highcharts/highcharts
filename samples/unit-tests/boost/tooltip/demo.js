QUnit.test('Tooltip on a boosted chart with categories', function (assert) {
    var chart = Highcharts.chart('container', {
            xAxis: {
                categories: ['CategoryName', 'B', 'C']
            },
            series: [
                {
                    boostThreshold: 1,
                    data: [0, 1, 2]
                }
            ]
        }),
        controller = new TestController(chart);

    controller.moveTo(chart.plotLeft + 5, chart.plotTop + 5);

    assert.ok(
        document
            .getElementsByClassName('highcharts-tooltip')[0]
            .textContent.match('CategoryName') !== null,
        '`CategoryName` found in the tooltip (#10432).'
    );

    chart.update({
        xAxis: {
            min: -10000,
            max: 10000
        },
        yAxis: {
            min: -10000,
            max: 10000
        }
    });

    controller.moveTo(chart.plotLeft + chart.plotWidth - 10, chart.plotTop + 5);

    assert.strictEqual(
        chart.hoverPoint.y,
        2,
        'The last hoverable point should be the last in the series. (#18856)'
    );
});

QUnit.test(
    'Scatter with boost should show correct values in tooltip (#20621)',
    function (assert) {

        Highcharts.addEvent(Highcharts.Series, 'setOptions', e => {
            const series = e.target;
            const yAxis = series.chart.axes[1];
            yAxis.treeGrid = false;
        });

        const chart = Highcharts.chart('container', {
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

        const series = chart.series[0];
        const processedXData = series.getColumn('x', true);
        const points = series.points;
        const tooltipPoints = points.map(point => {
            const boostPoint = series.boost.getPoint(point);
            return [boostPoint.x, boostPoint.y];
        });

        // Since two points are outside the range of the plot,
        // there should be four points in the series.
        assert.strictEqual(points.length, 4, 'Points should be filtered');
        assert.strictEqual(
            processedXData.length,
            4,
            'Processed points should be filtered'
        );

        assert.deepEqual(
            processedXData,
            [0, 40, 80, 100],
            'Points outside plot range should be removed'
        );

        assert.deepEqual(
            tooltipPoints,
            [
                [0, 10],
                [40, 30],
                [80, 50],
                [100, 60]
            ],
            'Tooltip should use the filtered points'
        );
    });