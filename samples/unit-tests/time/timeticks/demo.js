(function () {
    var isCET =
        new Date().toString().indexOf('CET') !== -1 ||
        new Date().toString().indexOf('CEST') !== -1 ||
        new Date().toString().indexOf('W. Europe Standard Time') !== -1; // Edge
    QUnit.test('Time ticks, ten minutes across DST', function (assert) {
        var time = new Highcharts.Time({
            timezone: 'CET'
        });

        var ticks = time.getTimeTicks(
            {
                unitRange: 60000,
                count: 10
            },
            Date.UTC(2022, 9, 29, 23),
            Date.UTC(2022, 9, 30, 2)
        );

        assert.deepEqual(
            ticks.map(function (tick) {
                return [
                    Highcharts.pad(new Date(tick).getUTCHours(), 2),
                    Highcharts.pad(new Date(tick).getUTCMinutes(), 2)
                ].join(':');
            }),
            [
                '23:00',
                '23:10',
                '23:20',
                '23:30',
                '23:40',
                '23:50',
                '00:00',
                '00:10',
                '00:20',
                '00:30',
                '00:40',
                '00:50',
                '01:00',
                '01:10',
                '01:20',
                '01:30',
                '01:40',
                '01:50',
                '02:00'
            ],
            'Ten minutes, UTC. There should be a continuous range from 23:00 to 02:00. ' +
                'Current time: ' +
                new Date().toString() +
                '. Timezone offset: ' +
                new Date().getTimezoneOffset()
        );

        if (isCET) {
            assert.deepEqual(
                ticks.map(function (tick) {
                    return [
                        Highcharts.pad(new Date(tick).getHours(), 2),
                        Highcharts.pad(new Date(tick).getMinutes(), 2)
                    ].join(':');
                }),
                [
                    '01:00',
                    '01:10',
                    '01:20',
                    '01:30',
                    '01:40',
                    '01:50',
                    '02:00',
                    '02:10',
                    '02:20',
                    '02:30',
                    '02:40',
                    '02:50',
                    '02:00',
                    '02:10',
                    '02:20',
                    '02:30',
                    '02:40',
                    '02:50',
                    '03:00'
                ],
                'Ten minutes, CET time. DST transition should be reflected.'
            );
        }
    });

    QUnit.test(
        'Time ticks, half hour across DST, western time zone',
        function (assert) {
            var time = new Highcharts.Time({
                timezone: 'America/New_York'
            });

            var ticks = time.getTimeTicks(
                {
                    unitRange: 60000,
                    count: 30
                },
                Date.UTC(2022, 10, 6, 2),
                Date.UTC(2022, 10, 6, 8)
            );

            assert.deepEqual(
                ticks.map(function (tick) {
                    return [
                        Highcharts.pad(new Date(tick).getUTCHours(), 2),
                        Highcharts.pad(new Date(tick).getUTCMinutes(), 2)
                    ].join(':');
                }),
                [
                    '02:00',
                    '02:30',
                    '03:00',
                    '03:30',
                    '04:00',
                    '04:30',
                    '05:00',
                    '05:30',
                    '06:00',
                    '06:30',
                    '07:00',
                    '07:30',
                    '08:00'
                ],
                '30 minutes, UTC. There should be a continuous range from ' +
                    '2 am UTC to 8 am UTC'
            );

            assert.deepEqual(
                ticks.map(function (tick) {
                    return time.dateFormat(null, tick);
                }),
                [
                    '2022-11-05 22:00:00',
                    '2022-11-05 22:30:00',
                    '2022-11-05 23:00:00',
                    '2022-11-05 23:30:00',
                    '2022-11-06 00:00:00',
                    '2022-11-06 00:30:00',
                    '2022-11-06 01:00:00',
                    '2022-11-06 01:30:00',
                    '2022-11-06 01:00:00',
                    '2022-11-06 01:30:00',
                    '2022-11-06 02:00:00',
                    '2022-11-06 02:30:00',
                    '2022-11-06 03:00:00'
                ],
                '30 minutes, New York time. DST transition should be ' +
                    'reflected, so the same hour appears twice.'
            );
        }
    );

    QUnit.test('Time ticks, single hour across DST', function (assert) {
        var time = new Highcharts.Time({
            timezone: 'CET'
        });

        var ticks = time.getTimeTicks(
            {
                unitRange: 36e5,
                count: 1
            },
            Date.UTC(2022, 9, 29, 20),
            Date.UTC(2022, 9, 30, 10)
        );

        assert.deepEqual(
            ticks.map(function (tick) {
                return time.dateFormat('%H:00', tick);
            }),
            [
                '22:00',
                '23:00',
                '00:00',
                '01:00',
                '02:00',
                '02:00',
                '03:00',
                '04:00',
                '05:00',
                '06:00',
                '07:00',
                '08:00',
                '09:00',
                '10:00',
                '11:00'
            ],
            'Single hour. Hours should adapt to local time zone transition, ' +
                '02:00 repeated twice'
        );
    });

    QUnit.test('Time ticks, two hours across DST', function (assert) {
        var time = new Highcharts.Time({
            timezone: 'CET'
        });

        var ticks = time.getTimeTicks(
            {
                unitRange: 36e5,
                count: 2
            },
            Date.UTC(2022, 9, 29, 20),
            Date.UTC(2022, 9, 30, 10)
        );

        assert.deepEqual(
            ticks.map(function (tick) {
                return time.dateFormat('%H:00', tick);
            }),
            [
                '22:00',
                '00:00',
                '02:00',
                '04:00',
                '06:00',
                '08:00',
                '10:00',
                '12:00'
            ],
            'Hours should adapt to local time zone transition.'
        );
    });

    QUnit.test('Time ticks, 12h across DST', function (assert) {
        var time = new Highcharts.Time({
            timezone: 'CET'
        });

        var ticks = time.getTimeTicks(
            {
                unitRange: 36e5,
                count: 12
            },
            Date.UTC(2022, 9, 26, 20),
            Date.UTC(2022, 10, 2, 10)
        );

        assert.deepEqual(
            ticks.map(function (tick) {
                return time.dateFormat('%H:00', tick);
            }),
            [
                '12:00',
                '00:00',
                '12:00',
                '00:00',
                '12:00',
                '00:00',
                '12:00',
                '00:00',
                '12:00',
                '00:00',
                '12:00',
                '00:00',
                '12:00',
                '00:00',
                '12:00'
            ],
            'Hours should adapt to local time zone transition.'
        );
    });

    QUnit[isCET ? 'test' : 'skip'](
        'Time ticks local, 12h across DST',
        function (assert) {
            var time = new Highcharts.Time({
                useUTC: false
            });

            var ticks = time.getTimeTicks(
                {
                    unitRange: 36e5,
                    count: 12
                },
                Date.UTC(2022, 9, 26, 20),
                Date.UTC(2022, 10, 2, 10)
            );

            assert.deepEqual(
                ticks.map(function (tick) {
                    return [
                        Highcharts.pad(new Date(tick).getHours(), 2),
                        Highcharts.pad(new Date(tick).getMinutes(), 2)
                    ].join(':');
                }),
                [
                    '12:00',
                    '00:00',
                    '12:00',
                    '00:00',
                    '12:00',
                    '00:00',
                    '12:00',
                    '00:00',
                    '12:00',
                    '00:00',
                    '12:00',
                    '00:00',
                    '12:00',
                    '00:00',
                    '12:00'
                ],
                'Hours should adapt to local time zone transition.'
            );
        }
    );

    QUnit.test('Time ticks, full days across DST', function (assert) {
        var time = new Highcharts.Time({
            timezone: 'CET'
        });

        var ticks = time.getTimeTicks(
            {
                unitRange: 24 * 36e5
            },
            Date.UTC(2022, 9, 26, 20),
            Date.UTC(2022, 10, 2, 10)
        );

        assert.deepEqual(
            ticks.map(function (tick) {
                return time.dateFormat('%H:00', tick);
            }),
            [
                '00:00',
                '00:00',
                '00:00',
                '00:00',
                '00:00',
                '00:00',
                '00:00',
                '00:00',
                '00:00'
            ],
            'All ticks should land on timezone midnight'
        );
    });

    QUnit[isCET ? 'test' : 'skip']('Time ticks, months', function (assert) {
        var time = new Highcharts.Time({
            timezone: 'CET'
        });

        var ticks = time.getTimeTicks(
            {
                unitRange: Highcharts.timeUnits.month
            },
            Date.UTC(2022, 0, 1, 0),
            Date.UTC(2022, 11, 31, 23)
        );

        assert.deepEqual(
            ticks.map(function (tick) {
                return [
                    Highcharts.pad(new Date(tick).getHours(), 2),
                    Highcharts.pad(new Date(tick).getMinutes(), 2)
                ].join(':');
            }),
            [
                '00:00',
                '00:00',
                '00:00',
                '00:00',
                '00:00',
                '00:00',
                '00:00',
                '00:00',
                '00:00',
                '00:00',
                '00:00',
                '00:00',
                '00:00'
            ],
            'All ticks should land on timezone midnight'
        );

        /*
        console.table(ticks.map(tick => ({
            utc: new Date(tick).toUTCString(),
            cet: new Date(tick).toString()
        })))
        // */
    });

    QUnit.test('Time ticks, week', function (assert) {
        var time = new Highcharts.Time({
            useUTC: true
        });

        var ticks = time.getTimeTicks(
            {
                unitRange: 7 * 24 * 36e5,
                count: 1,
                unitName: 'week'
            },
            Date.UTC(2018, 8, 9, 12), // Sunday at noon
            Date.UTC(2018, 9, 9),
            1
        );

        assert.deepEqual(
            ticks.map(function (tick) {
                return time.dateFormat('%d-%m-%Y', tick);
            }),
            [
                '03-09-2018',
                '10-09-2018',
                '17-09-2018',
                '24-09-2018',
                '01-10-2018',
                '08-10-2018',
                '15-10-2018'
            ],
            'All ticks created (#7051).'
        );
    });

    QUnit.test('Time ticks, Indian time (#8768)', function (assert) {
        var time = new Highcharts.Time({
            timezone: 'America/New_York'
        });

        var ticks = time.getTimeTicks(
            {
                unitRange: 60000,
                count: 5
            },
            Date.UTC(2018, 7, 8, 9, 0),
            Date.UTC(2018, 7, 8, 9, 99)
        );

        assert.deepEqual(
            ticks.map(function (tick) {
                return [
                    Highcharts.pad(new Date(tick).getUTCHours(), 2),
                    Highcharts.pad(new Date(tick).getUTCMinutes(), 2)
                ].join(':');
            }),
            [
                '09:00',
                '09:05',
                '09:10',
                '09:15',
                '09:20',
                '09:25',
                '09:30',
                '09:35',
                '09:40',
                '09:45',
                '09:50',
                '09:55',
                '10:00',
                '10:05',
                '10:10',
                '10:15',
                '10:20',
                '10:25',
                '10:30',
                '10:35',
                '10:40'
            ],
            'Relevant test when the timezone is India. Should start at 09:00. ' +
                'Current time: ' +
                new Date().toString() +
                '. Timezone offset: ' +
                new Date().getTimezoneOffset()
        );
    });

    QUnit.test('#13961: Missing ticks for half-hour timezones', assert => {
        const utc = new Highcharts.Time();
        const india = new Highcharts.Time({
            timezoneOffset: -330
        });

        [2, 5, 10, 15].forEach(count =>
            assert.strictEqual(
                utc.getTimeTicks(
                    {
                        unitRange: 60000,
                        count
                    },
                    1595801085000,
                    1595802945000
                ).length,
                india.getTimeTicks(
                    {
                        unitRange: 60000,
                        count
                    },
                    1595801085000,
                    1595802945000
                ).length,
                'Tick count should match'
            )
        );
    });

    QUnit.test('#14746: Undefined max getTimeTicks threw', assert => {
        const time = new Highcharts.Time({
            useUTC: false
        });

        time.getTimeTicks({}, 0, undefined);

        assert.ok(true, 'It should not throw');
    });
}());
