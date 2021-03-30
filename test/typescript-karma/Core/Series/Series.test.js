import Series from '/base/js/Core/Series/Series.js';

QUnit.test('DataParser.getTableFromSeriesOptions', function (assert) {

    const series1Data = [
            1,
            [1, 2],
            {
                x: 2,
                y: 3
            }
        ],
        table1 = Series.getTableFromSeriesData(series1Data),
        table1Columns = table1.getColumns(['x', 'y']),
        series2Data = Series.getSeriesDataFromTable(table1, ['x', 'y']);

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
        series2Data,
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
