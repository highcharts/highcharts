
QUnit.test('Check compatibility with broken-axis/highstock (#5950).', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            type: 'funnel',
            data: [0.5, 0.8]
        }, {
            data: [1, 2, 1]
        }]
    });

    assert.strictEqual(
        !!(chart.series[1].graph && chart.series[1].group),
        true,
        'Second series rendered.'
    );
});
