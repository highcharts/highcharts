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

QUnit.test('DataPool events', async function (assert) {
    const connectorOptions = {
        type: 'CSV',
        id: 'my-connector',
        options: {
            csv: 'A,B\n1,2'
        }
    };
    const dataPool = new DataPool();

    let eventLog = [];

    function logEvent (e) {
        assert.strictEqual(
            this,
            dataPool,
            'Event scope should be the data pool.'
        );
        eventLog.push(e.type);
    };

    dataPool.on('load', logEvent);
    dataPool.on('afterLoad', logEvent);
    dataPool.on('setConnectorOptions', logEvent);
    dataPool.on('afterSetConnectorOptions', logEvent);

    dataPool.setConnectorOptions(connectorOptions);

    assert.deepEqual(
        eventLog,
        ['setConnectorOptions', 'afterSetConnectorOptions'],
        'Data pool should emit set events.'
    );

    eventLog.length = 0;

    await dataPool.getConnector('my-connector');

    assert.deepEqual(
        eventLog,
        ['load', 'afterLoad'],
        'Data pool should emit load events.'
    );

    eventLog.length = 0;

    dataPool.setConnectorOptions(connectorOptions);

    assert.deepEqual(
        eventLog,
        ['setConnectorOptions', 'afterSetConnectorOptions'],
        'Data pool should emit new set events.'
    );

});

QUnit.test('DataPool promises', async function (assert) {
    const dataPool = new DataPool({
        connectors: [{
            id: 'My Data',
            type: 'CSV',
            options: {
                csv: 'a,b,c\n1,2,3\n4,5,6\n7,8,9',
                dataModifier: {
                    type: 'Chain',
                    chain: [{
                        type: 'Chain',
                        chain: [{
                            type: 'Range',
                            ranges: [{
                                column: 'a',
                                minValue: 1,
                                maxValue: 7
                            }]
                        }]
                    }]
                }
            }
        }]
    });

    let firstLoadingDone = false;

    /* first no await */
    dataPool
        .getConnector('My Data')
        .then(() => firstLoadingDone = true);

    /* second time await */
    await dataPool.getConnector('My Data');

    assert.ok(
        firstLoadingDone,
        'DataPool should resolve second connector request after first one.'
    );

});

QUnit.test('DataPool replacement', async function (assert) {
    const dataPool = new DataPool({
        connectors: [{
            id: 'My Data',
            type: 'CSV',
            options: {
                csv: 'a,b,c\n1,2,3\n4,5,6\n7,8,9'
            }
        }]
    });

    assert.ok(
        dataPool.isNewConnector('My Data'),
        'DataPool connector should be new.'
    );

    const firstConnector = await dataPool.getConnector('My Data');

    assert.notOk(
        dataPool.isNewConnector('My Data'),
        'DataPool connector should be not new anymore.'
    );

    dataPool.setConnectorOptions({
        id: 'My Data',
        type: 'JSON',
        options: {
            columns: ['a', 'b', 'c'],
            data: [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
        }
    });

    assert.ok(
        dataPool.isNewConnector('My Data'),
        'DataPool connector should be new again.'
    );

    const secondConnector = await dataPool.getConnector('My Data');

    assert.notOk(
        dataPool.isNewConnector('My Data'),
        'DataPool connector should be not new anymore.'
    );

    assert.notEqual(
        firstConnector,
        secondConnector,
        'DataPool connectors should not be equal.'
    );

});
