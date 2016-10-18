$(function () {
    QUnit.test('Compare to negative', function (assert) {
        var chart = $('#container').highcharts('StockChart', {
            series: [{
                data: [-100, -150, -125, -300, -250],
                compare: 'percent'
            }]
        }).highcharts();

        assert.strictEqual(
            typeof chart.yAxis[0].min,
            'number',
            'Has a minimum'
        );
        assert.strictEqual(
            typeof chart.yAxis[0].max,
            'number',
            'Has a maximum'
        );
    });
});