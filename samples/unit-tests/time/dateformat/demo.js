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
