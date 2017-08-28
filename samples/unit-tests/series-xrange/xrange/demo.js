QUnit.test('X-Range', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'xrange'
        },
        title: {
            text: 'Highcharts X-range'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: '',
            categories: ['Prototyping', 'Development', 'Testing']
        }
    });

    assert.strictEqual(
        chart.yAxis[0].max,
        undefined,
        'Axis empty'
    );

    chart.addSeries({
        name: 'Project 1',
        borderRadius: 5,
        data: [{
            x: Date.UTC(2014, 11, 1),
            x2: Date.UTC(2014, 11, 2),
            y: 0
        }, {
            x: Date.UTC(2014, 11, 2),
            x2: Date.UTC(2014, 11, 5),
            y: 1
        }, {
            x: Date.UTC(2014, 11, 8),
            x2: Date.UTC(2014, 11, 9),
            y: 2
        }, {
            x: Date.UTC(2014, 11, 9),
            x2: Date.UTC(2014, 11, 19),
            y: 1
        }, {
            x: Date.UTC(2014, 11, 10),
            x2: Date.UTC(2014, 11, 23),
            y: 2
        }]
    });

    assert.strictEqual(
        chart.yAxis[0].max,
        2,
        'Axis added'
    );

    var series = chart.series[0];
    series.addPoint({
        x: Date.UTC(2014, 11, 23),
        x2: Date.UTC(2014, 11, 30),
        y: 3
    });
    chart.yAxis[0].setCategories([
        'Prototyping',
        'Development',
        'Testing',
        'Resting'
    ]);

    assert.strictEqual(
        series.points.length,
        6,
        'Now six points'
    );

    series.points[5].update({
        partialFill: 0.5
    });

    assert.strictEqual(
        series.points[5].partialFill,
        0.5,
        'Partial fill set'
    );

    series.points[0].remove();
    assert.strictEqual(
        series.points.length,
        5,
        'Now five points'
    );

    series.remove();
    assert.strictEqual(
        chart.series.length,
        0,
        'No series left'
    );
});
