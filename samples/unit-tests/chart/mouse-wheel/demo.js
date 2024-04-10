QUnit.test('Mouse wheel zoom on chart', function (assert) {

    const clock = TestUtilities.lolexInstall();

    const chart = Highcharts.stockChart('container', {
        chart: {
            zooming: {
                type: 'x'
            }
        },
        navigator: {
            enabled: false
        },
        series: [{
            pointInterval: 1000,
            type: 'column',
            data: Array.from(Array(30)).map(() => Math.random() * 10)
        }]
    });

    const { min, max } = chart.series[0].xAxis;
    const controller = new TestController(chart);

    controller.mouseWheel(200, 100, -1000);

    assert.close(
        chart.xAxis[0].min,
        5386,
        10,
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

    // Recreate #20430
    chart.update({
        xAxis: {
            overscroll: 10 * 1000
        },
        rangeSelector: {
            buttons: [{
                count: 1,
                type: 'minute',
                text: '1M'
            }],
            inputEnabled: false,
            selected: 0
        }
    });

    controller.mouseWheel(200, 100, -100);
    const differentMin = chart.series[0].xAxis.min;

    assert.notEqual(
        differentMin,
        min,
        'Should zoom with overscroll (#20430).'
    );

    TestUtilities.lolexRunAndUninstall(clock);
});
