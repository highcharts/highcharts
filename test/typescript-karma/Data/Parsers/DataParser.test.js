import DataParser from '/base/js/Data/Parsers/DataParser.js';
import DataTable from '/base/js/Data/DataTable.js';

QUnit.test('DataParser.getColumnsFromTable with missing cells', function (assert) {

    const table = new DataTable();

    table.setRows([{
        id: 'Row1',
        column1: 'value',
        column3: 'value'
    }, {
        id: 'Row2',
        column3: 'value'
    }, {
        id: 'Row3',
        column4: 'value'
    }, {
        id: 'Row4',
        column1: 'value',
        column3: 'value'
    }]);

    const columns = DataParser.getColumnsFromTable(table);

    assert.deepEqual(columns[0], ['Row1', 'Row2', 'Row3', 'Row4']);
    assert.deepEqual(columns[1], ['value', undefined, undefined, 'value']);
    assert.deepEqual(columns[2], ['value', 'value', undefined, 'value']);
    assert.deepEqual(columns[3], [undefined, undefined, 'value']);

});
