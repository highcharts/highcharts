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

QUnit.test(
    'Mouse wheel drop timers and pan remainders are isolated per chart ' +
    '(#25099)',
    function (assert) {
        const clock = TestUtilities.lolexInstall();
        const container1 = document.getElementById('container');
        const container2 = document.createElement('div');

        [container1, container2].forEach(container => {
            container.style.width = '600px';
            container.style.height = '300px';
        });
        document.body.append(container2);

        const getChart = container => Highcharts.stockChart(container, {
            chart: {
                panning: {
                    enabled: true,
                    type: 'x'
                },
                panKey: 'shift',
                zooming: {
                    mouseWheel: {
                        type: 'x'
                    }
                }
            },
            navigator: {
                enabled: false
            },
            rangeSelector: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            xAxis: {
                min: 14,
                max: 28,
                startOnTick: true,
                endOnTick: true
            },
            series: [{
                // Gaps like weekends make the axis ordinal
                data: Array.from(Array(42), (_, i) => [i, i])
                    .filter(([x]) => x % 7 < 5)
            }]
        });

        const chart1 = getChart(container1);
        const chart2 = getChart(container2);

        let drops1 = 0;
        let drops2 = 0;

        // Count scheduled drops
        chart1.pointer.drop = () => drops1++;
        chart2.pointer.drop = () => drops2++;

        try {
            const axis = chart1.xAxis[0],
                // Pixel movement per wheel notch, see MouseWheelZoom.ts
                notch = 15 * 1.1,
                pointPixelWidth = axis.translationSlope *
                    (axis.ordinal.slope || axis.closestPointRange),
                notches = Math.ceil(pointPixelWidth / notch),
                min = axis.min,
                wheel = (chart, deltaY, shiftKey) => new TestController(chart)
                    .mouseWheel(300, 150, {
                        deltaY,
                        shiftKey,
                        target: chart.container
                    });

            // Accumulate just below one point on the first chart
            for (let i = 0; i < notches - 1; i++) {
                wheel(chart1, 120, true);
            }

            assert.strictEqual(
                axis.min,
                min,
                'Sub-point wheel movement should not pan the first chart'
            );

            // Wheel pan in the opposite direction on the second chart
            wheel(chart2, -120, true);

            // One more notch on the first chart completes a whole point
            wheel(chart1, 120, true);

            assert.notStrictEqual(
                axis.min,
                min,
                'Wheel panning on another chart should not reset the ' +
                'accumulated pan remainder of the first chart'
            );

            wheel(chart1, -1000);
            wheel(chart2, -1000);

            clock.tick(400);

            assert.strictEqual(
                drops1,
                1,
                'First chart delayed drop should run (#25099)'
            );
            assert.strictEqual(
                drops2,
                1,
                'Second chart delayed drop should run (#25099)'
            );
        } finally {
            chart1.destroy();
            chart2.destroy();
            container1.style.cssText = '';
            container2.remove();
            TestUtilities.lolexUninstall(clock);
        }
    }
);
