/**
 * Checks that the timezone option works as intended
 */
QUnit.test('timezone', function (assert) {
    var chart,
        oct27Point;

    Highcharts.setOptions({
        global: {
            timezone: 'Europe/Oslo'
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

    assert.equal(
        typeof Date.hcGetTimezoneOffset,
        'function',
        'timezone option is applied'
    );


    assert.equal(
        Highcharts.dateFormat('%H:%M', oct27Point.x),
        '01:00',
        'From October 27, UTC midnight is 01:00 AM in Oslo'
    );
});
