import DataTable from '/base/code/es-modules/Data/DataTable.js';
import RangeModifier from '/base/code/es-modules/Data/Modifiers/RangeModifier.js';

QUnit.test('DataTableRowKey.modify', async function (assert) {

    const table = new DataTable({
        columns: {
            x: [-2, -1, 0, 1, 2],
            y: ['a', 'b', 'c', 'd', 'e'],
            z: [1e1, 1e2, 1e3, 1e4, 1e5]
        },
        rowKeysId: 'rkey'
    }),
        modifier = new RangeModifier();
    modifier.options.ranges.length = 0;

    const rowKeys = table.getRowKeysColumn();
    assert.equal(rowKeys.length, table.columns.x.length,
        'The number of row keys should equal the number of rows');

    await modifier.modify(table);

    assert.deepEqual(
        table.modified.getRow(0),
        table.getRow(0),
        'Filtered table should contain same rows.'
    );

    modifier.options.ranges.push({
        column: 'y',
        minValue: 'A',
        maxValue: 'b'
    });

    await modifier.modify(table);

    assert.deepEqual(
        table.modified.getColumns(),
        {
            x: [-2, -1],
            y: ['a', 'b'],
            z: [10, 100]
        },
        'Filtered table should contain reduced number of rows.'
    );

    modifier.options.ranges.push({
        column: 'z',
        minValue: 50,
        maxValue: 100
    });

    await modifier.modify(table);

    assert.deepEqual(
        table.modified.getColumns(),
        {
            x: [-1],
            y: ['b'],
            z: [100]
        },
        'Filtered table should contain intersective reduction of rows.'
    );
});

QUnit.test('DataTableRowKey.modifyCell', function (assert) {

    const done = assert.async(),
        modifier = new RangeModifier({
            additive: true,
            ranges: [{
                column: 'x',
                minValue: -10,
                maxValue: -2
            }, {
                column: 'y',
                minValue: 'e',
                maxValue: 'z'
            }]
        }),
        table = new DataTable({
            columns: {
                x: [-2, -1, 0, 1, 2],
                y: ['a', 'b', 'c', 'd', 'e']
            },
            rowKeysId: 'rkey'
        });

    table
        .setModifier(modifier)
        .then((table) => {

            assert.deepEqual(
                table.modified.getRowObjects(),
                [{ x: -2, y: 'a' }, { x: 2, y: 'e' }],
                'Modified table should contain two rows.'
            );

            table.setCell('x', 0, -1.5);

            assert.deepEqual(
                table.modified.getRowObjects(),
                [{ x: 2, y: 'e' }],
                'Modified table should contain one row.'
            );

        })
        .catch((e) =>
            assert.notOk(true, e)
        )
        .then(() =>
            done()
        );
});


QUnit.test('DataTableRowKey.modifyColumns', function (assert) {

    const done = assert.async(),
        modifier = new RangeModifier({
            additive: true,
            ranges: [{
                column: 'x',
                minValue: -10,
                maxValue: -2
            }, {
                column: 'y',
                minValue: 'e',
                maxValue: 'z'
            }]
        }),
        table = new DataTable({
            columns: {
                x: [-2, -1, 0, 1, 2],
                y: ['a', 'b', 'c', 'd', 'e']
            },
            rowKeysId: 'rkey'
        });

    table
        .setModifier(modifier)
        .then((table) => {

            assert.deepEqual(
                table.modified.getRowObjects(),
                [{ x: -2, y: 'a' }, { x: 2, y: 'e' }],
                'Modified table should contain two rows.'
            );

            table.setColumns({ x: [-3, -2, 0] });

            assert.deepEqual(
                table.modified.getRowObjects(),
                [{ x: -3, y: 'a' }, { x: -2, y: 'b' }],
                'Modified table should contain two rows with valid values.'
            );

        })
        .catch((e) =>
            assert.notOk(true, e)
        )
        .then(() =>
            done()
        );

});

QUnit.test('DataTableRowKey.renameColumn', function (assert) {
    const done = assert.async(),
        modifier = new RangeModifier({
            additive: true,
            ranges: [{
                column: 'x',
                minValue: -10,
                maxValue: -2
            }, {
                column: 'y',
                minValue: 'e',
                maxValue: 'z'
            }]
        }),
        table = new DataTable({
            columns: {
                x: [-2, -1, 0, 1, 2],
                y: ['a', 'b', 'c', 'd', 'e']
            },
            rowKeysId: 'rkey'
        });

    table
        .setModifier(undefined)
        .then((table) => {
            assert.deepEqual(
                table.getColumns(),
                { x: [-2, -1, 0, 1, 2], y: ['a', 'b', 'c', 'd', 'e'] },
                'The original table should contain two columns with 5 rows.'
            );

            assert.ok(
                table.setModifier(modifier),
                'Setting the modifier should pass.'
            );

            assert.deepEqual(
                table.modified.getRowObjects(),
                [{ x: -2, y: 'a' }, { x: 2, y: 'e' }],
                'Modified table should now contain only two rows.'
            );

            table.setColumns({ x: [-3, -2, 0] });

            assert.deepEqual(
                table.modified.getRowObjects(),
                [{ x: -3, y: 'a' }, { x: -2, y: 'b' }],
                'Modified table should contain two rows with valid values.'
            );

            assert.deepEqual(
                table.modified.getColumns(),
                { x: [-3, -2], y: ['a', 'b'] },
                'Modified table should contain two rows with valid values.'
            );

            assert.ok(
                table.modified.renameColumn('y', 'z'),
                'Table should move cells of a column to a new column.'
            );

            assert.deepEqual(
                table.modified.getColumns(),
                { x: [-3, -2], z: ['a', 'b'] },
                'Modified table hould contain column z instead of y.'
            );
        })
        .catch((e) =>
            assert.notOk(true, e)
        )
        .then(() =>
            done()
        );
});

