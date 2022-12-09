QUnit.test(
    '#6930 - scrollbar had wrong extremes when data was not set.',
    function (assert) {
        var chart = Highcharts.chart('container', {
                chart: {
                    type: 'column'
                },
                xAxis: {
                    scrollbar: {
                        enabled: true
                    },
                    min: 1497132000000,
                    max: 1497218399000,
                    type: 'datetime'
                },
                series: [
                    {
                        data: []
                    }
                ]
            }),
            scrollbar = chart.xAxis[0].scrollbar;

        assert.strictEqual(
            scrollbar.from === 0,
            true,
            'Scrollbar starts from left button.'
        );
        assert.strictEqual(
            scrollbar.to === 1,
            true,
            'Scrollbar ends at right edge.'
        );
    }
);

// Highcharts Stock 4.0.1, Issue #3040
// Scrolling outside data range possible
QUnit.test('Scrolling outside range (#3040)', function (assert) {
    TestTemplate.test(
        'highcharts/line',
        {
            legend: {
                enabled: false
            },

            scrollbar: {
                enabled: true
            },

            xAxis: {
                type: 'datetime',
                ordinal: false
            },

            series: [
                {
                    data: [1, 4, 3, 4, 5, 5, 4, 34, 23, 2, 3, 3, 4, 45, 5, 6],
                    pointStart: Date.UTC(2014, 4, 5),
                    pointInterval: 24 * 36e5
                }
            ]
        },
        function (template) {
            var chart = template.chart;

            chart.update({
                xAxis: {
                    min: Date.UTC(2014, 4, 1),
                    max: Date.UTC(2014, 4, 31)
                }
            });

            chart.xAxis[0].setExtremes(
                Date.UTC(2014, 4, 1),
                Date.UTC(2014, 4, 4),
                true,
                false
            );

            assert.ok(
                chart.scroller.range > 0,
                'There should be a visible range after a lower out of range.'
            );

            chart.xAxis[0].setExtremes(
                Date.UTC(2014, 4, 20),
                Date.UTC(2014, 4, 25),
                true,
                false
            );

            assert.ok(
                chart.scroller.range > 0,
                'There should be a visible range after a higher out of range.'
            );

            chart.xAxis[0].setExtremes(
                Date.UTC(2014, 4, 1),
                Date.UTC(2014, 4, 7),
                true,
                false
            );

            assert.ok(
                chart.scroller.range > 0,
                'There should be a visible range.'
            );
        }
    );

    TestTemplate.test(
        'highstock/line',
        {
            legend: {
                enabled: false
            },

            navigator: {
                enabled: false
            },

            xAxis: {
                type: 'datetime',
                ordinal: false
            },

            series: [
                {
                    data: [1, 4, 3, 4, 5, 5, 4, 34, 23, 2, 3, 3, 4, 45, 5, 6],
                    pointStart: Date.UTC(2014, 4, 5),
                    pointInterval: 24 * 36e5
                }
            ]
        },
        function (template) {
            var chart = template.chart;

            chart.update({
                xAxis: {
                    min: Date.UTC(2014, 4, 1),
                    max: Date.UTC(2014, 4, 31)
                }
            });

            chart.xAxis[0].setExtremes(
                Date.UTC(2014, 4, 1),
                Date.UTC(2014, 4, 4),
                true,
                false
            );

            assert.ok(
                chart.scroller.range > 0,
                'There should be a visible range after a lower out of range.'
            );

            chart.xAxis[0].setExtremes(
                Date.UTC(2014, 4, 20),
                Date.UTC(2014, 4, 25),
                true,
                false
            );

            assert.ok(
                chart.scroller.range > 0,
                'There should be a visible range after a higher out of range.'
            );

            chart.xAxis[0].setExtremes(
                Date.UTC(2014, 4, 1),
                Date.UTC(2014, 4, 7),
                true,
                false
            );

            assert.ok(
                chart.scroller.range > 0,
                'There should be a visible range.'
            );
        }
    );
});

