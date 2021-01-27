import DataTable from '/base/js/Data/DataTable.js';
import DataTableRow from '/base/js/Data/DataTableRow.js';
import ChainModifier from '/base/js/Data/Modifiers/ChainDataModifier.js';
import GroupModifier from '/base/js/Data/Modifiers/GroupDataModifier.js';
import RangeModifier from '/base/js/Data/Modifiers/RangeDataModifier.js';

QUnit.test('ChainModifier.execute', function (assert) {

    const table = new DataTable([
            new DataTableRow({
                x: 1,
                y: 'a'
            }),
            new DataTableRow({
                x: 2,
                y: 'a'
            }),
            new DataTableRow({
                x: 3,
                y: 'b'
            }),
            new DataTableRow({
                x: 4,
                y: 'b'
            }),
            new DataTableRow({
                x: 5,
                y: 'c'
            }),
            new DataTableRow({
                x: 6,
                y: 'c'
            }),
        ]),
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
        ),
        modifiedTable = modifier.execute(table);

    assert.equal(
        modifiedTable.getRowCount(),
        2,
        'Modified table should contain two rows, one for each group.'
    );

    assert.deepEqual(
        modifiedTable.toJSON(),
        {
            $class: 'DataTable',
            rows: [{
                $class: 'DataTableRow',
                groupBy: 'y',
                id: '0',
                table: {
                    $class: 'DataTable',
                    rows: [{
                        $class: 'DataTableRow',
                        x: 1,
                        y: 'a'
                    }, {
                        $class: 'DataTableRow',
                        x: 2,
                        y: 'a'
                    }]
                },
                value: 'a'
            }, {
                $class: 'DataTableRow',
                groupBy: 'y',
                id: '1',
                table: {
                    $class: 'DataTable',
                    rows: [{
                        $class: 'DataTableRow',
                        x: 3,
                        y: 'b'
                    }, {
                        $class: 'DataTableRow',
                        x: 4,
                        y: 'b'
                    }]
                },
                value: 'b'
            }]
        },
        'Modified table should have expected structure of two rows with sub tables.'
    );

});

QUnit.test('benchmark', function (assert) {
    const modifier = new ChainModifier(
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
    const table = DataTable.fromJSON({
        $class: 'DataTable',
        rows: [{
            $class: 'DataTableRow',
            x: 1,
            y: 'a'
        }, {
            $class: 'DataTableRow',
            x: 2,
            y: 'a'
        }, {
            $class: 'DataTableRow',
            x: 3,
            y: 'b'
        }, {
            $class: 'DataTableRow',
            x: 4,
            y: 'b'
        }, {
            $class: 'DataTableRow',
            x: 5,
            y: 'c'
        }, {
            $class: 'DataTableRow',
            x: 6,
            y: 'c'
        }]
    });

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
