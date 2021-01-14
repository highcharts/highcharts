QUnit.test('Item series negative values', assert => {
    const {
        series: [series]
    } = Highcharts.chart('container', {
        series: [
            {
                type: 'item',
                data: [1, -1, 0, 3]
            }
        ]
    });

    var item = series;

    assert.ok(item, 'Item series initialised');

    assert.strictEqual(series.data[0].y, 1, 'The value of y should be 1');

    assert.strictEqual(series.data[1].y, -1, 'The value of y should be -1.');

    assert.strictEqual(series.data[2].y, 0, 'The value of y should be 0');

    assert.strictEqual(series.data[3].y, 3, 'The value of y should be 3');

    var point0 = series.points[0].graphic.element.childNodes.length;
    var point1 = series.points[1].graphic.element.childNodes.length;
    var point2 = series.points[2].graphic.element.childNodes.length;
    var point3 = series.points[3].graphic.element.childNodes.length;

    assert.ok(
        point0 > 0,
        'The point should be displayed in the chart because it has child nodes.'
    );

    assert.ok(
        point1 <= 0,
        'The point should not be displayed in the chart because there are no child nodes.'
    );

    assert.ok(
        point2 <= 0,
        'The point should be displayed in the chart because there are no child nodes.'
    );

    assert.ok(
        point3 > 0,
        'The point should be displayed in the chart because it has child nodes.'
    );
});
