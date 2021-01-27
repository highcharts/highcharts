import DataTable from '/base/js/Data/DataTable.js';
import GroupModifier from '/base/js/Data/Modifiers/GroupDataModifier.js';

QUnit.test('RangeDataModifier.execute', function (assert) {

    const tableJSON = {
            $class: 'DataTable',
            rows: [{
                $class: 'DataTableRow',
                x: 0,
                y: 'a'
            }, {
                $class: 'DataTableRow',
                x: 0,
                y: 'b'
            }, {
                $class: 'DataTableRow',
                x: 1,
                y: 'b'
            }, {
                $class: 'DataTableRow',
                x: 1,
                y: 'a'
            }]
        },
        table = DataTable.fromJSON(tableJSON),
        modifier = new GroupModifier({
            groupColumn: 'y'
        }),
        modifiedTable = modifier.execute(table);

    assert.ok(
        modifiedTable !== table &&
        modifiedTable.getRow(0).getCell('table') instanceof DataTable,
        'Filtered table should contain subtables.'
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
                        x: 0,
                        y: 'a'
                    }, {
                        $class: 'DataTableRow',
                        x: 1,
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
                        x: 0,
                        y: 'b'
                    }, {
                        $class: 'DataTableRow',
                        x: 1,
                        y: 'b'
                    }]
                },
                value: 'b'
            }]
        },
        'JSON of filtered table should have two subtables.'
    );

});
