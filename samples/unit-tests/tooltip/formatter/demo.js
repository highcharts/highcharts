QUnit.test('Formatter returns undefined', function (assert) {
    var chart = Highcharts.chart('container', {
        tooltip: {
            formatter: function () {
                return undefined;
            }
        },
        series: [{
            data: [1, 2, 3]
        }]
    });

    chart.tooltip.refresh(chart.series[0].points[0]);

    // Test wether tooltip.refresh raises an exception.
    assert.ok(
        true,
        'Tooltip.refresh passes when formatter returns undefined. #5922'
    );
});