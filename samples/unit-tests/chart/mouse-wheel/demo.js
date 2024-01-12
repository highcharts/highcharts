QUnit.test('Mouse wheel zoom on chart', function (assert) {

    const clock = TestUtilities.lolexInstall();

    const chart = Highcharts.chart('container', {
        chart: {
            zooming: {
                type: 'x'
            }
        },
        series: [{
            type: 'column',
            data: Array.from(Array(30)).map(() => Math.random() * 10)
        }]
    });

    const { min, max } = chart.xAxis[0];

    const controller = new TestController(chart);


    // Test zooming with columns
    controller.mouseWheel(200, 100, -1000, true);
    assert.close(
        chart.series[0].xAxis.min,
        3.7,
        1,
        'Should zoom to retract xAxis to this on column chart (#19976)'
    );
    assert.strictEqual(
        typeof chart.resetZoomButton,
        'undefined',
        'Reset zoom button should not display'
    );

    controller.mouseWheel(200, 100, 1001);

    assert.strictEqual(
        chart.xAxis[0].min,
        min,
        'Min should be back to start after wheeling out'
    );
    assert.strictEqual(
        chart.xAxis[0].max,
        max,
        'Max should be back to start after wheeling out'
    );
    assert.strictEqual(
        typeof chart.resetZoomButton,
        'undefined',
        'Reset zoom button should be removed'
    );

    TestUtilities.lolexRunAndUninstall(clock);
});
