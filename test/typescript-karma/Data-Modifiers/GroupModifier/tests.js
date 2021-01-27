import DataTable from '/base/js/Data/DataTable.js';
import DataTableRow from '/base/js/Data/DataTableRow.js';
import GroupModifier from '/base/js/Data/Modifiers/GroupModifier.js';

QUnit.test('GroupModifier.execute', function (assert) {

    const table = new DataTable([
            new DataTableRow({
                x: 0,
                y: 'a'
            }),
            new DataTableRow({
                x: 0,
                y: 'b'
            }),
            new DataTableRow({
                x: 1,
                y: 'b'
            }),
            new DataTableRow({
                x: 1,
                y: 'a'
            })
        ]),
        modifier = new GroupModifier({
            groupColumn: 'y'
        }),
        modifiedTable = modifier.execute(table);

    assert.ok(
        modifiedTable !== table &&
        modifiedTable.getRow(0).getCell('table') instanceof DataTable,
        'Filtered table should contain subtables.'
    );

    assert.deepEqual(
        modifiedTable.getRow(0).getCellAsTable('table').getColumns(['x', 'y']),
        {
            x: [0, 1],
            y: ['a', 'a']
        },
        'Modified table should have subtables. (#1)'
    );

    assert.deepEqual(
        modifiedTable.getRow(1).getCellAsTable('table').getColumns(['x', 'y']),
        {
            x: [0, 1],
            y: ['b', 'b']
        },
        'Modified table should have subtables. (#1)'
    );

});
