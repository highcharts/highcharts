import DataTableRow from '/base/js/Data/DataTableRow.js';

QUnit.test('DataTableRow.clear', function (assert) {

    const row = new DataTableRow({
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

QUnit.test('DataTableRow.NULL', function (assert) {

    const nullRow = DataTableRow.NULL,
        row = new DataTableRow({ id: 'NULL' });

    assert.strictEqual(
        nullRow,
        row,
        'Every null row should share the same DataTableRow.NULL instance.'
    );

});
