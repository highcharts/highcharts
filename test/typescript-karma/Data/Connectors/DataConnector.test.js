
import DataConnector from '/base/code/es-modules/Data/Connectors/DataConnector.js';
import CSVConnector from '/base/code/es-modules/Data/Connectors/CSVConnector.js';
import '/base/code/es-modules/Data/Connectors/GoogleSheetsConnector.js';
import '/base/code/es-modules/Data/Connectors/HTMLTableConnector.js';

const { test } = QUnit;

test('DataConnector metadata', function (assert) {
    const connector = new CSVConnector();
    const columns = connector.metadata.columns;

    connector.describeColumns({
        'column1': {
            title: 'This is a title',
            dataType: 'string',
            defaultValue: 'banana'
        }
    });

    const description = columns['column1'];
    const metadata = connector.metadata;

    assert.ok(description, 'Managed to get `column1`');

    connector.describeColumns(metadata.columns)

    assert.deepEqual(
        columns['column1'],
        description,
        'Importing exported metadata gives same result'
    );

    connector.describeColumn(
        'columnX',
        { title: 'Column X', dataType: 'number', defaultValue: -5 }
    );
    assert.ok(columns['columnX'], 'ColumnX was added');
    assert.ok(columns['column1'], 'Column1 is still there');

    connector.setColumnOrder(['columnX', 'column1']);
    assert.deepEqual(
        [columns['columnX'].index, columns['column1'].index],
        [0, 1],
        'ColumnX should come before column1.'
    );
    assert.deepEqual(
        connector.getColumnOrder(),
        ['columnX', 'column1'],
        'Column order should be descendent.'
    );

});

test('DataConnector registry', function (assert) {
    const connectors = [
        'CSV',
        'HTMLTable',
        'GoogleSheets'
    ];

    for (const connector of connectors) {
        assert.strictEqual(
            typeof DataConnector.types[connector],
            'function',
            `${connector} is registered`
        )
    }

});
