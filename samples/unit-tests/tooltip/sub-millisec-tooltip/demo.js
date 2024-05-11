QUnit.test('Sub-millisecond tooltip(#4223)', function (assert) {
    const chart = new Highcharts.Chart({
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

    chart.tooltip.refresh(chart.series[0].points[0]);

    assert.notEqual(
        chart.tooltip.label.text.element.textContent.indexOf('841'),
        -1,
        'Milliseconds should be preserved in tooltip'
    );
});
