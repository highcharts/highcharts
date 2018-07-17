QUnit.test('tooltip.borderColor #6831', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            data: [1, 2, 3]
        }, {
            data: [3, 2, 1]
        }],
        tooltip: {
            shared: true,
            borderColor: 'red',
            split: true
        }
    });

    var series1 = chart.series[0],
        series2 = chart.series[1],
        p1 = series1.points[0],
        p2 = series2.points[0],
        tooltip = chart.tooltip;

    tooltip.refresh([p1, p2]);

    assert.strictEqual(
         tooltip.tt.box.stroke,
        'red',
        'borderColor is applied on all tooltips'
    );
});

