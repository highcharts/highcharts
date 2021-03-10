import OldTownTable from '/base/js/Data/OldTownTable.js';
import OldTownTableRow from '/base/js/Data/OldTownTableRow.js';
import ChainModifier from '/base/js/Data/Modifiers/ChainModifier.js';
import GroupModifier from '/base/js/Data/Modifiers/GroupModifier.js';
import RangeModifier from '/base/js/Data/Modifiers/RangeModifier.js';

QUnit.test('ChainModifier.execute', function (assert) {

    const table = new OldTownTable([
            new OldTownTableRow({
                x: 1,
                y: 'a'
            }),
            new OldTownTableRow({
                x: 2,
                y: 'a'
            }),
            new OldTownTableRow({
                x: 3,
                y: 'b'
            }),
            new OldTownTableRow({
                x: 4,
                y: 'b'
            }),
            new OldTownTableRow({
                x: 5,
                y: 'c'
            }),
            new OldTownTableRow({
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
            $class: 'OldTownTable',
            rows: [{
                $class: 'OldTownTableRow',
                groupBy: 'y',
                id: '0',
                table: {
                    $class: 'OldTownTable',
                    rows: [{
                        $class: 'OldTownTableRow',
                        x: 1,
                        y: 'a'
                    }, {
                        $class: 'OldTownTableRow',
                        x: 2,
                        y: 'a'
                    }]
                },
                value: 'a'
            }, {
                $class: 'OldTownTableRow',
                groupBy: 'y',
                id: '1',
                table: {
                    $class: 'OldTownTable',
                    rows: [{
                        $class: 'OldTownTableRow',
                        x: 3,
                        y: 'b'
                    }, {
                        $class: 'OldTownTableRow',
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
    const table = OldTownTable.fromJSON({
        $class: 'OldTownTable',
        rows: [{
            $class: 'OldTownTableRow',
            x: 1,
            y: 'a'
        }, {
            $class: 'OldTownTableRow',
            x: 2,
            y: 'a'
        }, {
            $class: 'OldTownTableRow',
            x: 3,
            y: 'b'
        }, {
            $class: 'OldTownTableRow',
            x: 4,
            y: 'b'
        }, {
            $class: 'OldTownTableRow',
            x: 5,
            y: 'c'
        }, {
            $class: 'OldTownTableRow',
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
