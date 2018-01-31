QUnit.test('getTimezoneOffset is negative, crossing midnight (#5935)', function (assert) {

    Highcharts.setOptions({
        global: {
            /**
             * Use moment-timezone.js to return the timezone offset for individual
             * timestamps, used in the X axis labels and the tooltip header.
             */
            getTimezoneOffset: function (timestamp) {
                var zone = 'US/Pacific';
                var timezoneOffset = -moment.tz(timestamp, zone).utcOffset();
                return timezoneOffset;
            }
        }
    });

    var chart = Highcharts.chart('container', {

        xAxis: {
            type: 'datetime'
        },

        series: [{
            pointStart: Date.UTC(2016, 10, 6, 7),
            pointInterval: 36e5,
            data: [1, 4, 2, 5, 3, 6]
        }]
    });

    assert.strictEqual(
        chart.xAxis[0].ticks[chart.xAxis[0].tickPositions[0]].label.element.textContent,
        '6. Nov',
        'Tick positions correct'
    );

    assert.deepEqual(
        Object.keys(chart.xAxis[0].ticks).map(function (pos) {
            return chart.xAxis[0].ticks[pos].label.element.textContent;
        }),
        ['6. Nov', '01:00', '01:00', '02:00', '03:00', '04:00'],
        'The same label should be repeated across DST change (#6797)'
    );

    // Reset
    Highcharts.setOptions({
        global: {
            getTimezoneOffset: null
        }
    });
});


QUnit.test('getTimezoneOffset with small interval (#4951)', function (assert) {

    Highcharts.setOptions({
        global: {
            /**
             * Use moment-timezone.js to return the timezone offset for individual
             * timestamps, used in the X axis labels and the tooltip header.
             */
            getTimezoneOffset: function (timestamp) {
                var zone = 'America/New_York',
                    timezoneOffset = -moment.tz(timestamp, zone).utcOffset();

                return timezoneOffset;
            }
        }
    });

    var chart = Highcharts.chart('container', {
        xAxis: {
            type: 'datetime',
            crosshair: true
        },
        series: [{
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
        }]
    });

    assert.strictEqual(
        Object.keys(chart.xAxis[0].tickPositions.info.higherRanks).length,
        4,
        '4 higher ranks found'
    );

    // Reset
    Highcharts.setOptions({
        global: {
            getTimezoneOffset: null
        }
    });
});


QUnit.test('getTimezoneOffset with bigger interval (#4951)', function (assert) {

    Highcharts.setOptions({
        global: {
            useUTC: true,

            getTimezoneOffset: function (timestamp) {
                var zone = 'Europe/Lisbon';
                var date = moment.tz(timestamp, zone);

                return -date.utcOffset();
            }
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
        series: [{
            data: [{
                x: 1445641200000,
                y: 1
            }, {
                x: 1445727600000,
                y: 1
            }, {
                x: 1445817600000,
                y: 1
            }, {
                x: 1445904000000,
                y: 1
            }],
            dataLabels: {
                enabled: true,
                format: '{x:%H:%M}'
            },
            name: 'UTC Midnight',
            tooltip: {
                pointFormat: 'UTC midnight = {point.x:%H:%M} local time'
            }
        }]
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
        global: {
            getTimezoneOffset: null
        }
    });

});


QUnit.test(
    'Higher rank applied to first and last labels (#1649, #1760)',
    function (assert) {

        Highcharts.setOptions({
            global: {
                useUTC: true,
                getTimezoneOffset: null
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

            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5,
                    216.4, 194.1, 95.6, 54.4, 34],
                pointStart: Date.UTC(2010, 0, 1),
                pointInterval: 6 * 3600 * 1000
            }]
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
            global: {
                timezoneOffset: -60
            }
        });

        var chart = Highcharts.chart('container', {
            xAxis: {
                type: 'datetime'
            },

            series: [{
                data: Highcharts.map(new Array(48), Math.random),
                pointStart: Date.UTC(2013, 0, 1, 12),
                pointInterval: 36e5 // one hour
            }]
        });

        assert.strictEqual(
            Object.keys(chart.xAxis[0].tickPositions.info.higherRanks).length,
            2,
            '2 higher ranks found'
        );

        // Reset
        Highcharts.setOptions({
            global: {
                timezoneOffset: 0
            }
        });
    }
);
