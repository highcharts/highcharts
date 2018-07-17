QUnit.test('dataGrouping for area range', function (assert) {
    var chart = Highcharts.chart('container', {
            plotOptions: {
                series: {
                    dataGrouping: {
                        enabled: true,
                        forced: true,
                        units: [
                            ['millisecond', [2]]
                        ]
                    }
                }
            },
            series: [{
                type: 'arearange',
                data: [
                    [0, 0, 1],
                    [1, 2, 3],
                    [2, 4, 5],
                    [3, 6, 7],
                    [4, 8, 9],
                    [5, 10, 11],
                    [50, 10, 11]
                ],
                dataGrouping: {
                    approximation: 'averages'
                }
            }, {
                data: [
                    [0, 0],
                    [1, 2],
                    [2, 4],
                    [3, 6],
                    [4, 8],
                    [5, 10],
                    [50, 10]
                ]
            }, {
                data: [
                    [0, 1],
                    [1, 3],
                    [2, 5],
                    [3, 7],
                    [4, 9],
                    [5, 11],
                    [50, 11]
                ]
            }]
        }),
        rangePoint = chart.series[0].points[1];

    assert.ok(
        rangePoint.plotLow === chart.series[1].points[1].plotY &&
            rangePoint.plotHigh === chart.series[2].points[1].plotY,
        'approximations.averages() used successfully (#5479)'
    );

    assert.ok(
        chart.series[0].points.length === chart.series[1].points.length,
        'approximations.averages() returns undefined if needed (#7377)'
    );
});
