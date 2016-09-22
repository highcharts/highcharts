$(function () {
    QUnit.test('Zone zAxis shouldn\'t cause errors in Navigator series.', function (assert) {
        var chart = $('#container').highcharts('StockChart', {
            series: [{
                type: 'bubble',
                data: [
                    [0, 10, 20],
                    [1, 10, 20]
                ]
            }]
        }).highcharts();

        assert.strictEqual(
            chart.scroller.handles.length !== 0, // handles are not rendered when we get error in zones
            true,
            'No errors in zones for bubble series.'
        );
    });
});