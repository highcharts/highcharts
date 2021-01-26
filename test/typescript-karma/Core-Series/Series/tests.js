import Series from '/base/js/Core/Series.js';

QUnit.test('DataParser.getTableFromSeriesOptions', function (assert) {

    const series1Options = {
            type: 'line',
            data: [
                1,
                [1, 2],
                {
                    x: 2,
                    y: 3
                }
            ]
        },
        table1 = Series.getTableFromSeriesOptions(series1Options),
        table1Columns = table1.getColumns(),
        series2Options = Series.getSeriesOptionsFromTable(table1);

    assert.strictEqual(
        Object.keys(table1Columns).length,
        3,
        'DataTable should contain three columns.'
    );
    assert.deepEqual(
        {
            x: table1Columns['x'],
            y: table1Columns['y']
        },
        {
            x: [0, 1, 2],
            y: [1, 2, 3]
        },
        'DataTable should contain x and y values in order.'
    );
    assert.deepEqual(
        series2Options.data.map(point => ({ x: point.x, y: point.y })),
        [{
            x: 0,
            y: 1
        }, {
            x: 1,
            y: 2
        }, {
            x: 2,
            y: 3
        }],
        'SeriesOptions should contain three points.'
    );

});