QUnit.test('DataTableRowKey.deleteColumns', function (assert) {
    const done = assert.async(),
        modifier = new RangeModifier({
            additive: true,
            ranges: [{
                column: 'x',
                minValue: -10,
                maxValue: -2
            }, {
                column: 'y',
                minValue: 'e',
                maxValue: 'z'
            }]
        }),
        table = new DataTable({
            columns: {
                x: [-2, -1, 0, 1, 2],
                y: ['a', 'b', 'c', 'd', 'e']
            },
            rowKeysId: 'rkey'
        });

    table
        .setModifier(modifier)
        .then((table) => {
            assert.deepEqual(
                table.modified.getRowObjects(),
                [{ x: -2, y: 'a' }, { x: 2, y: 'e' }],
                'Modified table should contain only two rows.'
            );

            table.setColumns({ x: [-3, -2, 0] });

            assert.deepEqual(
                table.modified.getRowObjects(),
                [{ x: -3, y: 'a' }, { x: -2, y: 'b' }],
                'Modified table should contain two rows with valid values.'
            );

            assert.deepEqual(
                table.modified.getColumns(),
                { x: [-3, -2], y: ['a', 'b'] },
                'Modified table should contain two rows with valid values.'
            );

            assert.ok(
                table.modified.deleteColumns(['y']),
                'Modified table should delete a column.'
            );

            assert.deepEqual(
                table.modified.getColumns(),
                { x: [-3, -2] },
                'Modified table should contain one row with valid values.'
            );

            assert.ok(
                table.modified.deleteColumns(['x']),
                'Table should delete a column.'
            );

            assert.deepEqual(
                table.modified.getColumns(),
                {},
                'Modified table should be empty.'
            );

            const rowCount = table.modified.getRowCount();
            assert.equal(
                rowCount,
                0,
                'Modified table row count should be zero.'
            );
        })
        .catch((e) =>
            assert.notOk(true, e)
        )
        .then(() =>
            done()
        );
});

QUnit.test('DataTableRowKey.setColumns', function (assert) {
    const done = assert.async(),
        modifier = new RangeModifier({
            additive: true,
            ranges: [{
                column: 'x',
                minValue: -10,
                maxValue: -2
            }, {
                column: 'y',
                minValue: 'e',
                maxValue: 'z'
            }]
        }),
        table = new DataTable({
            columns: {
                x: [-2, -1, 0, 1, 2],
                y: ['a', 'b', 'c', 'd', 'e']
            },
            rowKeysId: 'rkey'
        });

    table
        .setModifier(undefined)
        .then((table) => {
            assert.deepEqual(
                table.getColumns(),
                { x: [-2, -1, 0, 1, 2], y: ['a', 'b', 'c', 'd', 'e'] },
                'The original table should contain 2 columns, 5 rows.'
            );

            table.setColumns({ z: [1, 2, 3, 4, 5] });

            assert.deepEqual(
                table.getColumns(),
                { x: [-2, -1, 0, 1, 2], y: ['a', 'b', 'c', 'd', 'e'], z: [1, 2, 3, 4, 5] },
                'Modified table should contain 3 columns, 5 rows.'
            );

            assert.ok(
                table.setModifier(modifier),
                'Setting the modifier should pass.'
            );

            assert.deepEqual(
                table.modified.getColumns(),
                { x: [-2, 2], y: ['a', 'e'], z: [1, 5] },
                'Modified table should contain 3 columns, 2 rows.'
            );
        })
        .catch((e) =>
            assert.notOk(true, e)
        )
        .then(() =>
            done()
        );
});


QUnit.test('DataTableRowKey.columnAlias', function (assert) {
    const done = assert.async(),
        modifier = new RangeModifier({
            additive: true,
            ranges: [{
                column: 'x',
                minValue: -10,
                maxValue: -2
            }, {
                column: 'y',
                minValue: 'e',
                maxValue: 'z'
            }]
        }),
        table = new DataTable({
            columns: {
                x: [-2, -1, 0, 1, 2],
                y: ['a', 'b', 'c', 'd', 'e']
            },
            rowKeysId: 'rkey'
        });

    table
        .setModifier(undefined)
        .then((table) => {
            // Without modifier
            assert.deepEqual(
                table.getColumns(),
                { x: [-2, -1, 0, 1, 2], y: ['a', 'b', 'c', 'd', 'e'] },
                'The original table should contain 2 columns, 5 rows.'
            );

            table.setColumns({ z: [1, 2, 3, 4, 5] });

            assert.deepEqual(
                table.getColumns(),
                { x: [-2, -1, 0, 1, 2], y: ['a', 'b', 'c', 'd', 'e'], z: [1, 2, 3, 4, 5] },
                'Modified table should contain 3 columns, 5 rows.'
            );

            // With modifier
            assert.ok(
                table.setModifier(modifier),
                'Setting the modifier should pass.'
            );

            assert.deepEqual(
                table.modified.getColumns(),
                { x: [-2, 2], y: ['a', 'e'], z: [1, 5] },
                'Modified table should contain 3 columns, 2 rows.'
            );

            assert.deepEqual(
                table.modified.getColumn('x'),
                [-2, 2],
                'Table should return correct column for x.'
            );

            table.modified.aliases.test = 'x';

            assert.deepEqual(
                table.modified.getColumn('test'),
                [-2, 2],
                'Table should return correct column for test.'
            );

            table.modified.deleteColumnAlias('test');

            assert.equal(
                table.modified.aliases.test,
                undefined,
                'Table should delete column alias.'
            );
        })
        .catch((e) =>
            assert.notOk(true, e)
        )
        .then(() =>
            done()
        );
});
