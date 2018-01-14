QUnit.test('Time ticks, ten minutesacross DST', function (assert) {
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
            return time.dateFormat('%H:%M', tick);
        }),
        [
            "01:00",
            "01:10",
            "01:20",
            "01:30",
            "01:40",
            "01:50",
            "02:00",
            "02:10",
            "02:20",
            "02:30",
            "02:40",
            "02:50",
            "02:00",
            "02:10",
            "02:20",
            "02:30",
            "02:40",
            "02:50",
            "03:00"
        ],
        'Ten minutes. DST transition should be reflected.'
    );

});


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
            "22:00",
            "23:00",
            "00:00",
            "01:00",
            "02:00",
            "02:00",
            "03:00",
            "04:00",
            "05:00",
            "06:00",
            "07:00",
            "08:00",
            "09:00",
            "10:00",
            "11:00"
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
            "22:00",
            "00:00",
            "02:00",
            "04:00",
            "06:00",
            "08:00",
            "10:00",
            "12:00"
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
            "12:00",
            "00:00",
            "12:00",
            "00:00",
            "12:00",
            "00:00",
            "12:00",
            "00:00",
            "12:00",
            "00:00",
            "12:00",
            "00:00",
            "12:00",
            "00:00",
            "12:00"
        ],
        'Hours should adapt to local time zone transition.'
    );
});

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
            "00:00",
            "00:00",
            "00:00",
            "00:00",
            "00:00",
            "00:00",
            "00:00",
            "00:00",
            "00:00"
        ],
        'All ticks should land on timezone midnight'
    );

});

QUnit.skip('Time ticks, months', function (assert) {
    var time = new Highcharts.Time({
        timezone: 'CET'
    });


    var ticks = time.getTimeTicks(
        {
            unitRange: 30 * 24 * 36e5
        },
        Date.UTC(2022, 0, 1, 0),
        Date.UTC(2022, 11, 31, 23)
    );

    assert.deepEqual(
        ticks.map(function (tick) {
            return time.dateFormat('%H:00', tick);
        }),
        [
            "00:00",
            "00:00",
            "00:00",
            "00:00",
            "00:00",
            "00:00",
            "00:00",
            "00:00",
            "00:00"
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