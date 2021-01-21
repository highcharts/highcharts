import DataParser from '/base/js/Data/Parsers/DataParser.js';
import DataTableRow from '/base/js/Data/DataTableRow.js';
import DataTable from '/base/js/Data/DataTable.js';

QUnit.test('DataParser.getColumnsFromTable with missing cells', function (assert) {

    const table = new DataTable();

    table.insertRow(new DataTableRow(
        {
            id: 'Row1',
            column1: 'value',
            column3: 'value'
        }
    ))
    table.insertRow(new DataTableRow(
        {
            id: 'Row2',
            column3: 'value'
        }
    ))
    table.insertRow(new DataTableRow(
        {
            id: 'Row3',
            column4: 'value'
        }
    ))
    table.insertRow(new DataTableRow(
        {
            id: 'Row4',
            column1: 'value',
            column3: 'value'
        }
    ))
    const columns = DataParser.getColumnsFromTable(table);

    assert.deepEqual(columns[0], ['Row1', 'Row2', 'Row3', 'Row4']);
    assert.deepEqual(columns[1], ['value', undefined, undefined, 'value']);
    assert.deepEqual(columns[2], ['value', 'value', undefined, 'value']);
    assert.deepEqual(columns[3], [undefined, undefined, 'value', undefined]);

});

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
        table1 = DataParser.getTableFromSeriesOptions(series1Options),
        table1Columns = table1.getColumns(),
        series2Options = DataParser.getSeriesOptionsFromTable(table1);

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
