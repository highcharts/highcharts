import DataTable from '/base/code/es-modules/Data/DataTable.js';
import ChainModifier from '/base/code/es-modules/Data/Modifiers/ChainModifier.js';
import RangeModifier from '/base/code/es-modules/Data/Modifiers/RangeModifier.js';
import SortModifier from '/base/code/es-modules/Data/Modifiers/SortModifier.js';

QUnit.test('ChainModifier.benchmark', function (assert) {

    const modifier = new ChainModifier(
            {},
            new RangeModifier({
                ranges: [{
                    column: 'value',
                    minValue: 'A',
                    maxValue: 'b'
                }]
            })
        ),
        table = new DataTable();
    
    table.setRows([{
        x: 1,
        y: 'a'
    }, {
        x: 2,
        y: 'a'
    }, {
        x: 3,
        y: 'b'
    }, {
        x: 4,
        y: 'b'
    }, {
        x: 5,
        y: 'c'
    }, {
        x: 6,
        y: 'c'
    }]);

    const options = {
            iterations: 10
        },
        result = modifier.benchmark(table, options);

    assert.strictEqual(
        result.length,
        options.iterations,
        'Ran for correct amount of iterations'
    );
});

QUnit.test('ChainModifier.modify', function (assert) {

    const done = assert.async(),
        modifier = new ChainModifier({
            chain: [{
                type: 'Range',
                ranges: [{
                    column: 'y',
                    minValue: 'A',
                    maxValue: 'b'
                }]
            }]
        }),
        table = new DataTable({
            columns: {
                x: [1, 2, 3, 4, 5, 6],
                y: ['a', 'a', 'b', 'b', 'c', 'c']
            }
        });

    modifier
        .modify(table)
        .then((table) => {

            assert.equal(
                table.modified.getRowCount(),
                4,
                'Modified table should contain four rows.'
            );

            assert.deepEqual(
                table.modified.getColumns(),
                {
                    x: [1, 2, 3, 4],
                    y: ['a', 'a', 'b', 'b']
                },
                'Modified table should have expected structure of four rows.'
            );

            assert.deepEqual(
                table.modified.localRowIndexes,
                [0, 1, 2, 3],
                'Modified table should have expected local row indexes.'
            );

            assert.deepEqual(
                table.modified.originalRowIndexes,
                [0, 1, 2, 3],
                'Modified table should have expected original row indexes.'
            );

        })
        .catch((e) =>
            assert.notOk(true, e)
        )
        .then(() =>
            done()
        );

});

QUnit.test('ChainModifier.modifyCell', function (assert) {

    const done = assert.async(),
        table = new DataTable({
            columns: {
                x: [1, 2, 3, 4, 5, 6]
            }
        });

    table
        .setModifier(new ChainModifier(
            {},
            new RangeModifier({
                ranges: [{
                    column: 'x',
                    minValue: 2,
                    maxValue: 5
                }]
            }),
            new SortModifier({
                direction: 'desc',
                orderByColumn: 'x',
            })
        ))
        .then((table) => {

            assert.deepEqual(
                table.getColumn('x'),
                [1, 2, 3, 4, 5, 6],
                'DataTable x column should contain expected values.'
            );

            assert.deepEqual(
                table.modified.getColumn('x'),
                [5, 4, 3, 2],
                'DataTable.modified x column should contain expected values.'
            );

            assert.deepEqual(
                table.modified.localRowIndexes,
                [void 0, 3, 2, 1, 0],
                'Modified table should have expected local row indexes.'
            );

            assert.deepEqual(
                table.modified.originalRowIndexes,
                [4, 3, 2, 1],
                'Modified table should have expected original row indexes.'
            );

            table.setCell('x', 2, 0);

            assert.deepEqual(
                table.getColumn('x'),
                [1, 2, 0, 4, 5, 6],
                'DataTable x column should contain expected values after the ' +
                'cell modification.'
            );

            assert.deepEqual(
                table.modified.getColumn('x'),
                [5, 4, 2],
                'DataTable.modified x column should contain expected values ' +
                'after the cell modification.'
            );

            assert.deepEqual(
                table.modified.localRowIndexes,
                [void 0, 2, void 0, 1, 0],
                'Modified table should have expected local row indexes after ' +
                'the cell modification.'
            );

            assert.deepEqual(
                table.modified.originalRowIndexes,
                [4, 3, 1],
                'Modified table should have expected original row indexes ' +
                'after the cell modification.'
            );

        })
        .catch((e) =>
            assert.notOk(true, e)
        )
        .then(() =>
            done()
        );

});

