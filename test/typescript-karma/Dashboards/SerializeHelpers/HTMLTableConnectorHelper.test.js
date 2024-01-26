import HTMLTableConnector from '/base/code/es-modules/Data/Connectors/HTMLTableConnector.js';
import HTMLTableConnectorHelper from '/base/code/dashboards/es-modules/Dashboards/SerializeHelper/HTMLTableConnectorHelper.js';

QUnit.test('JSON serializer for HTMLTableConnector', function (assert) {

    let converter = new HTMLTableConnector({
            decimalPoint: '.',
            exportIDColumn: true,
            useRowspanHeaders: false,
            useLocalDecimalPoint: false,
        }),
        json = HTMLTableConnectorHelper.toJSON(converter),
        converter2 = HTMLTableConnectorHelper.fromJSON(json),
        json2 = HTMLTableConnectorHelper.toJSON(converter2);

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
