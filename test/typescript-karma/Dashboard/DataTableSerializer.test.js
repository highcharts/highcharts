import DataTable from '//base/js/Data/DataTable.js';
import DataTableSerializer from '/base/js/Dashboard/DataTableSerializer.js';

QUnit.test('JSON serializer for DataTable', function (assert) {

    const customID = 'myCustomID',
        table = new DataTable(
            {
                values: [
                    null,
                    void 0,
                    NaN,
                    1,
                    '',
                    'a',
                    new DataTable({
                        works: [true]
                    })
                ]
            },
            customID
        ),
        columns = table.getColumns(),
        json = DataTableSerializer.toJSON(table),
        table2 = DataTableSerializer.fromJSON(json);

    // columns

    assert.deepEqual(
        json.columns,
        columns,
        'JSON should contain all columns.'
    );

    assert.deepEqual(
        table2.getColumns(),
        columns,
        'Deserialized table should contain all columns.'
    );

    // custom id

    assert.strictEqual(
        json.id,
        customID,
        'JSON should contain custom id.'
    );

    assert.strictEqual(
        table2.id,
        customID,
        'Deserialized table should contain custom id.'
    );

    // sub table

    assert.strictEqual(
        table2.getCell('values', 6),
        column[6],
        'Sub table should be deserialized.'
    );

    assert.strictEqual(
        table2.getCell('values', 6).getCell('works', 0),
        true,
        'Sub table should contain one boolean cell.'
    );

});
