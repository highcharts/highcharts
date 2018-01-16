/* global TestController */
QUnit.test('Selection event', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            zoomType: 'x',
            events: {
                selection: function () {
                    this.destroy();
                    return false;
                }
            }
        },
        series: [{
            type: 'area',
            name: 'USD to EUR',
            data: [1, 3, 2, 4, 3, 5, 4, 6, 5, 7]
        }]
    });

    var test = new TestController(chart);

    // Pan
    test.mousedown(200, 100, { shiftKey: true });
    test.mousemove(150, 100, { shiftKey: true });
    test.mouseup();

    assert.strictEqual(
        chart.index,
        undefined,
        'Chart should be destroyed without errors (#7611)'
    );
});