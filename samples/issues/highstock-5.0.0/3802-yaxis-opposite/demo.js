$(function () {
    QUnit.test('yAxis should be on the left side, when opposite is false', function (assert) {

        Highcharts.setOptions({
            yAxis: {
                opposite: false,
                lineColor: 'red',
                lineWidth: 2
            }
        });

        var chart = $('#container').highcharts('StockChart', {
            series: [{
                data: [1, 20, 5, 1, 11]
            }]
        }).highcharts();

        assert.strictEqual(
            chart.yAxis[0].options.opposite,
            false,
            'yAxis is on the left side'
        );

    });
});