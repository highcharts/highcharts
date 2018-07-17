QUnit.test('Curve bell', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [{
            type: 'bellcurve',
            baseSeries: 1,
            pointsInInterval: 5,
            intervals: 4
        }, {
            data: [36, { y: 25, id: 'p1' }, 38, 46, 55, 68, 72, 55, 36, 38, 67, 45, 22, 48, 91, 46, 52, 61, 58, 55]
        }, {
            data: [1, 1, 1, 1, 2, 2, 2, 3],
            id: 's2'
        }]
    });

    var bellcurve = chart.series[0];
    var baseSeries = chart.series[1];

    assert.ok(bellcurve, 'Curve bell series initialised');
    assert.ok(bellcurve.baseSeries === baseSeries, 'Curve bell\'s base series is set correctly');

    assert.strictEqual(bellcurve.mean, 50.7, 'Mean is set correctly');
    assert.strictEqual(Number(bellcurve.standardDeviation.toFixed(2)), 16.52, 'Standard deviation is set correctly');

    assert.strictEqual(bellcurve.points.length, 41, 'Number of points is correct according to intervals and pointsInInterval options');

    bellcurve.update({
        pointsInInterval: 3
    });

    assert.deepEqual(
        bellcurve.points.length,
        25,
        'After updating bellcurve\'s pointsInInterval number of points is correct'
    );

    baseSeries.remove();
    assert.ok(Highcharts.inArray(bellcurve, chart.series) !== -1, 'Curve bell is not removed after the base series is removed');

    bellcurve.remove();
    assert.ok(Highcharts.inArray(bellcurve, chart.series) === -1, 'Curve bell is removed after bellcurve.remove()');
});

