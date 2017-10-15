
QUnit.test('Test Pivot points calculations on data updates.', function (assert) {

    var period = 3,
        chart = Highcharts.stockChart('container', {
            series: [{
                id: 'main',
                type: 'candlestick',
                data: [
                    [0, 5, 7, 4, 7],
                    [1, 5, 6, 3, 4],
                    [2, 5, 6, 3, 4],
                    [3, 5, 6, 3, 4],
                    [4, 5, 6, 3, 4],
                    [5, 5, 6, 3, 4]
                ]
            }, {
                type: 'pivotpoints',
                linkedTo: 'main',
                params: {
                    period: period
                }
            }]
        });

    assert.strictEqual(
        Math.ceil(chart.series[0].points.length / period),
        chart.series[1].points.length,
        'Initial number of pivot points is correct'
    );

    chart.series[0].addPoint([6, 17, 18, 10, 17]);

    assert.strictEqual(
        Math.ceil(chart.series[0].points.length / period),
        chart.series[1].points.length,
        'After addPoint() number of pivot points is correct'
    );

    chart.series[0].points[chart.series[0].points.length - 1].remove();

    assert.strictEqual(
        Math.ceil(chart.series[0].points.length / period),
        chart.series[1].points.length,
        'After point.remove() number of pivot points is correct'
    );

    chart.series[1].update({
        color: 'red',
        dataLabels: {
            enabled: false
        }
    });

    assert.strictEqual(
        chart.series[1].graph.attr('stroke'),
        'red',
        'Line color changed'
    );

    assert.strictEqual(
        chart.series[1].dataLabelsGroup.element.childNodes.length,
        0,
        'All dataLabels properly removed'
    );
});
