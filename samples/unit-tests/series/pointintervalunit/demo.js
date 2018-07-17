

QUnit.test('Point interval unit beyond turboThreshold (#5568)', function (assert) {


    var data = [];
    for (var i = 0; i < 6; i++) {
        data.push(i);
    }

    var chart = Highcharts.chart('container', {
        xAxis: {
            type: 'datetime'
        },

        plotOptions: {
            series: {
                pointStart: Date.UTC(2016, 0, 1),
                pointIntervalUnit: 'day',
                turboThreshold: 5
            }
        },
        series: [{
            data: data
        }]
    });

    assert.strictEqual(
        chart.series[0].points[0].x,
        Date.UTC(2016, 0, 1),
        'Date start'
    );

    assert.strictEqual(
        chart.series[0].points[5].x,
        Date.UTC(2016, 0, 6),
        'Date end'
    );
});

QUnit.test('Point interval unit across DST (#4958)', function (assert) {

    Highcharts.setOptions({
        global: {
            timezone: 'Europe/Lisbon'
        }
    });

    var chart = Highcharts.chart('container', {
        chart: {
            width: 600
        },
        xAxis: {
            type: 'datetime',
            gridLineWidth: 1
        },
        series: [{
            data: [1, 1, 1, 1],
            dataLabels: {
                enabled: true,
                format: '{x:%H:%M}'
            },
            name: 'UTC Midnight',
            tooltip: {
                pointFormat: 'UTC midnight = {point.x:%H:%M} local time'
            },
            pointInterval: 1,
            pointStart: Date.UTC(2022, 9, 28, 23),
            pointIntervalUnit: 'day'
        }]
    });

    // Autumn crossover
    assert.deepEqual(
        chart.series[0].points.map(function (point) {
            return Highcharts.dateFormat('%Y-%m-%d %H:%M', point.x);
        }),
        [
            '2022-10-29 00:00',
            '2022-10-30 00:00',
            '2022-10-31 00:00',
            '2022-11-01 00:00'
        ],
        'Points should land on local timezone midnight'
    );

    // Spring crossover
    chart.series[0].update({
        pointStart: Date.UTC(2022, 2, 26, 0)
    });
    assert.deepEqual(
        chart.series[0].points.map(function (point) {
            return Highcharts.dateFormat('%Y-%m-%d %H:%M', point.x);
        }),
        [
            '2022-03-26 00:00',
            '2022-03-27 00:00',
            '2022-03-28 00:00',
            '2022-03-29 00:00'
        ],
        'Points should land on local timezone midnight'
    );

    // Reset
    Highcharts.setOptions({
        global: {
            timezone: null
        }
    });
});