import GoogleSheetsConverterHelper from '/base/code/es-modules/Dashboards/SerializeHelper/GoogleSheetsConverterHelper.js';
import GoogleSheetsConverter from '/base/code/es-modules/Data/Converters/GoogleSheetsConverter.js';

QUnit.test('JSON serializer for GoogleSheetsConverter', function (assert) {

        let converter = new GoogleSheetsConverter({
                json: {
                    values: []
                }
            }),
            json = GoogleSheetsConverterHelper.toJSON(converter),
            converter2 = GoogleSheetsConverterHelper.fromJSON(json),
            json2 = GoogleSheetsConverterHelper.toJSON(converter2);


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
