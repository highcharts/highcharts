QUnit.test('Flag on first point (#3119)', function (assert) {
    $('#container').highcharts('StockChart', {
        series: [
            {
                data: [1, 2],
                id: 'first'
            },
            {
                type: 'flags',
                data: [
                    {
                        x: 0,
                        title: 'A',
                        text: 'something'
                    },
                    {
                        x: 1,
                        title: 'B',
                        text: 'something'
                    }
                ],
                onSeries: 'first',
                shape: 'squarepin'
            }
        ]
    });

    var chart = $('#container').highcharts(),
        points = chart.series[1].points;

    assert.strictEqual(typeof points[0].graphic, 'object', 'Has flag');
});

QUnit.test('Flag values and placement', function (assert) {
    var chart = Highcharts.chart('container', {
            series: [
                {
                    data: [1, 0, 1],
                    id: 's1'
                },
                {
                    type: 'flags',
                    shape: 'circlepin',
                    stackDistance: 20,
                    onSeries: 's1',
                    data: (function (n) {
                        var d = [],
                            i = n;
                        while (i--) {
                            d.push({
                                x: 1,
                                title: n - i
                            });
                        }
                        return d;
                    }(11))
                }
            ],
            yAxis: [
                {
                    min: 0
                }
            ]
        }),
        series = chart.series[1];

    assert.strictEqual(
        (function (s) {
            var ret = true,
                data = s.data,
                points = s.points,
                len = s.data.length;
            for (var i = 0; i < len; i++) {
                if (data[i].index !== points[i].index) {
                    ret = false;
                    i = len; // quit
                }
            }
            return ret;
        }(series)),
        true,
        'Order of points shoule be the same as data (#3763)'
    );

    assert.strictEqual(
        chart.series[1].points[0].y,
        0,
        'The flag point should have the same Y as the onSeries (#7440)'
    );

    chart.series[1].addPoint({
        x: 1.5
    });

    assert.strictEqual(
        chart.series[1].points[11].y,
        0.5,
        'The interpolated flag should have an interpolated Y value (#7440)'
    );
});

QUnit.test('Flags in panes', function (assert) {
    var chart = Highcharts.stockChart('container', {
        yAxis: [
            {
                height: '50%'
            },
            {
                top: '50%',
                height: '50%'
            }
        ],
        series: [
            {
                data: [1, 2, 3, 4]
            },
            {
                data: [4, 3, 2, 1],
                yAxis: 1,
                id: 'lower'
            },
            {
                type: 'flags',
                onSeries: 'lower',
                data: [
                    {
                        x: 2,
                        title: 'I should be on the lower series'
                    }
                ]
            }
        ]
    });

    assert.strictEqual(
        chart.series[2].group.attr('translateY'),
        chart.series[1].group.attr('translateY'),
        'The flag series group should have the same vertical translation as its onSeries group'
    );
});

QUnit.test('Flags visibility', function (assert) {
    var chart = Highcharts.stockChart('container', {
        series: [
            {
                data: [1, 2, 3],
                id: 's1'
            },
            {
                onSeries: 's1',
                type: 'flags',
                data: [
                    {
                        x: 0,
                        title: 'This label should be visible'
                    }
                ]
            }
        ]
    });

    assert.strictEqual(
        chart.series[1].points[0].graphic.anchorX,
        0,
        'Flag with box position value equal to 0 is visible.'
    );
});

// The flag series should not be invertible (#14063).
QUnit.test('Scrolling inverted chart with a flag series.', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            inverted: true
        },

        xAxis: {
            scrollbar: {
                enabled: true
            },
            min: 2,
            max: 3
        },

        series: [{
            data: [1, 2, 3, 4, 5]
        }, {
            type: 'flags',
            data: [{
                x: 3,
                text: '3',
                title: '3'
            }]
        }]
    });

    chart.xAxis[0].setExtremes(3, 4);

    assert.equal(
        [...chart.container.querySelectorAll('.highcharts-flags-series')]
            .some(group =>  group.getAttribute('transform').includes('NaN')),
        false,
        'The flag series\' DOM elements should not contain NaN attributes values (#14063).'
    );
});

QUnit.test('Distributing the flag, #16041.)', function (assert) {
    const chart = Highcharts.chart('container', {
        chart: {
            width: 800
        },
        series: [{
            data: [
                [1, 10],
                [6, 60]
            ]
        }, {
            data: [{
                x: 5,
                title: 'Very long long text very long long text'
            }],
            type: 'flags'
        }]
    });

    assert.ok(
        chart.series[1].points[0].graphic.x > 0,
        'The flag graphic should have a positive x position.'
    );
    chart.setSize(400);
    assert.ok(
        chart.series[1].points[0].graphic.x > 0,
        `After decreasing the chart size, the flag graphic should be distributed
        and still have a positive x position.`
    );
});
