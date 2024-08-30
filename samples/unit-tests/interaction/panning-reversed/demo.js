QUnit.test('Panning reversed axis', function (assert) {
    var chart = Highcharts.chart('container', {
            chart: {
                zoomType: 'x',
                panning: true,
                panKey: 'shift',
                animation: false
            },
            xAxis: {
                min: 0,
                max: 12,
                reversed: true
            },
            series: [
                {
                    data: [15, 25, 34, 50, 10, 23, 48, 59, 23, 100, 30, 15, 25],
                    animation: false
                }
            ]
        }),
        firstZoom = {};

    chart.container.parentNode.style.position = 'absolute';
    chart.container.parentNode.style.top = 0;

    assert.strictEqual(chart.xAxis[0].min, 0, 'Initial min');
    assert.strictEqual(chart.xAxis[0].max, 12, 'Initial max');

    const controller = new TestController(chart);

    // Pan
    controller.pan([200, 100], [250, 100], { shiftKey: true });

    assert.strictEqual(chart.xAxis[0].min, 0, 'Has not panned min');
    assert.strictEqual(chart.xAxis[0].max, 12, 'Has not panned max');

    // Zoom
    controller.pan([200, 100], [250, 100]);

    assert.strictEqual(chart.xAxis[0].min > 0, true, 'Zoomed min');
    assert.strictEqual(chart.xAxis[0].max < 12, true, 'Zoomed max');

    firstZoom = chart.xAxis[0].getExtremes();

    // Pan
    controller.pan([200, 100], [250, 100], { shiftKey: true });

    assert.strictEqual(chart.xAxis[0].min > firstZoom.min, true, 'Has panned');
    assert.strictEqual(
        (chart.xAxis[0].max - chart.xAxis[0].min).toFixed(2),
        (firstZoom.max - firstZoom.min).toFixed(2),
        'Has preserved range'
    );

    chart.container.parentNode.style.position = 'static';
});
