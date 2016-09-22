$(function () {
    QUnit.test('JS error on range selector in non-Highstock', function (assert) {

        assert.expect(0); // We just expect it to not throw

        Highcharts.chart('container', {
            rangeSelector: {
                enabled: true,
                selected: 1
            },

            xAxis: {
                type: 'datetime'
            },

            series: [{
                name: 'AAPL',
                data: [1, 3, 2, 4, 3, 5, 4, 6],
                tooltip: {
                    valueDecimals: 2
                }
            }]
        });
    });
});