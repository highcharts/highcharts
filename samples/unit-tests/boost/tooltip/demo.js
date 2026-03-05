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

    const color = 'lime';

    chart.series[0].update({
        type: 'scatter',
        data: [{
            x: 0,
            y: 3,
            color
        }, {
            x: 5000,
            y: 1,
            color: 'black'
        }]
    });

    controller.moveTo(
        chart.series[0].points[0].plotX + chart.plotLeft,
        chart.series[0].points[0].plotY + chart.plotTop
    );

    assert.strictEqual(
        chart.hoverPoint.color,
        color,
        'Hover point should be same as declared in data, #23370.'
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
    }
);

QUnit.test(
    'Scatter with boost and series.keys should keep keys after zoom (#23771)',
    function (assert) {
        const size = 18;
        const data = [];
        let index = 0;

        for (let i = 1; i <= size; ++i) {
            for (let j = 1; j <= size; ++j) {
                data.push([i, j, i + j, index]);
                ++index;
            }
        }

        const chart = Highcharts.chart('container', {
            chart: {
                type: 'scatter'
            },
            xAxis: {
                min: 0,
                max: size + 1
            },
            yAxis: {
                min: 0,
                max: size + 1
            },
            series: [{
                boostThreshold: 200,
                cropThreshold: 1,
                data: data,
                keys: ['y', 'x', 'sum', 'at']
            }]
        });

        const series = chart.series[0];

        chart.xAxis[0].setExtremes(10, 12, false);
        chart.yAxis[0].setExtremes(10, 12);

        const points = series.points.map(point => series.boost.getPoint(point));
        assert.ok(points.length, 'Points should exist after zoom');

        points.forEach(point => {
            assert.strictEqual(
                point.sum,
                point.x + point.y,
                'Custom key "sum" should match x + y'
            );
            assert.strictEqual(
                point.at,
                (point.y - 1) * size + (point.x - 1),
                'Custom key "at" should match the source data index'
            );
        });
    }
);
