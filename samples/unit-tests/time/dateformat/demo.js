QUnit.test(
    'Date format with fixed CET time zone, 12h across DST',
    function (assert) {
        var time = new Highcharts.Time({
                timezone: 'CET'
            }),
            ticks = [];

        for (
            var t = Date.UTC(2022, 9, 26, 22);
            t < Date.UTC(2022, 10, 2, 10);
            t += 12 * 36e5
        ) {
            ticks.push(time.dateFormat(null, t));
        }

        assert.deepEqual(
            ticks,
            [
                '2022-10-27 00:00:00',
                '2022-10-27 12:00:00',
                '2022-10-28 00:00:00',
                '2022-10-28 12:00:00',
                '2022-10-29 00:00:00',
                '2022-10-29 12:00:00',
                '2022-10-30 00:00:00',
                '2022-10-30 11:00:00',
                '2022-10-30 23:00:00',
                '2022-10-31 11:00:00',
                '2022-10-31 23:00:00',
                '2022-11-01 11:00:00',
                '2022-11-01 23:00:00'
            ],
            'Hours should change to 11 and 23 after DST transition.'
        );
    }
);

QUnit[TestUtilities.isCET ? 'test' : 'skip'](
    'Date format with local time zone, 12h across DST',
    function (assert) {
        var time = new Highcharts.Time({
                useUTC: false
            }),
            ticks = [];

        for (
            var t = Date.UTC(2022, 9, 26, 22);
            t < Date.UTC(2022, 10, 2, 10);
            t += 12 * 36e5
        ) {
            ticks.push(time.dateFormat(null, t));
        }

        assert.deepEqual(
            ticks,
            [
                '2022-10-27 00:00:00',
                '2022-10-27 12:00:00',
                '2022-10-28 00:00:00',
                '2022-10-28 12:00:00',
                '2022-10-29 00:00:00',
                '2022-10-29 12:00:00',
                '2022-10-30 00:00:00',
                '2022-10-30 11:00:00',
                '2022-10-30 23:00:00',
                '2022-10-31 11:00:00',
                '2022-10-31 23:00:00',
                '2022-11-01 11:00:00',
                '2022-11-01 23:00:00'
            ],
            'Hours should change to 11 and 23 after DST transition.'
        );
    }
);

QUnit.test('Date format with UTC, 12h across DST', function (assert) {
    var time = new Highcharts.Time(),
        ticks = [];

    for (
        var t = Date.UTC(2022, 9, 26, 24);
        t < Date.UTC(2022, 10, 2, 24);
        t += 12 * 36e5
    ) {
        ticks.push(time.dateFormat(null, t));
    }

    assert.deepEqual(
        ticks,
        [
            '2022-10-27 00:00:00',
            '2022-10-27 12:00:00',
            '2022-10-28 00:00:00',
            '2022-10-28 12:00:00',
            '2022-10-29 00:00:00',
            '2022-10-29 12:00:00',
            '2022-10-30 00:00:00',
            '2022-10-30 12:00:00',
            '2022-10-31 00:00:00',
            '2022-10-31 12:00:00',
            '2022-11-01 00:00:00',
            '2022-11-01 12:00:00',
            '2022-11-02 00:00:00',
            '2022-11-02 12:00:00'
        ],
        'Hours should ignore time zones.'
    );
});

QUnit.test(
    'Date format with UTC and fixed timezoneOffset, 12h across DST',
    function (assert) {
        var time = new Highcharts.Time({
                timezoneOffset: -3 * 60
            }),
            ticks = [];

        for (
            var t = Date.UTC(2022, 9, 26, 24);
            t < Date.UTC(2022, 10, 2, 24);
            t += 12 * 36e5
        ) {
            ticks.push(time.dateFormat(null, t));
        }

        assert.deepEqual(
            ticks,
            [
                '2022-10-27 03:00:00',
                '2022-10-27 15:00:00',
                '2022-10-28 03:00:00',
                '2022-10-28 15:00:00',
                '2022-10-29 03:00:00',
                '2022-10-29 15:00:00',
                '2022-10-30 03:00:00',
                '2022-10-30 15:00:00',
                '2022-10-31 03:00:00',
                '2022-10-31 15:00:00',
                '2022-11-01 03:00:00',
                '2022-11-01 15:00:00',
                '2022-11-02 03:00:00',
                '2022-11-02 15:00:00'
            ],
            'Hours should ignore time zones.'
        );
    }
);

