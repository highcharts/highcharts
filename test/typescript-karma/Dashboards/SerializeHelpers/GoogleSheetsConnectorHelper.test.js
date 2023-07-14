import GoogleSheetsConnector from '/base/code/es-modules/Data/Connectors/GoogleSheetsConnector.js';
import GoogleSheetsConnectorHelper from '/base/code/dashboards/es-modules/Dashboards/SerializeHelper/GoogleSheetsConnectorHelper.js';

QUnit.test('JSON serializer for GoogleSheetsConverter', function (assert) {

        let converter = new GoogleSheetsConnector({
                json: {
                    values: []
                }
            }),
            json = GoogleSheetsConnectorHelper.toJSON(converter),
            converter2 = GoogleSheetsConnectorHelper.fromJSON(json),
            json2 = GoogleSheetsConnectorHelper.toJSON(converter2);


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
