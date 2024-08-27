QUnit.test(
    'Parsing dates with timezone information',
    function (assert) {
        const time = new Highcharts.Time({}),
            samples = [
                '2018-03-13T17:00:00+00:00',
                '2018-03-13T20:00:00+03:00',
                // '2018-03-13T20:00:00+03',
                '2018-03-13T17:00:00GMT',
                '2018-03-13T07:00:00GMT-1000',
                '2018-03-13T08:00:00GMT-09:00',
                '2018-03-13T17:00:00UTC',
                '2018-03-13T18:30:00UTC+0130',
                '2018-03-13T17:30:00UTC+00:30',
                '2018-03-13T17:00:00Z'
            ],
            expected = new Date(samples[0]).toISOString();


        samples
            .forEach(sample => {
                const timestamp = time.parse(sample);

                assert.strictEqual(
                    new Date(timestamp).toISOString(),
                    expected,
                    `Parsed dates should be the same. (Input: "${sample}")`
                );
            });
    }
);

QUnit.test(
    'Time.parse and DST crossover with given time zone',
    assert => {
        const time = new Highcharts.Time({ timezone: 'Europe/Oslo' });

        const dates = [
            '2023-03-25 22:00',
            '2023-03-25 23:00',
            '2023-03-26 00:00',
            '2023-03-26 01:00',
            '2023-03-26 02:00',
            '2023-03-26 03:00'
        ];

        assert.deepEqual(
            dates.map(date => new Date(time.parse(date)).toUTCString()),
            [
                'Sat, 25 Mar 2023 21:00:00 GMT',
                'Sat, 25 Mar 2023 22:00:00 GMT',
                // Crossover, 23:00 is repeated
                'Sat, 25 Mar 2023 23:00:00 GMT',
                'Sat, 25 Mar 2023 23:00:00 GMT',
                'Sun, 26 Mar 2023 00:00:00 GMT',
                'Sun, 26 Mar 2023 01:00:00 GMT'
            ],
            'Parsed dates should be correct.'
        );
    }
);

/**
 * Checks that the timezone option is applied and works.
 */
QUnit.test('timezone', function (assert) {
    var chart, oct27Point;

    Highcharts.setOptions({
        time: {
            timezone: 'Europe/Oslo',

            // This should be ignored
            getTimezoneOffset: function (timestamp) {
                var zone = 'America/New_York',
                    timezoneOffset = -moment.tz(timestamp, zone).utcOffset();
                return timezoneOffset;
            }
        }
    });

    chart = Highcharts.chart('container', {
        title: {
            text: 'timezone with local DST crossover'
        },

        subtitle: {
            text: 'From October 27, UTC midnight is 01:00 AM in Oslo'
        },

        xAxis: {
            type: 'datetime'
        },

        series: [
            {
                data: (function () {
                    var arr = [],
                        i;
                    for (i = 0; i < 5; i = i + 1) {
                        arr.push(i);
                    }
                    return arr;
                }()),
                dataLabels: {
                    enabled: true,
                    format: '{x:%H:%M}'
                },
                pointStart: Date.UTC(2014, 9, 24),
                pointInterval: 24 * 36e5,
                name: 'UTC Midnight',
                tooltip: {
                    pointFormat: 'UTC midnight = {point.x:%H:%M} local time'
                }
            }
        ]
    });

    oct27Point = chart.series[0].data[3];

    /*
    assert.equal(
        typeof Highcharts.time.getTimezoneOffset,
        'function',
        'timezone option is applied'
    );
    */

    assert.equal(
        Highcharts.dateFormat('%H:%M', oct27Point.x),
        '01:00',
        'From October 27, UTC midnight is 01:00 AM in Oslo'
    );

    // This one should fail gracefully
    chart.update({
        time: {
            timezone: 'SomeUnsupported/TimeZone'
        }
    });

    // Non full-hour timezones
    chart.update({
        time: {
            timezone: 'Asia/Calcutta'
        }
    });

    assert.equal(
        chart.time.dateFormat('%H:%M', oct27Point.x),
        '05:30',
        'Non full-hour timezone - UTC midnight should render 05:00 in Calcutta'
    );

    chart.update({
        time: {
            timezone: 'Asia/Katmandu'
        }
    });

    assert.equal(
        chart.time.dateFormat('%H:%M', oct27Point.x),
        '05:45',
        'Non full-hour timezone - UTC midnight should render 05:45 in Katmandu'
    );

    // Tear down
    Highcharts.setOptions({
        time: {
            timezone: undefined,
            getTimezoneOffset: undefined
        }
    });
});

/**
 * Checks that specified getTimezoneOffset function is used if timezone option
 * is not.
 */
QUnit.skip('getTimezoneOffset', function (assert) {
    var chart, oct27Point;

    Highcharts.setOptions({
        time: {
            getTimezoneOffset: function (timestamp) {
                var zone = 'Europe/Oslo',
                    timezoneOffset = -moment.tz(timestamp, zone).utcOffset();
                return timezoneOffset;
            }
        }
    });

    chart = Highcharts.chart('container', {
        title: {
            text: 'timezone with local DST crossover'
        },

        subtitle: {
            text: 'From October 27, UTC midnight is 01:00 AM in Oslo'
        },

        xAxis: {
            type: 'datetime'
        },

        series: [
            {
                data: (function () {
                    var arr = [],
                        i;
                    for (i = 0; i < 5; i = i + 1) {
                        arr.push(i);
                    }
                    return arr;
                }()),
                dataLabels: {
                    enabled: true,
                    format: '{x:%H:%M}'
                },
                pointStart: Date.UTC(2014, 9, 24),
                pointInterval: 24 * 36e5,
                name: 'UTC Midnight',
                tooltip: {
                    pointFormat: 'UTC midnight = {point.x:%H:%M} local time'
                }
            }
        ]
    });

    oct27Point = chart.series[0].data[3];

    /*
    assert.equal(
        typeof Highcharts.time.getTimezoneOffset,
        'function',
        'getTimezoneOffset function is applied'
    );
    */

    assert.equal(
        Highcharts.dateFormat('%H:%M', oct27Point.x),
        '01:00',
        'From October 27, UTC midnight is 01:00 AM in Oslo'
    );

    // Reset
    Highcharts.setOptions({
        time: {
            getTimezoneOffset: undefined
        }
    });
});
