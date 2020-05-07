QUnit.test('Item series dynamics', assert => {
    const { series: [series] } = Highcharts.chart('container', {
        series: [{
            type: 'item',
            data: [1, 2, 3, 4]
        }]
    });

    assert.strictEqual(
        series.points.length,
        4,
        'Four initial points'
    );


    series.addPoint(5);
    assert.strictEqual(
        series.points.length,
        5,
        'One point added'
    );

    series.points[3].update(100);
    assert.strictEqual(
        series.total,
        111,
        'Total should be modified'
    );

    series.points[3].remove();
    assert.strictEqual(
        series.total,
        11,
        'Total should be modified'
    );
    assert.strictEqual(
        series.points.length,
        4,
        'Point length modified'
    );
});

QUnit.test('Full circle- points should not overlap.', function (assert) {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'item'
        },
        series: [{
            keys: ['name', 'y', 'color'],
            data: [
                ['a', 5, 'rgba(200,0,200,0.3)'],
                ['b', 5, 'rgba(0,200,0,0.3)']
            ],
            center: ['50%', '50%'],
            size: '100%',
            rows: 1,
            startAngle: -180,
            endAngle: 180
        }]
    });

    assert.notEqual(
        Math.round(chart.series[0].points[0].graphics[0].x),
        Math.round(chart.series[0].points[1].graphics[4].x),
        'Points are not overlapped.');
});
