import DataTable from '/base/js/Data/DataTable.js';
import ChainDataModifier from '/base/js/Data/Modifiers/ChainDataModifier.js';
import GroupDataModifier from '/base/js/Data/Modifiers/GroupDataModifier.js';
import RangeDataModifier from '/base/js/Data/Modifiers/RangeDataModifier.js';

QUnit.test('ChainDataModifier.execute', function (assert) {

    const modifier = new ChainDataModifier(
            {},
            new GroupDataModifier({
                groupColumn: 'y'
            }),
            new RangeDataModifier({
                modifier: 'Range',
                ranges: [{
                    column: 'value',
                    minValue: 'A',
                    maxValue: 'b'
                }]
            })
        ),
        table = DataTable.fromJSON({
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
        }),
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
