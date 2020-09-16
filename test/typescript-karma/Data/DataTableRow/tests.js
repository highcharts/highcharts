import DataTableRow from '/base/js/Data/DataTableRow.js';

QUnit.test('DataTableRow functions', function (assert) {

    const row = new DataTableRow({
        cell1: 'value1',
        cell2: 'value2',
        cell3: 'value3'
    });

    // DataTableRow.clear()

    row.clear();
    assert.equal(
        row.getCellCount(),
        0,
        'Row count after clear should be zero.'
    );

});
