import JSONConnector from '/base/code/es-modules/Data/Connectors/JSONConnector.js';

const { test } = QUnit;

const rows = [
    ['id', 'weight', 'age'],
    [1, 88, 30],
    [2, 58, 25],
    [3, 78, 20]
],
    columns = [
        [1, 2, 3, 4],
        [3, 4, 3, 4],
        [3, 4, 3, 4]
    ],
columnNames = ['id', 'weight', 'age'];

test('JSONConnector from rows', async (assert) => {
    const connector = new JSONConnector({ data: rows });
    await connector.load();

    assert.deepEqual(
        connector.table.getRowCount(),
        rows.length - 1,
        'Should have the same amount of rows'
    );
    assert.deepEqual(
        connector.table.getColumnNames(),
        rows[0],
        'Should have correct column Names'
    );
});

test('JSONConnector from columns', async (assert) => {
    const connector = new JSONConnector({
        orientation: 'columns',
        columnNames: ['id', 'weight', 'age'],
        firstRowAsNames: false,
        data: columns
    });
    await connector.load();

    assert.deepEqual(
        connector.table.getRowCount(),
        columns[0].length,
        'Should have the same amount of rows'
    );
    assert.deepEqual(
        connector.table.getColumnNames(),
        columnNames,
        'Should have correct column Names'
    );
});

test('JSONConnector from objects', async (assert) => {
    const data = [{
            id: 1,
            weight: 88,
            age: 30
        }, {
            id: 2,
            weight: 58,
            age: 25
        }, {
            id: 3,
            weight: 78,
            age: 20
        }, {
            id: 4,
            weight: 98,
            age: 35
        }];
    const connector = new JSONConnector({
        firstRowAsNames: false,
        data
    });
    await connector.load();

    assert.deepEqual(
        connector.table.getRowCount(),
        data.length,
        'Should have the same amount of rows'
    );
    assert.deepEqual(
        connector.table.getColumnNames(),
        columnNames,
        'Should have correct column Names'
    );
});