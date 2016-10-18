$(function () {
    QUnit.test('alignTicks should consider only axes with series.', function (assert) {
        var chart = $('#container').highcharts({
            yAxis: [{
                endOnTick: false,
                maxPadding: 0.0
            }, {
                endOnTick: false,
                maxPadding: 0.0
            }],
            series: [{
                data: [991, 455],
                yAxis: 1
            }]
        }).highcharts();

        assert.strictEqual(
            chart.series[0].data[0].plotY,
            0,
            'Without extra padding'
        );

    });

});