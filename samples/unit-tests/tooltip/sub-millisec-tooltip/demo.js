QUnit.test('Sub-millisecond tooltip(#4223)', function (assert) {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container'
        },
        title: {
            text:
                'Tooltip shows only year when xAxis.closestPointRange < 1 msec',
            x: -20 // center
        },
        xAxis: {
            type: 'datetime'
        },
        series: [
            {
                data: [
                    [1432548947841.3, 7.0],
                    [1432548947841.7, 6.9]
                ]
            }
        ]
    });

    assert.equal(
        chart.xAxis[0].dateTime.getXDateFormat(
            chart.series[0].points[0].x,
            chart.options.tooltip.dateTimeLabelFormats
        ),
        '%A, %e %b, %H:%M:%S.%L',
        'Milliseconds are preserved in tooltip'
    );
});
