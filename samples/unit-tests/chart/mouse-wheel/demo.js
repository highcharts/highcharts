QUnit.test('Mouse wheel zoom on chart', function (assert) {

    const clock = TestUtilities.lolexInstall();

    const chart = Highcharts.stockChart('container', {
        chart: {
            zooming: {
                mouseWheel: {
                    type: 'x',
                    showResetButton: true
                }
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
    assert.notEqual(
        typeof chart.resetZoomButton,
        'undefined',
        'Reset zoom button should display.'
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

QUnit.test('Mouse wheel drop timers are isolated per chart', function (assert) {
    const clock = TestUtilities.lolexInstall(),
        firstContainer = document.createElement('div'),
        secondContainer = document.createElement('div'),
        getOptions = () => ({
            chart: {
                zooming: {
                    mouseWheel: {
                        type: 'x'
                    }
                }
            },
            navigator: {
                enabled: false
            },
            series: [{
                data: [1, 2, 3, 4, 5]
            }]
        });

    document.body.append(firstContainer, secondContainer);

    const firstChart = Highcharts.stockChart(firstContainer, getOptions()),
        secondChart = Highcharts.stockChart(secondContainer, getOptions()),
        firstController = new TestController(firstChart),
        secondController = new TestController(secondChart);

    let firstDrops = 0,
        secondDrops = 0;

    firstChart.pointer.drop = () => ++firstDrops;
    secondChart.pointer.drop = () => ++secondDrops;

    firstController.mouseWheel(200, 100, {
        deltaY: -1000,
        target: firstChart.container
    });
    secondController.mouseWheel(200, 100, {
        deltaY: -1000,
        target: secondChart.container
    });
    clock.tick(401);

    assert.strictEqual(firstDrops, 1, 'The first chart should run drop');
    assert.strictEqual(secondDrops, 1, 'The second chart should run drop');

    firstChart.destroy();
    secondChart.destroy();
    firstContainer.remove();
    secondContainer.remove();
    TestUtilities.lolexRunAndUninstall(clock);
});
