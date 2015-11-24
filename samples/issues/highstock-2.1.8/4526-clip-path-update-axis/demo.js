$(function () {
    QUnit.test('Series clip-path after updating axis.', function (assert) {
        var chart = $('#container').highcharts('StockChart', {
            yAxis: [{
                id: 'yAxis-1',
                top: '0%',
                height: '30%'
            }, {
                id: 'yAxis-2',
                top: '50%',
                height: '30%'
            }],
            series: [{
                data: [5, 4, 3, 2, 1, 2, 3, 4, 5]
            }, {
                data: [5, 4, 3, 2, 1, 2, 3, 4, 5],
                yAxis: 'yAxis-2'
            }]
        }).highcharts();

        assert.strictEqual(
            chart.series[0].sharedClipKey !== chart.series[1].sharedClipKey,
            true,
            'Series have separte clip-paths.'
        );
    });
});