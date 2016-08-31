$(function () {
    QUnit.test('Sub-millisecond tooltip', function (assert) {
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container'
            },
            title: {
                text: 'Tooltip shows only year when xAxis.closestPointRange < 1 msec',
                x: -20 //center
            },
            xAxis: {
                type: 'datetime'
            },
            series: [{
                data: [
                    [1432548947841.300, 7.0],
                    [1432548947841.700, 6.9]
                ]
            }]
        });


        assert.equal(
            Highcharts.Tooltip.prototype.getXDateFormat.call(chart.tooltip, chart.series[0].points[0], chart.options.tooltip, chart.xAxis[0]),
            '%A, %b %e, %H:%M:%S.%L',
            'Milliseconds are preserved in tooltip'
        );

    });

});