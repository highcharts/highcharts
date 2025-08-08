import DataTable from '/base/code/es-modules/Data/DataTable.js';
import ChainModifier from '/base/code/es-modules/Data/Modifiers/ChainModifier.js';
import FilterModifier from '/base/code/es-modules/Data/Modifiers/FilterModifier.js';

QUnit.test('ChainModifier.benchmark', function (assert) {

    const modifier = new ChainModifier(
            {},
            new FilterModifier({
                condition: {
                    operator: 'and',
                    conditions: [{
                        columnId: 'value',
                        operator: '>=',
                        value: 'A'
                    }, {
                        columnId: 'value',
                        operator: '<=',
                        value: 'b'
                    }]
                }
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
                type: 'Filter',
                condition: {
                    operator: 'and',
                    conditions: [{
                        columnId: 'y',
                        operator: '>=',
                        value: 'A'
                    }, {
                        columnId: 'y',
                        operator: '<=',
                        value: 'b'
                    }]
                }
            }, {
                type: 'Range',
                start: 1
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
                table.getModified().getRowCount(),
                3,
                'Modified table should contain three rows.'
            );

            assert.deepEqual(
                table.getModified().getColumns(),
                {
                    x: [2, 3, 4],
                    y: ['a', 'b', 'b']
                },
                'Modified table should have expected structure of three rows.'
            );

            assert.deepEqual(
                table.getModified().localRowIndexes,
                [void 0, 0, 1, 2],
                'Modified table should have expected local row indexes.'
            );

            assert.deepEqual(
                table.getModified().originalRowIndexes,
                [1, 2, 3],
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
