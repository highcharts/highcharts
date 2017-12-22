/**
 * Checks that the timezone option is applied and works.
 */
QUnit.test('timezone', function (assert) {
    var chart,
        oct27Point;

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

        series: [{
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
        }]
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

    // Tear down
    Highcharts.setOptions({
        time: {
            timezone: null,
            getTimezoneOffset: null
        }
    });
});

/**
 * Checks that specified getTimezoneOffset function is used if timezone option
 * is not.
 */
QUnit.test('getTimezoneOffset', function (assert) {
    var chart,
        oct27Point;

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

        series: [{
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
        }]
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
            getTimezoneOffset: null
        }
    });

});
