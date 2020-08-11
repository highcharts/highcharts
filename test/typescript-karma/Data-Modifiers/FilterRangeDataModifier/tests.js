import DataTable from '/base/js/Data/DataTable.js';
import RangeDataModifier from '/base/js/Data/Modifiers/RangeDataModifier.js';

QUnit.test('RangeDataModifier.execute', function (assert) {

    const tableJSON = {
            $class: 'DataTable',
            rows: [{
                $class: 'DataRow',
                x: -2,
                y: 'a'
            }, {
                $class: 'DataRow',
                x: -1,
                y: 'b'
            }, {
                $class: 'DataRow',
                x: 0,
                y: 'c'
            }, {
                $class: 'DataRow',
                x: 1,
                y: 'd'
            }, {
                $class: 'DataRow',
                x: 2,
                y: 'e'
            }]
        },
        table = DataTable.fromJSON(tableJSON),
        modifier = new RangeDataModifier({}),
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
