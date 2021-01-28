import DataTable from '/base/js/Data/DataTable.js';
import DataTableRow from '/base/js/Data/DataTableRow.js';
import SortModifier from '/base/js/Data/Modifiers/SortModifier.js';

QUnit.test('SortModifier.execute', (assert) => {

    const table = new DataTable([
            new DataTableRow({
                x: 0,
                y: 3
            }),
            new DataTableRow({
                x: 1,
                y: 1
            }),
            new DataTableRow({
                x: 2,
                y: 2
            }),
        ]),
        ascXModifier = new SortModifier({
            direction: 'asc',
            orderByColumn: 'x'
        }),
        descYModifier = new SortModifier({
            direction: 'desc',
            orderByColumn: 'y'
        }),
        tableDescY = descYModifier.execute(table),
        tableAscX = ascXModifier.execute(tableDescY);

    assert.deepEqual(
        tableDescY.getColumns(['x']).x,
        [0, 2, 1],
        'Sorted table should be in descending order of Y values.'
    );

    assert.deepEqual(
        table.getColumns(['x', 'y']),
        tableAscX.getColumns(['x', 'y']),
        'Resorted table should be ordered the same as original.'
    );

});
