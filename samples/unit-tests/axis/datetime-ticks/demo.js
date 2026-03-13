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

QUnit.test('Tick layout versus updates (#17393)', assert => {
    for (let date = 8; date <= 28; date++) {
        // Pad to two digits
        const day = date.toString().padStart(2, '0');
        const chart = Highcharts.chart('container', {
            chart: {
                width: 800
            },
            xAxis: {
                type: 'datetime'
            },

            series: [{
                data: [
                    ['2017-01-15', 0.9557],
                    ['2017-01-18', 0.963],
                    // Fails from 11. through 24.
                    [`2017-06-${day}`, 0.8914]
                ]
            }]
        });

        const initialTickAmount = chart.xAxis[0].tickPositions.length;

        chart.series[0].points[0].update({
            y: chart.series[0].points[0].y + 0.01
        }, true, false);

        assert.strictEqual(
            chart.xAxis[0].tickPositions.length,
            initialTickAmount,
            `Tick amount should be stable for date 2017-06-${day}`
        );
    }
});

QUnit.test('Tick layout versus setData (#17393)', assert => {
    for (let date = 8; date <= 28; date++) {
        // Pad to two digits
        const day = date.toString().padStart(2, '0');
        const chart = Highcharts.chart('container', {
            chart: {
                width: 800
            },
            xAxis: {
                type: 'datetime'
            },

            series: [{
                data: [
                    ['2017-01-15', 0.9557],
                    ['2017-01-18', 0.963],
                    // Fails from 11. through 24.
                    [`2017-06-${day}`, 0.8914]
                ]
            }]
        });

        const initialTickAmount = chart.xAxis[0].tickPositions.length;

        chart.series[0].setData([
            ['2017-01-15', 0.9657],
            ['2017-01-18', 0.973],
            [`2017-06-${day}`, 0.9014]
        ], true, false);

        assert.strictEqual(
            chart.xAxis[0].tickPositions.length,
            initialTickAmount,
            `Tick amount should be stable for date 2017-06-${day} after setData`
        );
    }
});

QUnit.test(
    'XAxis default year format localizes digits (#24266)',
    function (assert) {
        const createChart = function (locale) {
                return Highcharts.chart('container', {
                    lang: {
                        locale: locale
                    },
                    xAxis: {
                        type: 'datetime',
                        tickPositions: [
                            Date.UTC(2025, 0, 1),
                            Date.UTC(2026, 0, 1)
                        ],
                        min: Date.UTC(2025, 0, 1),
                        max: Date.UTC(2026, 0, 1)
                    },
                    series: [{
                        data: [
                            [Date.UTC(2025, 0, 1), 1],
                            [Date.UTC(2026, 0, 1), 2]
                        ]
                    }]
                });
            },
            getFirstYearLabel = function (chart) {
                const axis = chart.xAxis[0],
                    tickPosition = axis.tickPositions[0],
                    tick = axis.ticks[tickPosition];

                return (tick && tick.label && tick.label.textStr) || '';
            },
            localizedLocales = [{
                locale: 'ar-SA',
                regex: /[\u0660-\u0669]/,
                name: 'Arabic-Indic digits'
            }, {
                locale: 'bn',
                regex: /[\u09E6-\u09EF]/,
                name: 'Bengali digits'
            }],
            latinDigitLocales = ['en', 'pl'];

        localizedLocales.forEach(testCase => {
            const chart = createChart(testCase.locale),
                yearLabel = getFirstYearLabel(chart);

            assert.ok(
                yearLabel.length > 0,
                `XAxis should render year label for locale: ${testCase.locale}`
            );

            assert.ok(
                testCase.regex.test(yearLabel),
                'XAxis default year uses ' +
                `${testCase.name} for ${testCase.locale}`
            );

            chart.destroy();
        });

        latinDigitLocales.forEach(locale => {
            const chart = createChart(locale),
                yearLabel = getFirstYearLabel(chart);

            assert.strictEqual(
                yearLabel,
                '2025',
                `XAxis default year stays Latin for locale: ${locale}`
            );

            chart.destroy();
        });
    }
);
