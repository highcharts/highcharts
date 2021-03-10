import OldTownTableRow from '/base/js/Data/OldTownTableRow.js';

QUnit.test('OldTownTableRow.clear', function (assert) {

    const row = new OldTownTableRow({
        cell1: 'value1',
        cell2: 'value2',
        cell3: 'value3'
    });

    row.clear();
    assert.strictEqual(
        row.getCellCount(),
        0,
        'Row count after clear should be zero.'
    );

});

QUnit.test('OldTownTableRow.NULL', function (assert) {

    const nullRow = OldTownTableRow.NULL,
        row = new OldTownTableRow({ id: 'NULL' });

    assert.strictEqual(
        nullRow,
        row,
        'Every null row should share the same OldTownTableRow.NULL instance.'
    );

});
