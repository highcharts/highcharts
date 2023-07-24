import CSVConnector from '/base/code/es-modules/Data/Connectors/CSVConnector.js';
import CSVConnectorHelper from '/base/code/dashboards/es-modules/Dashboards/SerializeHelper/CSVConnectorHelper.js';

QUnit.test('JSON serializer for CSVConnector', function (assert) {

    let converter = new CSVConnector({
            csv: 'Date:Grade;\n24 May;5,8\n25 May;7,9\n15 July;8,1',
            decimalPoint: '.',
            itemDelimiter: ',',
            lineDelimiter: '\n'
        }),
        json = CSVConnectorHelper.toJSON(converter),
        converter2 = CSVConnectorHelper.fromJSON(json),
        json2 = CSVConnectorHelper.toJSON(converter2);

    assert.deepEqual(
        json.options,
        json2.options,
        'JSON should contain all option values.'
    );

    assert.deepEqual(
        json,
        json2,
        'Reserialized json should contain all values.'
    );
});
