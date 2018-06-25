QUnit.test('Flags on inverted chart', function (assert) {
    var chart = new Highcharts.chart('container', {
        chart: {
            inverted: true
        },
        series: [{
            data: [10, 20, 30, 10, 20, 30],
            id: 'main'
        }, {
            type: 'flags',
            data: [{
                x: 3
            }]
        }, {
            type: 'flags',
            onSeries: 'main',
            data: [{
                x: 3
            }]
        }]
    });

    assert.strictEqual(
        chart.series[1].points[0].plotX,
        0,
        'Flag properly placed on xAxis (#4960)'
    );

    assert.strictEqual(
        chart.series[2].points[0].plotX,
        chart.yAxis[0].toPixels(chart.series[0].points[3].y, true),
        'Flag properly placed on xAxis (#4960)'
    );
});

QUnit.test('Flags should be properly placed on xAxis when yAxis.top is set.', function (assert) {
    var top = 80,
        chart = $('#container').highcharts('StockChart', {
            yAxis: {
                top: top,
                height: '10%'
            },
            series: [{
                data: [10, 20, 15, 13, 15, 11, 15]
            }, {
                type: 'flags',
                data: [{
                    x: 5,
                    title: 5
                }]
            }]
        }).highcharts();

    assert.strictEqual(
        chart.series[1].points[0].plotY + top,
        chart.plotHeight + chart.plotTop,
        'Flag properly placed.'
    );
});

QUnit.test('#2049 - Flag series on grouped columns.', function (assert) {

    var chart = Highcharts.stockChart('container', {
            chart: {
                type: 'column'
            },
            series: [{
                data: [
                  [0, 50.245666000100002],
                  [1, 22.0]
                ],
                id: 'left'
            }, {
                data: [
                  [0, 55.0],
                  [1, 22.0]
                ],
                id: 'right'
            }, {
                data: [{
                    x: 0
                }, {
                    x: 1
                }],
                onSeries: 'left',
                type: 'flags'
            }, {
                data: [{
                    x: 0
                }, {
                    x: 1
                }],
                onSeries: 'right',
                type: 'flags'
            }
            ]
        }),
        series,
        xOffset;

    Highcharts.each([0, 1], function (i) {
        series = chart.series[i];
        xOffset = series.pointXOffset + series.barW / 2;
        Highcharts.each(series.points, function (point, j) {
            assert.strictEqual(
                Math.round(point.plotX + xOffset),
                Math.round(chart.series[i + 2].points[j].plotX),
                'Flag ' + j + ' from series ' + chart.series[i + 2].name + ' matches corresponding column.'
            );
        });
    });
});