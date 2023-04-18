import DataPool from '/base/code/es-modules/Data/DataPool.js';

QUnit.test('DataPool options', async function (assert) {
    const pool = new DataPool({
        connectors: [{
            name: 'CSV Test',
            type: 'CSV',
            options: {
                csv: 'y,z\n4,5\n6,7\n8,9',
                dataTable: {
                    columns: {
                        x: [1, 2, 3]
                    }
                }
            }
        }]
    });

    const csvTable = await pool.getConnectorTable('CSV Test');

    assert.deepEqual(
        csvTable.getColumnNames(),
        ['x', 'y', 'z'],
        'Table columns should be merged.'
    );
});
