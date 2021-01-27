import DataTable from '/base/js/Data/DataTable.js';
import RangeModifier from '/base/js/Data/Modifiers/RangeDataModifier.js';

QUnit.test('RangeModifier.execute', function (assert) {

    const table = new DataTable([
            new DataTableRow({
                x: -2,
                y: 'a'
            }),
            new DataTableRow({
                x: -1,
                y: 'b'
            }),
            new DataTableRow({
                x: 0,
                y: 'c'
            }),
            new DataTableRow({
                x: 1,
                y: 'd'
            }),
            new DataTableRow({
                x: 2,
                y: 'e'
            })
        ]),
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
