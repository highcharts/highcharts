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

    console.log(dataPool.getConnectorsNames());

    assert.deepEqual(
        dataPool.getConnectorsNames(),
        ['A', 'B'],
        'The connectorsNames array should contain two elements, A and B.'
    );
});