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

QUnit.test('Errors in the console during initialization with no data should not be visible, #13379.', assert => {
    Highcharts.chart('container', {
        series: [{
            type: 'item'
        }]
    });

    assert.ok(
        true,
        'No errors in console.'
    );
});