QUnit.test(
    '#6334 - double afterSetExtremes for scrollbar and navigator',
    function (assert) {
        var done = assert.async(),
            counter = 0,
            options = {
                xAxis: {
                    minRange: 0.01,
                    min: 3,
                    max: 3.05,
                    events: {
                        afterSetExtremes() {
                            counter++;
                        }
                    }
                },
                rangeSelector: {
                    enabled: false
                },
                navigator: {
                    adaptToUpdatedData: false
                },
                scrollbar: {
                    liveRedraw: false
                },
                series: [
                    {
                        data: [4, 20, 100, 5, 2, 33, 12, 23]
                    }
                ]
            },
            chart = Highcharts.stockChart('container', options),
            controller = new TestController(chart),
            scrollbar = chart.navigator.scrollbar,
            group = scrollbar.group,
            thumbGroup = scrollbar.scrollbarGroup,
            thumb = scrollbar.scrollbar,
            thumbBox = thumb.getBBox(),
            x = group.translateX + thumbGroup.translateX + thumbBox.width / 2,
            y = group.translateY + thumbGroup.translateY + thumbBox.height / 2;

        controller.pan([x, y], [x + 90, y]);

        // No lolex should be needed for this. 6ms to be sure in CI.
        setTimeout(function () {
            assert.strictEqual(counter, 1, 'afterSetExtremes called just once');
            done();
        }, 6);
    }
);

QUnit.test(
    '#1716 - very small range in navigator and scrollbar events',
    function (assert) {
        var done = assert.async(),
            min = 3,
            max = 3.000002,
            options = {
                xAxis: {
                    minRange: 0.000001,
                    min,
                    max
                },
                rangeSelector: {
                    enabled: false
                },
                scrollbar: {
                    buttonsEnabled: true
                },
                series: [
                    {
                        data: [4, 20, 100, 5, 2, 33, 12, 23]
                    }
                ]
            },
            chart = Highcharts.stockChart('container', options),
            controller = new TestController(chart),
            scrollbar = chart.navigator.scrollbar,
            group = scrollbar.group,
            extremes;

        controller.click(group.translateX + 5, group.translateY + 5);

        // No lolex should be needed for this. 6ms to be sure in CI.
        setTimeout(function () {
            extremes = chart.xAxis[0].getExtremes();
            assert.strictEqual(
                min > extremes.min && max > extremes.max,
                true,
                'Scrollbar moved to the left'
            );
            done();
        }, 6);
    }
);

QUnit.test('Scrollbar.liveRedraw option', function (assert) {
    var iterator = 0,
        chart = Highcharts.stockChart('container', {
            chart: {
                events: {
                    redraw() {
                        iterator++;
                    }
                }
            },
            xAxis: {
                scrollbar: {
                    enabled: true,
                    liveRedraw: false
                },
                min: 3
            },
            navigator: {
                height: 15
            },
            series: [
                {
                    data: [1, 2, 3, 4, 5]
                }
            ]
        }),
        controller = new TestController(chart),
        scrollbar = chart.xAxis[0].scrollbar,
        group = scrollbar.group,
        scrollbarWidth = group.getBBox(true).width;

    controller.mouseDown(
        group.translateX + scrollbarWidth - 25,
        group.translateY + 5
    );
    controller.mouseMove(
        group.translateX + scrollbarWidth - 55,
        group.translateY + 5
    );
    controller.mouseUp(
        group.translateX + scrollbarWidth - 55,
        group.translateY + 5
    );

    assert.strictEqual(
        iterator,
        1,
        'Scrollbar redraws chart only once when liveRedraw is disabled (#9235).'
    );
});

QUnit.test('Scrollbar events', assert => {
    const { hasTouch, isTouchDevice } = Highcharts;
    Highcharts.hasTouch = Highcharts.isTouchDevice = true;

    const chart = Highcharts.chart('container', {
        xAxis: {
            min: 0,
            max: 12,
            scrollbar: {
                enabled: true
            }
        },
        series: [
            {
                type: 'column',
                data: [
                    5.5,
                    6.2,
                    5.9,
                    5.9,
                    6.2,
                    5.6,
                    5.7,
                    5.7,
                    5.7,
                    5.8,
                    5.7,
                    6.2,
                    5.6,
                    5.9,
                    6.0,
                    5.7,
                    6.0
                ]
            },
            {
                data: [
                    42,
                    67,
                    59,
                    61,
                    72,
                    42,
                    48,
                    46,
                    47,
                    50,
                    50,
                    70,
                    47,
                    58,
                    65,
                    50,
                    62
                ]
            }
        ]
    });

    const controller = new TestController(chart);
    const axis = chart.xAxis[0];
    const bar = axis.scrollbar.group;

    const min = axis.min;

    controller.slide(
        [bar.translateX + 50, bar.translateY + 5],
        [bar.translateX + 100, bar.translateY + 5]
    );

    assert.ok(axis.min > min, 'Extremes should have changed (#14193)');

    Highcharts.hasTouch = hasTouch;
    Highcharts.isTouchDevice = isTouchDevice;

    // #18922, scrollbar track did not catch click events
    controller.click(bar.translateX + 5, bar.translateY + 5);
    assert.ok(axis.min === min, 'Extremes should change on track click (#18922');

    // #17977, scrollbar should not animate if global animation is disabled
    const scrollbar = axis.scrollbar;

    chart.update({
        chart: {
            animation: false
        }
    });
    controller.click(
        bar.translateX + bar.getBBox().width - 10,
        bar.translateY + 5
    );
    assert.strictEqual(
        scrollbar.scrollbarGroup.translateX,
        scrollbar.width - scrollbar.scrollbar.attr('width'),
        `Scrollbar should not animate if the global animation is disabled
        (#17977)`
    );
});