QUnit[TestUtilities.isCET ? 'test' : 'skip'](
    'Week dateTime in local timezone, #16550.',
    function (assert) {
        const t = new Highcharts.Time({ useUTC: false });

        assert.strictEqual(
            t.dateFormat('%W', new Date('2015-04-12T01:00:00').getTime()),
            '14',
            'Week dateFormat for local timezone should return 14.'
        );
    }
);

QUnit.test(
    'Week formats in general',
    function (assert) {
        // UTC
        const tUTC = new Highcharts.Time();
        const resUTC = new Array(200).fill(0).map(
            (_, i) => tUTC.dateFormat('%W', Date.UTC(2023, 11, 31, i))
        );
        assert.deepEqual([
            resUTC.filter(v => v === '52').length,
            resUTC.filter(v => v === '1').length,
            resUTC.filter(v => v === '2').length
        ], [
            24,
            7 * 24,
            8
        ], 'Week should be correct for every hour in UTC');


        // Non-UTC time zone
        const tTZ = new Highcharts.Time({ timezone: 'America/New_York' });
        const resTZ = new Array(200).fill(0).map(
            (_, i) => tTZ.dateFormat('%W', Date.UTC(2023, 11, 31, i))
        );
        assert.deepEqual([
            resTZ.filter(v => v === '52').length,
            resTZ.filter(v => v === '1').length,
            resTZ.filter(v => v === '2').length
        ], [
            29,
            7 * 24,
            3
        ], 'Week should be correct for every hour in local time zone');
    }
);

QUnit.test(
    'Time formats with object config',
    assert => {
        const time = new Highcharts.Time({
            locale: 'en-US',
            timezone: 'UTC'
        });

        const res = time.dateFormat({
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            prefix: 'Prefix ',
            suffix: ' Suffix'
        }, Date.UTC(2023, 11, 31, 23, 59, 59));

        assert.strictEqual(
            res,
            'Prefix December 31, 2023 at 11:59:59 PM Suffix',
            'Date should be formatted correctly.'
        );
    }
);

QUnit.test(
    'Time formats with locale-aware string config',
    assert => {
        const time = new Highcharts.Time({
                // The Spanish locale resolves consistently between Chrome,
                // Firefox and Safari
                locale: 'es',
                timezone: 'UTC'
            }),
            timestamp = Date.UTC(2024, 7, 5, 8, 8, 8, 888);

        // To test for:
        // Weekday: A, a, w
        // Date: d, e
        // Month: b, B, m, o
        // Year: y, Y,
        // Hour: H, k, I, l
        // Minute: M
        // AM/PM: p, P
        // Second: S
        // Millisecond: L

        assert.strictEqual(
            time.dateFormat('%[AeBYHM]', timestamp),
            'lunes, 5 de agosto de 2024, 08:08',
            'Locale-aware date %[AeBYHM] should be formatted correctly'
        );

        assert.strictEqual(
            time.dateFormat('%[adbykM]', timestamp),
            'lun, 05 ago 24, 8:08',
            'Locale-aware date %[adbykM] should be formatted correctly'
        );

        assert.strictEqual(
            time.dateFormat('%[mY]', timestamp),
            '8/2024',
            'Locale-aware date %[mY] should be formatted correctly'
        );

        assert.strictEqual(
            time.dateFormat('%[HMSL]', timestamp),
            '08:08:08,888',
            'Locale-aware date %[HMSL] should be formatted correctly'
        );
    }
);
