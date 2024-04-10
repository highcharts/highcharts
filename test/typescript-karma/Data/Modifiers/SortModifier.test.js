import DataTable from '/base/code/es-modules/Data/DataTable.js';
import SortModifier from '/base/code/es-modules/Data/Modifiers/SortModifier.js';

QUnit.test('SortModifier.modify', (assert) => {

    const done = assert.async(),
        table = new DataTable({
            columns: {
                x: [ 0, 1, 2 ],
                y: [ 3, 1, 2 ]
            }
        }),
        ascXModifier = new SortModifier({
            direction: 'asc',
            orderByColumn: 'x'
        }),
        descYModifier = new SortModifier({
            direction: 'desc',
            orderByColumn: 'y'
        });

    descYModifier
        .modify(table.clone())
        .then((tableDescY) => {
            assert.deepEqual(
                tableDescY.modified.getColumn('x'),
                [0, 2, 1],
                'Sorted table should be in descending order of Y values.'
            );
            return tableDescY;
        })
        .then((tableDescY) =>
            ascXModifier.modify(tableDescY.modified.clone())
        )
        .then((tableAscX) =>
            assert.deepEqual(
                tableAscX.modified.getColumns(['x', 'y']),
                table.getColumns(['x', 'y']),
                'Resorted table should be ordered the same as original.'
            )
        )
        .catch((e) =>
            assert.notOk(true, e)
        )
        .then(() =>
            done()
        );

});

QUnit.test('SortModifier.modifyCell', function (assert) {

    const done = assert.async(),
        modifier = new SortModifier({
            direction: 'asc',
            orderByColumn: 'y',
            orderInColumn: 'x'
        }),
        table = new DataTable({
            columns: {
                x: [ 0, 1, 2 ],
                y: [ 3, 1, 2 ]
            }
        });

    table
        .setModifier(modifier)
        .then((table) => {
            assert.deepEqual(
                table.modified.getColumns(),
                {
                    x: [2, 0, 1],
                    y: [3, 1, 2] 
                },
                'Modified table should contain sorted columns. (#1)'
            );
            return table;
        })
        .then((table) => {
            modifier.options.direction = 'desc';
            return table.setModifier(modifier);
        })
        .then((table) => {
            assert.deepEqual(
                table.modified.getColumns(),
                {
                    x: [0, 2, 1],
                    y: [3, 1, 2] 
                },
                'Modified table should contain sorted columns. (#2)'
            );
            return table;
        })
        .then((table) => {
            table.setCell('y', 0, 0);
            assert.deepEqual(
                table.modified.getColumns(),
                {
                    x: [2, 1, 0],
                    y: [0, 1, 2] 
                },
                'Modified table should contain sorted columns. (#3)'
            );
        })
        .catch((e) =>
            assert.notOk(true, e)
        )
        .then(() =>
            done()
        );

});

QUnit.test('SortModifier.modifyColumns', function (assert) {

    const done = assert.async(),
        modifier = new SortModifier({
            direction: 'asc',
            orderByColumn: 'y',
            orderInColumn: 'x'
        }),
        table = new DataTable({
            columns: {
                x: [ 0, 1, 2 ],
                y: [ 3, 1, 2 ]
            }
        });

    table
        .setModifier(modifier)
        .then((table) => {
            assert.deepEqual(
                table.modified.getColumns(),
                {
                    x: [2, 0, 1],
                    y: [3, 1, 2] 
                },
                'Modified table should contain sorted columns. (#1)'
            );
            return table;
        })
        .then((table) => {
            modifier.options.direction = 'desc';
            return table.setModifier(modifier);
        })
        .then((table) => {
            assert.deepEqual(
                table.modified.getColumns(),
                {
                    x: [0, 2, 1],
                    y: [3, 1, 2] 
                },
                'Modified table should contain sorted columns. (#2)'
            );
            return table;
        })
        .then((table) => {
            table.setColumn('y', [1, 2, 3]);
            assert.deepEqual(
                table.modified.getColumns(),
                {
                    x: [2, 1, 0],
                    y: [1, 2, 3] 
                },
                'Modified table should contain sorted columns. (#3)'
            );
        })
        .catch((e) =>
            assert.notOk(true, e)
        )
        .then(() =>
            done()
        );

});

QUnit.test('SortModifier.modifyRows', function (assert) {

    const done = assert.async(),
        modifier = new SortModifier({
            direction: 'asc',
            orderByColumn: 'y',
            orderInColumn: 'x'
        }),
        table = new DataTable({
            columns: {
                x: [ 0, 1, 2 ],
                y: [ 3, 1, 2 ]
            }
        });

    table
        .setModifier(modifier)
        .then((table) => {
            assert.deepEqual(
                table.modified.getColumns(),
                {
                    x: [2, 0, 1],
                    y: [3, 1, 2] 
                },
                'Modified table should contain sorted columns. (#1)'
            );
            return table;
        })
        .then((table) => {
            modifier.options.direction = 'desc';
            return table.setModifier(modifier);
        })
        .then((table) => {
            assert.deepEqual(
                table.modified.getColumns(),
                {
                    x: [0, 2, 1],
                    y: [3, 1, 2] 
                },
                'Modified table should contain sorted columns. (#2)'
            );
            return table;
        })
        .then((table) => {
            table.setRow({ 'y': 0 }, 0);
            assert.deepEqual(
                table.modified.getColumns(),
                {
                    x: [2, 1, 0],
                    y: [0, 1, 2] 
                },
                'Modified table should contain sorted columns. (#3)'
            );
        })
        .catch((e) =>
            assert.notOk(true, e)
        )
        .then(() =>
            done()
        );

});
