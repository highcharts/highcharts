QUnit.test(
    'Time zone is negative, crossing midnight (#5935)',
    function (assert) {
        Highcharts.setOptions({
            time: {
                timezone: 'US/Pacific'
            }
        });

        var chart = Highcharts.chart('container', {
            xAxis: {
                type: 'datetime'
            },

            series: [
                {
                    pointStart: Date.UTC(2016, 10, 6, 7),
                    pointInterval: 36e5,
                    data: [1, 4, 2, 5, 3, 6]
                }
            ]
        });

        assert.strictEqual(
            chart.xAxis[0].ticks[chart.xAxis[0].tickPositions[0]].label.element
                .textContent,
            '6 Nov',
            'Tick positions correct'
        );

        assert.deepEqual(
            Object.keys(chart.xAxis[0].ticks).map(function (pos) {
                return chart.xAxis[0].ticks[pos].label.element.textContent;
            }),
            ['6 Nov', '01:00', '01:00', '02:00', '03:00', '04:00'],
            'The same label should be repeated across DST change (#6797)'
        );

        // Reset
        Highcharts.setOptions({
            time: {
                timezone: 'UTC'
            }
        });
    }
);

QUnit.test('Time zone with small interval (#4951)', function (assert) {
    Highcharts.setOptions({
        time: {
            timezone: 'America/New_York'
        }
    });

    var chart = Highcharts.chart('container', {
        xAxis: {
            type: 'datetime',
            crosshair: true
        },
        series: [
            {
                data: (function () {
                    var arr = [],
                        i;
                    for (i = 0; i < 160; i = i + 1) {
                        arr.push(i);
                    }
                    return arr;
                }()),
                dataLabels: {
                    enabled: true,
                    format: '{x:%H:%M}'
                },
                pointStart: Date.UTC(2016, 10, 6),
                pointInterval: 18e5, // 30 minutes
                tooltip: {
                    pointFormat: '{point.x:%H:%M} local time'
                }
            }
        ]
    });

    assert.strictEqual(
        Object.keys(chart.xAxis[0].tickPositions.info.higherRanks).length,
        4,
        '4 higher ranks found'
    );

    // Reset
    Highcharts.setOptions({
        time: {
            timezone: 'UTC'
        }
    });
});

QUnit.test('Time zone with bigger interval (#4951)', function (assert) {
    Highcharts.setOptions({
        time: {
            timezone: 'Europe/Lisbon'
        }
    });
    var chart = Highcharts.chart('container', {
        xAxis: {
            type: 'datetime',
            labels: {
                format: '{value:%Y-%m-%d %H:%M}',
                rotation: 90
            }
        },
        tooltip: {
            shared: true,
            crosshairs: {
                width: 1,
                color: 'rgb(40, 52, 61)',
                dashStyle: 'ShortDash'
            }
        },
        series: [
            {
                data: [
                    {
                        x: 1445641200000,
                        y: 1
                    },
                    {
                        x: 1445727600000,
                        y: 1
                    },
                    {
                        x: 1445817600000,
                        y: 1
                    },
                    {
                        x: 1445904000000,
                        y: 1
                    }
                ],
                dataLabels: {
                    enabled: true,
                    format: '{x:%H:%M}'
                },
                name: 'UTC Midnight',
                tooltip: {
                    pointFormat: 'UTC midnight = {point.x:%H:%M} local time'
                }
            }
        ]
    });

    chart.xAxis[0].tickPositions.forEach(function (pos) {
        var tick = chart.xAxis[0].ticks[pos];
        assert.strictEqual(
            tick.label.element.textContent.substr(11, 5),
            '00:00',
            'Tick is on timezone midnight'
        );
    });

    // Reset
    Highcharts.setOptions({
        time: {
            timezone: 'UTC'
        }
    });
});

QUnit.test(
    'Higher rank applied to first and last labels (#1649, #1760)',
    function (assert) {
        Highcharts.setOptions({
            time: {
                getTimezoneOffset: undefined
            }
        });
        var chart = Highcharts.chart('container', {
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: {
                    day: '%e of %b'
                },
                min: 1262304000000
            },

            series: [
                {
                    data: [
                        29.9,
                        71.5,
                        106.4,
                        129.2,
                        144.0,
                        176.0,
                        135.6,
                        148.5,
                        216.4,
                        194.1,
                        95.6,
                        54.4,
                        34
                    ],
                    pointStart: Date.UTC(2010, 0, 1),
                    pointInterval: 6 * 3600 * 1000
                }
            ]
        });

        assert.strictEqual(
            Object.keys(chart.xAxis[0].tickPositions.info.higherRanks).length,
            4,
            '4 higher ranks found'
        );
    }
);

QUnit.test(
    'Higher rank not showing with negative time offset (#3359)',
    function (assert) {
        Highcharts.setOptions({
            time: {
                timezoneOffset: -60
            }
        });

        var data = [];

        for (var i = 0, ie = 48; i < ie; ++i) {
            data[i] = Math.random();
        }

        var chart = Highcharts.chart('container', {
            xAxis: {
                type: 'datetime'
            },

            series: [
                {
                    data,
                    pointStart: Date.UTC(2013, 0, 1, 12),
                    pointInterval: 36e5 // one hour
                }
            ]
        });

        assert.strictEqual(
            Object.keys(chart.xAxis[0].tickPositions.info.higherRanks).length,
            2,
            '2 higher ranks found'
        );

        // Reset
        Highcharts.setOptions({
            time: {
                timezoneOffset: 0
            }
        });
    }
);


QUnit.test('Higher ranks general tests, (#22231)', function (assert) {
    const chart = Highcharts.stockChart('container', {
        series: [{
            type: 'line',
            data: Array.from({ length: 50 }, () => Math.random() * 10),
            pointInterval: 2600000000,
            pointStart: Date.UTC(2000, 0, 1)
        }],
        xAxis: {
            dateTimeLabelFormats: {
                month: {
                    higherRank: '%Y',
                    main: '%b'
                }
            }
        }
    });

    let ticks = chart.xAxis[0].ticks,
        tickPositions = chart.xAxis[0].tickPositions;

    // First and second ticks on full range
    assert.strictEqual(
        ticks[tickPositions[0]].label.textStr,
        '2000',
        'First tick on full range chart should have a higher rank label.'
    );
    assert.strictEqual(
        tickPositions.info.higherRanks[tickPositions[0]],
        'year',
        'First tick on full range chart should have a higher rank set as year.'
    );
    assert.strictEqual(
        ticks[tickPositions[1]].label.textStr,
        'Jul',
        'Second tick on full range chart should have a main rank applied.'
    );

    // Navigator ticks
    const navigatorTickLabels =
        Object.values(chart.xAxis[1].ticks).map(
            tick => tick.label.textStr
        );

    assert.deepEqual(
        navigatorTickLabels,
        ['2000', '2001', '2002', '2003', '2004'],
        'Navigator ticks should not be affected by higher ranks.'
    );

    // Ticks after scrolling
    chart.xAxis[0].setExtremes(989297903448, 1037622041379);

    ticks = chart.xAxis[0].ticks;
    tickPositions = chart.xAxis[0].tickPositions;

    assert.strictEqual(
        ticks[tickPositions[0]].label.textStr,
        '2001',
        'First tick after scrolling should have a higher rank label.'
    );
});