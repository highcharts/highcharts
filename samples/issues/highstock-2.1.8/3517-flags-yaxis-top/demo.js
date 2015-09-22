
$(function () {
    QUnit.test('Flags should be properly placed on xAxis when yAxis.top is set.', function (assert) {
        var chart = $('#container').highcharts('StockChart', {
            yAxis: {
                top: '50%',
                height: '10%'
            },
            series: [{
                data: [10, 20, 15, 13, 15, 11, 15]
            }, {
                type: 'flags',
                data: [{
                    x: 5,
                    title: 5,
                    lineWidth: 5
                }]
            }]
        }).highcharts();

        assert.strictEqual(
            chart.series[1].points[0].plotY,
            chart.xAxis[0].top,
            'Flag properly placed.'
        );
    });
});