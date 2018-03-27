
QUnit.test('Default datetime format from tooltip', function (assert) {
    var timeStart = new Date(Date.UTC(1995, 10, 15, 10, 45, 12)).getTime(),
        chart = Highcharts.chart('container', {
            tooltip: {
                dateTimeLabelFormats: {
                    second: '%A, %b %e, %H:%M:%S'
                }
            },
            xAxis: {
                type: 'datetime'
            },
            series: [{
                data: [
                    [timeStart, 1], [timeStart + 1000, 2], [timeStart + 2000, 3]
                ]
            }]
        }),
        point = chart.series[0].points[0];

    assert.strictEqual(
        point.graphic.element.getAttribute('aria-label'),
        '1. Wednesday, Nov 15, 10:45:12, 1.'
    );
});

QUnit.test('pointDateFormat', function (assert) {
    var timeStart = new Date(Date.UTC(1995, 10, 15, 10, 45, 12)).getTime(),
        chart = Highcharts.chart('container', {
            accessibility: {
                pointDateFormat: '%H:%M:%S'
            },
            xAxis: {
                type: 'datetime'
            },
            series: [{
                data: [
                    [timeStart, 1], [timeStart + 1000, 2], [timeStart + 2000, 3]
                ]
            }]
        }),
        point = chart.series[0].points[0];

    assert.strictEqual(
        point.graphic.element.getAttribute('aria-label'),
        '1. 10:45:12, 1.'
    );
});

QUnit.test('pointDateFormatter', function (assert) {
    var timeStart = new Date(Date.UTC(1995, 10, 15, 10, 45, 12)).getTime(),
        chart = Highcharts.chart('container', {
            accessibility: {
                pointDateFormat: '%H:%M:%S',
                pointDateFormatter: function (point) {
                    if (point.x > 1) {
                        return '%S';
                    }
                }
            },
            xAxis: {
                type: 'datetime'
            },
            series: [{
                data: [
                    [timeStart, 1], [timeStart + 1000, 2], [timeStart + 2000, 3]
                ]
            }]
        }),
        point = chart.series[0].points[0];

    assert.strictEqual(
        point.graphic.element.getAttribute('aria-label'),
        '1. 12, 1.'
    );
});

