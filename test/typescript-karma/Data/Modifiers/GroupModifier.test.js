import DataTable from '/base/js/Data/DataTable.js';
import GroupModifier from '/base/js/Data/Modifiers/GroupModifier.js';

QUnit.test('GroupModifier.execute', function (assert) {

    const table = new DataTable({
            x: [ 0, 0, 1, 1 ],
            y: [ 'a', 'b', 'b', 'a']
        }),
        modifier = new GroupModifier({
            groupColumn: 'y'
        });

    modifier.modify(table);

    assert.ok(
        table.getCell('table', 0) instanceof DataTable,
        'Filtered table should contain subtables.'
    );

    assert.deepEqual(
        table.getCell('table', 0).getColumns(['x', 'y']),
        {
            x: [0, 1],
            y: ['a', 'a']
        },
        'Modified table should have subtables. (#1)'
    );

    assert.deepEqual(
        table.getCell('table', 1).getColumns(['x', 'y']),
        {
            x: [0, 1],
            y: ['b', 'b']
        },
        'Modified table should have subtables. (#1)'
    );

});
