import DataTable from '/base/js/Data/DataTable.js';
import ChainModifier from '/base/js/Data/Modifiers/ChainModifier.js';
import GroupModifier from '/base/js/Data/Modifiers/GroupModifier.js';
import RangeModifier from '/base/js/Data/Modifiers/RangeModifier.js';

QUnit.test('ChainModifier.execute', function (assert) {

    const table = new DataTable({
            x: [1, 2, 3, 4, 5, 6],
            y: ['a', 'a', 'b', 'b', 'c', 'c']
        }),
        modifier = new ChainModifier(
            {},
            new GroupModifier({
                groupColumn: 'y'
            }),
            new RangeModifier({
                modifier: 'Range',
                ranges: [{
                    column: 'value',
                    minValue: 'A',
                    maxValue: 'b'
                }]
            })
        );

    modifier.modify(table);

    assert.equal(
        table.getRowCount(),
        2,
        'Modified table should contain two rows, one for each group.'
    );

    assert.deepEqual(
        table.toJSON(),
        {
            $class: 'DataTable',
            columns: {
                groupBy: ['y', 'y'],
                table: [{
                    $class: 'DataTable',
                    columns: {
                        x: [1, 2],
                        y: ['a', 'a']
                    }
                }, {
                    $class: 'DataTable',
                    columns: {
                        x: [3, 4],
                        y: ['b', 'b']
                    }
                }],
                value: ['a', 'b']
            }
        },
        'Modified table should have expected structure of two rows with sub tables.'
    );

});

QUnit.test('benchmark', function (assert) {
    const table = new DataTable(),
        modifier = new ChainModifier(
            {},
            new GroupModifier({
                groupColumn: 'y'
            }),
            new RangeModifier({
                modifier: 'Range',
                ranges: [{
                    column: 'value',
                    minValue: 'A',
                    maxValue: 'b'
                }]
            })
        );
    
    table.setRowObjects([{
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
    }
    const result = modifier.benchmark(table, options);

    assert.strictEqual(
        result.length,
        options.iterations,
        'Ran for correct amount of iterations'
    );

});
