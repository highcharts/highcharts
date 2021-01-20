import DataTable from '/base/js/Data/DataTable.js';
import RangeModifier from '/base/js/Data/Modifiers/RangeModifier.js';

QUnit.test('RangeModifier.execute', function (assert) {

    const tableJSON = {
            $class: 'DataTable',
            rows: [{
                $class: 'DataTableRow',
                x: -2,
                y: 'a'
            }, {
                $class: 'DataTableRow',
                x: -1,
                y: 'b'
            }, {
                $class: 'DataTableRow',
                x: 0,
                y: 'c'
            }, {
                $class: 'DataTableRow',
                x: 1,
                y: 'd'
            }, {
                $class: 'DataTableRow',
                x: 2,
                y: 'e'
            }]
        },
        table = DataTable.fromJSON(tableJSON),
        modifier = new RangeModifier({}),
        modifiedTable = modifier.execute(table);

    assert.ok(
        modifiedTable !== table &&
        modifiedTable.getRow(0) === table.getRow(0),
        'Filtered table should contain same rows.'
    );

    assert.deepEqual(
        modifiedTable.toJSON(),
        tableJSON,
        'JSON of filtered table should be equal to original JSON.'
    );

});
