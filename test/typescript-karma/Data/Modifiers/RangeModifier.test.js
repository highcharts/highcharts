import DataTable from '/base/js/Data/DataTable.js';
import RangeModifier from '/base/js/Data/Modifiers/RangeModifier.js';

QUnit.test('RangeModifier.execute', function (assert) {

    const table = new DataTable({
        x: [ -2, -1, 0, 1, 2 ],
        y: [ 'a', 'b', 'c', 'd', 'e' ]
    });

    let modifier = new RangeModifier({});

    assert.deepEqual(
        modifier.modify(table).getRow(0),
        table.getRow(0),
        'Filtered table should contain same rows.'
    );

    modifier = new RangeModifier({
        ranges: [{
            column: 'y',
            minValue: 'A',
            maxValue: 'b'
        }]
    });

    assert.deepEqual(
        modifier.modify(table).getColumns(),
        {
            x: [ -2, -1 ],
            y: [ 'a', 'b' ]
        },
        'Filtered table should contain reduced number of rows.'
    );

});
