$(function () {
    QUnit.test('Scrollbar bar should be visible even when navigator is disabled and series are added after chart init.', function (assert) {
        var done = assert.async();

        $('#container').highcharts('StockChart', {
            chart: {
                zoomType: 'xy'
            },
            navigator: {
                enabled: false
            },
            scrollbar: {
                enabled: true,
                showFull: true
            }
        }, function (chart) {
            setTimeout(function () {
                chart.addSeries({
                    data: [1, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 1]
                });
                assert.strictEqual(
                    chart.scroller.scrollbar.group.translateY >= 0,
                    true,
                    'Correct position for a scrollbar'
                );
                done();
            }, 1);
        });

    });
});