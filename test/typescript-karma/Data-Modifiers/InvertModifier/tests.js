import DataTable from '/base/js/Data/DataTable.js';
import InvertModifier from '/base/js/Data/Modifiers/InvertModifier.js';

QUnit.test('InvertModifier.execute', function (assert) {

    const tableJSON = {
        $class: 'DataTable',
        rows: [{
            $class: 'DataTableRow',
            x: 0,
            y: 'a'
        }, {
            $class: 'DataTableRow',
            x: 1,
            y: 'b'
        }, {
            $class: 'DataTableRow',
            x: 2,
            y: 'c'
        }, {
            $class: 'DataTableRow',
            x: 3,
            y: 'd'
        }, {
            $class: 'DataTableRow',
            x: 4,
            y: 'e'
        }]
    },
    table = DataTable.fromJSON(tableJSON),
    modifier = new InvertModifier(),
    invertedTable = modifier.execute(table),
    invertedTable2 = modifier.execute(invertedTable),
    tableRowIds = table.getAllRowIds(),
    invertedTableColumns = invertedTable.toColumns(),
    invertedTableColumnNames = Object.keys(invertedTableColumns),
    tableColumns = table.toColumns(),
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

    assert.ok(
        invertedTableColumnNames.length - 1 === table.getRowCount() &&
        tableColumnNames.length - 1 === invertedTable.getRowCount(),
        'The inverted and original table should have an inverted amount of rows and columns.'
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
