import JSONConnector from '/base/code/es-modules/Data/Connectors/JSONConnector.js';
import JSONConnectorHelper from '/base/code/dashboards/es-modules/Dashboards/SerializeHelper/JSONConnectorHelper.js';

QUnit.test('JSON serializer for JSONConnector', function (assert) {

    let converter = new JSONConnector({
            data: [
                [1, 2, 3],
                [4, 5, 6]
            ]
        }),
        json = JSONConnectorHelper.toJSON(converter),
        converter2 = JSONConnectorHelper.fromJSON(json),
        json2 = JSONConnectorHelper.toJSON(converter2);

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
