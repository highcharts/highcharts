import DataPool from '/base/code/es-modules/Data/DataPool.js';


QUnit.test('DataPool', function (assert) {
    const dataPool = new DataPool();

    dataPool.setConnectorOptions({
        name: 'A',
        type: 'CSVConnector',
        options: {
            csvURL: 'https://domain.example/data.csv'
        }
    });

    dataPool.setConnectorOptions({
        name: 'B',
        type: 'CSVConnector',
        options: {
            csvURL: 'https://domain.example/data.csv'
        }
    });

    assert.deepEqual(
        dataPool.getConnectorsNames(),
        ['A', 'B'],
        'The connectorsNames array should contain two elements, A and B.'
    );
});

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
