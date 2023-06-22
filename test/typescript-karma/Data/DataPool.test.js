import DataPool from '/base/code/es-modules/Data/DataPool.js';


QUnit.test('DataPool', function (assert) {
    const dataPool = new DataPool();

    dataPool.setConnectorOptions({
        id: 'A',
        type: 'CSVConnector',
        options: {
            csvURL: 'https://domain.example/data.csv'
        }
    });

    dataPool.setConnectorOptions({
        id: 'B',
        type: 'CSVConnector',
        options: {
            csvURL: 'https://domain.example/data.csv'
        }
    });

    assert.deepEqual(
        dataPool.getConnectorIds(),
        ['A', 'B'],
        'The connectorsNames array should contain two elements, A and B.'
    );
});

QUnit.test('DataPool options', async function (assert) {
    const pool = new DataPool({
        connectors: [{
            id: 'CSV Test',
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

QUnit.test('DataPool events', async function (assert) {
    const connectorOptions = {
        type: 'CSV',
        id: 'my-connector',
        options: {
            csv: 'A,B\n1,2'
        }
    };
    const pool = new DataPool();

    let eventLog = [];

    function logEvent (e) {
        assert.strictEqual(
            this,
            pool,
            'Event scope should be the data pool.'
        );
        eventLog.push(e.type);
    };

    pool.on('load', logEvent);
    pool.on('afterLoad', logEvent);
    pool.on('setConnectorOptions', logEvent);
    pool.on('afterSetConnectorOptions', logEvent);

    pool.setConnectorOptions(connectorOptions);

    assert.deepEqual(
        eventLog,
        ['setConnectorOptions', 'afterSetConnectorOptions'],
        'Data pool should emit set events.'
    );

    eventLog.length = 0;

    await pool.getConnector('my-connector');

    assert.deepEqual(
        eventLog,
        ['load', 'afterLoad'],
        'Data pool should emit load events.'
    );

    eventLog.length = 0;

    pool.setConnectorOptions(connectorOptions);

    assert.deepEqual(
        eventLog,
        ['setConnectorOptions', 'afterSetConnectorOptions'],
        'Data pool should emit new set events.'
    );

});