QUnit.test(
    '#10733 - scrollbar had wrong range when extremes was the same.',
    function (assert) {
        var H = Highcharts,
            chart = H.chart('container', {
                series: [
                    {
                        data: [11],
                        type: 'bar'
                    }
                ],
                xAxis: {
                    categories: ['Category 1'],
                    min: 0,
                    max: 0,
                    scrollbar: {
                        enabled: true
                    }
                }
            }),
            scrollbar = chart.xAxis[0].scrollbar;

        assert.strictEqual(
            H.isNumber(scrollbar.from) && H.isNumber(scrollbar.to),
            true,
            'Scrollbar starts from left button.'
        );
    }
);

QUnit.test(
    '#12834 - scrollbar had wrong extremes when series was hidden.',
    function (assert) {
        var chart = Highcharts.chart('container', {
                xAxis: {
                    min: 100,
                    max: 200,
                    scrollbar: {
                        enabled: true
                    }
                },
                series: [
                    {
                        visible: true,
                        data: [
                            [100, 1],
                            [200, 3]
                        ]
                    }
                ]
            }),
            scrollbar = chart.xAxis[0].scrollbar;

        assert.strictEqual(
            chart.xAxis[0].min === 100 && chart.xAxis[0].max === 200,
            true,
            'Scrollbar should have range from xAxis min and max.'
        );

        chart.series[0].setVisible(false);

        scrollbar.buttonToMinClick({
            trigger: 'scrollbar'
        });

        assert.strictEqual(
            chart.xAxis[0].min === 100 && chart.xAxis[0].max === 200,
            true,
            'Scrollbar should have the same range like visible series.'
        );
    }
);

QUnit.test(
    '#12834 - xAxis had wrong extremes after scroll .',
    function (assert) {
        var isNumber = Highcharts.isNumber,
            chart = Highcharts.chart('container', {
                xAxis: {
                    scrollbar: {
                        enabled: true
                    }
                },
                series: [
                    {
                        visible: true,
                        data: [
                            [100, 1],
                            [200, 3]
                        ]
                    }
                ]
            }),
            scrollbar = chart.xAxis[0].scrollbar;

        chart.series[0].setVisible(false);

        scrollbar.buttonToMinClick({
            trigger: 'scrollbar'
        });

        chart.series[0].setVisible(true);

        assert.ok(
            isNumber(chart.xAxis[0].min) && isNumber(chart.xAxis[0].max),
            'xAxis should have extremes after scrolling.'
        );
    }
);

QUnit.test('Toggle chart.scrollbar', assert => {
    const chart = Highcharts.chart('container', {
        series: [
            {
                data: [5, 6, 2]
            }
        ],
        scrollbar: {
            enabled: true
        }
    });

    chart.update({
        scrollbar: {
            enabled: false
        },
        series: [
            {
                data: [5, 6, 2, 4]
            }
        ]
    });

    chart.update({
        xAxis: {
            min: 0,
            max: 0
        },
        series: [
            {
                data: [5]
            }
        ]
    });

    assert.strictEqual(
        chart.xAxis[0].tickPositions.length,
        1,
        'xAxis should have just one tick (#13184).'
    );

    assert.strictEqual(
        chart.xAxis[0].tickPositions[0],
        0,
        'xAxis\'s tick should equal min and max values (#13184).'
    );
});

QUnit.test('#13473: Threshold', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        yAxis: {
            max: 200,
            scrollbar: {
                enabled: true
            }
        },
        series: [{
            data: [100, 200, 500]
        }]
    });

    const scrollbar = chart.yAxis[0].scrollbar;
    scrollbar.buttonToMinClick({
        trigger: 'scrollbar'
    });
    scrollbar.buttonToMaxClick({
        trigger: 'scrollbar'
    });

    assert.strictEqual(
        chart.yAxis[0].min,
        0,
        'It should be possible to scroll back down to the threshold after scrolling up'
    );
});
