import OldTownTable from '/base/js/Data/OldTownTable.js';
import OldTownTableRow from '/base/js/Data/OldTownTableRow.js';
import GroupModifier from '/base/js/Data/Modifiers/GroupModifier.js';

QUnit.test('GroupModifier.execute', function (assert) {

    const table = new OldTownTable([
            new OldTownTableRow({
                x: 0,
                y: 'a'
            }),
            new OldTownTableRow({
                x: 0,
                y: 'b'
            }),
            new OldTownTableRow({
                x: 1,
                y: 'b'
            }),
            new OldTownTableRow({
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
        modifiedTable.getRow(0).getCell('table') instanceof OldTownTable,
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
