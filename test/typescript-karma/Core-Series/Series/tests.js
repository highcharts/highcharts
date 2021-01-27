import Series from '/base/js/Core/Series/Series.js';

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
        table1Columns = table1.getColumns(['x', 'y']),
        series2Options = Series.getSeriesOptionsFromTable(table1, ['x', 'y']);

    assert.strictEqual(
        Object.keys(table1Columns).length,
        2,
        'DataTable should contain two columns.'
    );
    assert.deepEqual(
        table1Columns,
        {
            x: [0, 1, 2],
            y: [1, 2, 3]
        },
        'DataTable should contain x and y values in order.'
    );
    assert.deepEqual(
        series2Options.data,
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
