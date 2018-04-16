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
                "2022-10-27 00:00:00",
                "2022-10-27 12:00:00",
                "2022-10-28 00:00:00",
                "2022-10-28 12:00:00",
                "2022-10-29 00:00:00",
                "2022-10-29 12:00:00",
                "2022-10-30 00:00:00",
                "2022-10-30 11:00:00",
                "2022-10-30 23:00:00",
                "2022-10-31 11:00:00",
                "2022-10-31 23:00:00",
                "2022-11-01 11:00:00",
                "2022-11-01 23:00:00"
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
                "2022-10-27 00:00:00",
                "2022-10-27 12:00:00",
                "2022-10-28 00:00:00",
                "2022-10-28 12:00:00",
                "2022-10-29 00:00:00",
                "2022-10-29 12:00:00",
                "2022-10-30 00:00:00",
                "2022-10-30 11:00:00",
                "2022-10-30 23:00:00",
                "2022-10-31 11:00:00",
                "2022-10-31 23:00:00",
                "2022-11-01 11:00:00",
                "2022-11-01 23:00:00"
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
            "2022-10-27 00:00:00",
            "2022-10-27 12:00:00",
            "2022-10-28 00:00:00",
            "2022-10-28 12:00:00",
            "2022-10-29 00:00:00",
            "2022-10-29 12:00:00",
            "2022-10-30 00:00:00",
            "2022-10-30 12:00:00",
            "2022-10-31 00:00:00",
            "2022-10-31 12:00:00",
            "2022-11-01 00:00:00",
            "2022-11-01 12:00:00",
            "2022-11-02 00:00:00",
            "2022-11-02 12:00:00"
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
                "2022-10-27 03:00:00",
                "2022-10-27 15:00:00",
                "2022-10-28 03:00:00",
                "2022-10-28 15:00:00",
                "2022-10-29 03:00:00",
                "2022-10-29 15:00:00",
                "2022-10-30 03:00:00",
                "2022-10-30 15:00:00",
                "2022-10-31 03:00:00",
                "2022-10-31 15:00:00",
                "2022-11-01 03:00:00",
                "2022-11-01 15:00:00",
                "2022-11-02 03:00:00",
                "2022-11-02 15:00:00"
            ],
            'Hours should ignore time zones.'
        );
    }
);
