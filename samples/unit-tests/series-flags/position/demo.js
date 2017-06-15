QUnit.test('Flags should be properly placed on xAxis when yAxis.top is set.', function (assert) {
    var top = 80,
        chart = $('#container').highcharts('StockChart', {
        yAxis: {
            top: top,
            height: '10%'
        },
        series: [{
            data: [10, 20, 15, 13, 15, 11, 15]
        }, {
            type: 'flags',
            data: [{
                x: 5,
                title: 5
            }]
        }]
    }).highcharts();

    assert.strictEqual(
        chart.series[1].points[0].plotY + top,
        chart.plotHeight + chart.plotTop,
        'Flag properly placed.'
    );
});