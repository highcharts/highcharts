import DataTable from '/base/js/Data/DataTable.js';
import SortModifier from '/base/js/Data/Modifiers/SortModifier.js';

QUnit.test('SortModifier.modify', (assert) => {

    const table = new DataTable({
            x: [ 0, 1, 2 ],
            y: [ 3, 1, 2 ]
        }),
        ascXModifier = new SortModifier({
            direction: 'asc',
            orderByColumn: 'x'
        }),
        descYModifier = new SortModifier({
            direction: 'desc',
            orderByColumn: 'y'
        }),
        tableDescY = descYModifier.modify(table.clone()),
        tableAscX = ascXModifier.modify(tableDescY.clone());

    assert.deepEqual(
        tableDescY.getColumn('x'),
        [0, 2, 1],
        'Sorted table should be in descending order of Y values.'
    );

    assert.deepEqual(
        tableAscX.getColumns(['x', 'y']),
        table.getColumns(['x', 'y']),
        'Resorted table should be ordered the same as original.'
    );

});

QUnit.test('SortModifier.modifyCell', function (assert) {
    const modifier = new SortModifier({
            direction: 'asc',
            orderByColumn: 'y',
            orderInColumn: 'x'
        }),
        table = new DataTable({
            x: [ 0, 1, 2 ],
            y: [ 3, 1, 2 ]
        });

    table.setModifier(modifier);

    assert.deepEqual(
        table.modified.getColumns(),
        {
            x: [2, 0, 1],
            y: [3, 1, 2] 
        },
        'Modified table should contain sorted columns. (#1)'
    );

    modifier.options.direction = 'desc';
    table.setModifier(modifier);

    assert.deepEqual(
        table.modified.getColumns(),
        {
            x: [0, 2, 1],
            y: [3, 1, 2] 
        },
        'Modified table should contain sorted columns. (#2)'
    );

    table.setCell('y', 0, 0);

    assert.deepEqual(
        table.modified.getColumns(),
        {
            x: [2, 1, 0],
            y: [0, 1, 2] 
        },
        'Modified table should contain sorted columns. (#3)'
    );

});

QUnit.test('SortModifier.modifyColumns', function (assert) {
    const modifier = new SortModifier({
            direction: 'asc',
            orderByColumn: 'y',
            orderInColumn: 'x'
        }),
        table = new DataTable({
            x: [ 0, 1, 2 ],
            y: [ 3, 1, 2 ]
        });

    table.setModifier(modifier);

    assert.deepEqual(
        table.modified.getColumns(),
        {
            x: [2, 0, 1],
            y: [3, 1, 2] 
        },
        'Modified table should contain sorted columns. (#1)'
    );

    modifier.options.direction = 'desc';
    table.setModifier(modifier);

    assert.deepEqual(
        table.modified.getColumns(),
        {
            x: [0, 2, 1],
            y: [3, 1, 2] 
        },
        'Modified table should contain sorted columns. (#2)'
    );

    table.setColumn('y', [1, 2, 3]);

    assert.deepEqual(
        table.modified.getColumns(),
        {
            x: [2, 1, 0],
            y: [1, 2, 3] 
        },
        'Modified table should contain sorted columns. (#3)'
    );

});

QUnit.test('SortModifier.modifyRows', function (assert) {
    const modifier = new SortModifier({
            direction: 'asc',
            orderByColumn: 'y',
            orderInColumn: 'x'
        }),
        table = new DataTable({
            x: [ 0, 1, 2 ],
            y: [ 3, 1, 2 ]
        });

    table.setModifier(modifier);

    assert.deepEqual(
        table.modified.getColumns(),
        {
            x: [2, 0, 1],
            y: [3, 1, 2] 
        },
        'Modified table should contain sorted columns. (#1)'
    );

    modifier.options.direction = 'desc';
    table.setModifier(modifier);

    assert.deepEqual(
        table.modified.getColumns(),
        {
            x: [0, 2, 1],
            y: [3, 1, 2] 
        },
        'Modified table should contain sorted columns. (#2)'
    );

    table.setRow({ 'y': 0 }, 0);

    assert.deepEqual(
        table.modified.getColumns(),
        {
            x: [2, 1, 0],
            y: [0, 1, 2] 
        },
        'Modified table should contain sorted columns. (#3)'
    );

});
