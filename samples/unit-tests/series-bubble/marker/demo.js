QUnit.test('Global marker is null (#6321)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'bubble'
        },

        plotOptions: {
            series: {
                animation: false,
                marker: {
                    enabled: null
                }
            }
        },

        series: [
            {
                data: [
                    { x: 3, y: 1, z: 1, name: 'BE', country: 'Belgium' },
                    { x: 3, y: 5, z: 1, name: 'FI', country: 'Finland' }
                ]
            },
            {
                data: [
                    { x: 1, y: 1, z: 1, name: 'BE', country: 'Belgium' },
                    { x: 4, y: 5, z: 1, name: 'FI', country: 'Finland' }
                ]
            }
        ]
    });

    assert.strictEqual(
        typeof chart.series[0].points[0].graphic,
        'object',
        'Has marker'
    );
});

QUnit.test('Clicking marker (#6705)', function (assert) {
    var clicked;

    var chart = Highcharts.chart('container', {
        series: [
            {
                animation: false,
                cursor: 'pointer',
                type: 'bubble',
                point: {
                    events: {
                        click: function () {
                            // console.log('click');
                            clicked = true;
                        }
                    }
                },
                states: {
                    hover: {
                        halo: {
                            size: 10
                        }
                    }
                },
                data: [[1, 2, 3]]
            }
        ]
    });

    var controller = new TestController(chart);

    controller.mouseOver(
        chart.plotLeft + chart.series[0].points[0].plotX,
        chart.plotTop + chart.series[0].points[0].plotY
    );

    controller.click(
        chart.plotLeft + chart.series[0].points[0].plotX,
        chart.plotTop + chart.series[0].points[0].plotY
    );

    assert.strictEqual(clicked, true, 'Click event fired');
});

QUnit.test('Bubble data points without z-param.(#8608)', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'bubble'
        },
        series: [
            {
                data: [
                    {
                        x: 95,
                        y: 95
                    },
                    {
                        x: 86.5,
                        y: 102.9
                    }
                ]
            }
        ]
    });

    assert.strictEqual(
        typeof chart.series[0].points[0].graphic,
        'object',
        'Has marker'
    );
});

QUnit.test('Bubble animation and async redraws (#13494)', assert => {
    const clock = TestUtilities.lolexInstall();

    try {
        const chart = Highcharts.chart('container', {
            chart: {
                type: 'bubble'
            },
            plotOptions: {
                series: {
                    animation: {
                        duration: 100
                    }
                }
            }
        });

        chart.addSeries({
            data: [
                [9, 81, 10],
                [3, 52, 9],
                [31, 18, 47],
                [79, 91, 13],
                [93, 23, -27],
                [44, 83, -28]
            ]
        });

        assert.strictEqual(
            chart.series[0].points[0].graphic.attr('width'),
            1,
            'Points should be in animation start position'
        );
        setTimeout(() => {
            chart.addSeries({
                data: [
                    [13, 30, 10],
                    [23, 20, -10],
                    [23, 40, 10]
                ]
            });
            assert.notEqual(
                chart.series[0].points[0].graphic.attr('width'),
                1,
                'First series points should continue animating'
            );
            assert.strictEqual(
                chart.series[1].points[0].graphic.attr('width'),
                1,
                'Second series points should be in animation start position'
            );
        }, 50);

        setTimeout(() => {
            assert.strictEqual(
                chart.series[0].points[0].graphic.attr('width'),
                chart.series[1].points[0].graphic.attr('width'),
                'Equal weight points for both series should now be the same size'
            );
        }, 200);

        TestUtilities.lolexRunAndUninstall(clock);
    } finally {
        TestUtilities.lolexUninstall(clock);
    }
});

QUnit.test('Bubble with custom symbol markers, #17281.', function (assert) {
    const chart = Highcharts.chart('container', {
        series: [{
            type: 'bubble',
            data: [
                [1, 1, 1],
                [2, 2, 2],
                [3, 3, 3]
            ],
            zMin: 1.1,
            marker: {
                symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'
            }
        }]
    });

    assert.strictEqual(
        typeof chart.series[0].points[0].graphic,
        'undefined',
        `When the custom marker is set and the point is out of zThreshold, the
        symbol should not be displayed and there should be no errors.`
    );
});
