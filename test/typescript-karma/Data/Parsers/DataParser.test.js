import DataParser from '/base/js/Data/Parsers/DataParser.js';
import OldTownTableRow from '/base/js/Data/OldTownTableRow.js';
import OldTownTable from '/base/js/Data/OldTownTable.js';

QUnit.test('DataParser.getColumnsFromTable with missing cells', function (assert) {

    const table = new OldTownTable();

    table.insertRow(new OldTownTableRow(
        {
            id: 'Row1',
            column1: 'value',
            column3: 'value'
        }
    ))
    table.insertRow(new OldTownTableRow(
        {
            id: 'Row2',
            column3: 'value'
        }
    ))
    table.insertRow(new OldTownTableRow(
        {
            id: 'Row3',
            column4: 'value'
        }
    ))
    table.insertRow(new OldTownTableRow(
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
