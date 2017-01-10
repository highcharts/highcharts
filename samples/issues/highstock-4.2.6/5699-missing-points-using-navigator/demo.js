$(function () {
    QUnit.test('Points are missing when series is added after chart was created and using navigator.', function (assert) {
        var container = $('#container'),
            chart = container.highcharts('StockChart', {
                chart: {
                    width: 600,
                    height: 400
                }
            }).highcharts(),
            offset = container.offset(),
            navigator = chart.scroller,
            done = assert.async();

        chart.addSeries({
            type: 'column',
            name: 'USD to EUR',
            data: usdeur
        });

        navigator.handlesMousedown({
            pageX: offset.left + 578,
            pageY: offset.top + 400 - 30
        }, 0);

        navigator.mouseMoveHandler({
            pageX: offset.left + 309,
            pageY: offset.top + 400 - 30,
            DOMType: 'mousemove'
        });

        setTimeout(function () {
            navigator.hasDragged = true;
            navigator.mouseUpHandler({
                pageX: offset.left + 308,
                pageY: offset.top + 400 - 30,
                DOMType: 'mouseup'
            });
            assert.strictEqual(
        chart.series[0].points !== null,
        true,
        'Points exist.'
      );
            done();
        }, 0);
    });
});
