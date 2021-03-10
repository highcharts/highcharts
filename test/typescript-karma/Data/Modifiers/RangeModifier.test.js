import OldTownTable from '/base/js/Data/OldTownTable.js';
import OldTownTableRow from '/base/js/Data/OldTownTableRow.js';
import RangeModifier from '/base/js/Data/Modifiers/RangeModifier.js';

QUnit.test('RangeModifier.execute', function (assert) {

    const table = new OldTownTable([
            new OldTownTableRow({
                x: -2,
                y: 'a'
            }),
            new OldTownTableRow({
                x: -1,
                y: 'b'
            }),
            new OldTownTableRow({
                x: 0,
                y: 'c'
            }),
            new OldTownTableRow({
                x: 1,
                y: 'd'
            }),
            new OldTownTableRow({
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

});
