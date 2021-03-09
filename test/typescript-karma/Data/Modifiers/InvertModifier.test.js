import DataTable from '/base/js/Data/DataTable.js';
import DataTableRow from '/base/js/Data/DataTableRow.js';
import InvertModifier from '/base/js/Data/Modifiers/InvertModifier.js';

QUnit.test('InvertModifier.execute', function (assert) {

    const table = new DataTable([
            new DataTableRow({
                x: 0,
                y: 'a'
            }),
            new DataTableRow({
                x: 1,
                y: 'b'
            }),
            new DataTableRow({
                $class: 'DataTableRow',
                x: 2,
                y: 'c'
            }),
            new DataTableRow({
                x: 3,
                y: 'd'
            }),
            new DataTableRow({
                x: 4,
                y: 'e'
            })
        ]),
        modifier = new InvertModifier(),
        invertedTable = modifier.execute(table),
        invertedTable2 = modifier.execute(invertedTable),
        tableRowIds = table.getAllRowIds(),
        invertedTableColumns = invertedTable.getColumns(),
        invertedTableColumnNames = Object.keys(invertedTableColumns),
        tableColumns = table.getColumns(),
        tableColumnNames = Object.keys(tableColumns);

    let result,
        result2,
        rowId,
        columnName;

    assert.notStrictEqual(
        invertedTable,
        table,
        'The inverted table should be a new table instance.'
    );

    assert.strictEqual(
        invertedTableColumnNames.length - 1,
        table.getRowCount(),
        'The inverted and original table should have an inverted amount of columns and rows.'
    );

    assert.strictEqual(
        tableColumnNames.length - 1,
        invertedTable.getRowCount(),
        'The original and inverted table should have an inverted amount of columns and rows.'
    );

    result = true;
    invertedTable.getAllRowIds().forEach(function (id) {
        if (tableColumnNames.indexOf(id) === -1) {
            result = false;
        }
    });
    assert.ok(
        result,
        'The inverted table row ids should be the same as original table column names.'
    );

    result = true;
    tableRowIds.forEach(function (id) {
        if (invertedTableColumnNames.indexOf(id) === -1) {
            result = false;
        }
    });
    assert.ok(
        result,
        'The original table row ids should be the same as inverted table column names.'
    );

    result = true;
    result2 = true;
    for (let i = 0, iEnd = tableRowIds.length; i < iEnd; i++) {
        rowId = tableRowIds[i];

        for (let j = 0, jEnd = tableColumnNames.length; j < jEnd; j++) {
            columnName = tableColumnNames[j];

            // Check inverted table.
            if (
                columnName !== 'id' &&
                table.getRowCell(rowId, columnName) !== invertedTable.getRowCell(columnName, rowId)
            ) {
                result = false;
            }

            // Check table inverted twice.
            if (
                columnName !== 'id' &&
                table.getRowCell(rowId, columnName) !== invertedTable2.getRowCell(rowId, columnName)
            ) {
                result2 = false;
            }
        }
    }

    assert.ok(
        result,
        'The inverted table should have all cell values inverted properly.'
    );

    assert.ok(
        result2,
        'The table inverted twice should have all cell values the same as the original table.'
    );
});