QUnit.test('ChainModifier.modifyColumns', function (assert) {

    const done = assert.async(),
        table = new DataTable({
            columns: {
                x: [1, 2, 3, 4, 5, 6]
            }
        });

    table
        .setModifier(new ChainModifier(
            {},
            new RangeModifier({
                ranges: [{
                    column: 'x',
                    minValue: 2,
                    maxValue: 5
                }]
            }),
            new SortModifier({
                direction: 'desc',
                orderByColumn: 'x',
            })
        ))
        .then((table) => {

            assert.strictEqual(
                table.getRowCount(),
                6,
                'DataTable should contain six rows.'
            );

            assert.strictEqual(
                table.modified.getRowCount(),
                4,
                'DataTable.modified should contain four rows.'
            );

            table.setColumn('x', [8, 3, 7, 4, 6, 5]);

            assert.strictEqual(
                table.getRowCount(),
                6,
                'DataTable should contain six rows.'
            );

            assert.strictEqual(
                table.modified.getRowCount(),
                3,
                'DataTable.modified should contain three rows.'
            );

            assert.deepEqual(
                table.modified.localRowIndexes,
                [void 0, 2, void 0, 1, void 0, 0],
                'Modified table should have expected local row indexes.'
            );

            assert.deepEqual(
                table.modified.originalRowIndexes,
                [5, 3, 1],
                'Modified table should have expected original row indexes.'
            );

        })
        .catch((e) =>
            assert.notOk(true, e)
        )
        .then(() =>
            done()
        );

});


QUnit.test('ChainModifier.modifyRows', function (assert) {

    const done = assert.async(),
        table = new DataTable({
            columns: {
                x: [6, 5, 4, 3, 2, 1],
                ignoredColumn: ['a', 'b', 'c', 'd', 'e', 'f']
            }
        });

    table
        .setModifier(new ChainModifier(
            {},
            new RangeModifier({
                ranges: [{
                    column: 'x',
                    minValue: 2,
                    maxValue: 5
                }]
            }),
            new SortModifier({
                direction: 'asc',
                orderByColumn: 'x',
            })
        ))
        .then((table) => {

            assert.strictEqual(
                table.getRowCount(),
                6,
                'DataTable should contain six rows.'
            );

            assert.strictEqual(
                table.modified.getRowCount(),
                4,
                'DataTable.modified should contain four rows.'
            );

            table.setRows([{ x: 1 }, { ignoredColumn: 'z' }, { x: 5 }], 4);

            assert.strictEqual(
                table.getRowCount(),
                7,
                'DataTable should contain seven rows.'
            );

            assert.strictEqual(
                table.modified.getRowCount(),
                4,
                'DataTable.modified should contain three rows.'
            );

            assert.deepEqual(
                table.modified.localRowIndexes,
                [void 0, 2, 1, 0, void 0, void 0, 3],
                'Modified table should have expected local row indexes.'
            );

            assert.deepEqual(
                table.modified.originalRowIndexes,
                [3, 2, 1, 6],
                'Modified table should have expected original row indexes.'
            );

        })
        .catch((e) =>
            assert.notOk(true, e)
        )
        .then(() =>
            done()
        );

});
