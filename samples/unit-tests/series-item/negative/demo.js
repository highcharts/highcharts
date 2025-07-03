QUnit.test('Item series negative values', assert => {
    const { series: [item] } = Highcharts.chart('container', {
        series: [
            {
                type: 'item',
                data: [1, -1, 0, 3]
            }
        ]
    });

    assert.ok(item, 'Item series initialised');

    assert.strictEqual(item.data[0].y, 1, 'The value of y should be 1');

    assert.strictEqual(item.data[1].y, -1, 'The value of y should be -1.');

    assert.strictEqual(item.data[2].y, 0, 'The value of y should be 0');

    assert.strictEqual(item.data[3].y, 3, 'The value of y should be 3');

    const point0 = item.points[0].graphic.element.childNodes.length,
        point1 = item.points[1].graphic,
        point2 = item.points[2].graphic.element.childNodes.length,
        point3 = item.points[3].graphic.element.childNodes.length;

    assert.ok(
        point0 > 0,
        'The point should be displayed in the chart because it has child nodes.'
    );

    assert.notOk(
        point1,
        'The point should not be displayed in the chart and have no graphic.'
    );

    assert.ok(
        point2 <= 0,
        'The point should not be displayed in the chart because there are no ' +
        'child nodes.'
    );

    assert.ok(
        point3 > 0,
        'The point should be displayed in the chart because it has child nodes.'
    );
});
