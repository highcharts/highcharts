import OldTownTable from '/base/js/Data/OldTownTable.js';
import OldTownTableRow from '/base/js/Data/OldTownTableRow.js';
import SortModifier from '/base/js/Data/Modifiers/SortModifier.js';

QUnit.test('SortModifier.execute', (assert) => {

    const table = new OldTownTable([
            new OldTownTableRow({
                x: 0,
                y: 3
            }),
            new OldTownTableRow({
                x: 1,
                y: 1
            }),
            new OldTownTableRow({
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
