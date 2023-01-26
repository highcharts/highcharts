import HTMLTableConverterHelper from '/base/code/es-modules/Dashboards/SerializeHelper/HTMLTableConverterHelper.js';
import HTMLTableConverter from '/base/code/es-modules/Data/Converters/HTMLTableConverter.js';

QUnit.test('JSON serializer for HTMLTableConverter', function (assert) {

    let converter = new HTMLTableConverter({
            decimalPoint: '.',
            exportIDColumn: true,
            useRowspanHeaders: false,
            useLocalDecimalPoint: false,
        }),
        json = HTMLTableConverterHelper.toJSON(converter),
        converter2 = HTMLTableConverterHelper.fromJSON(json),
        json2 = HTMLTableConverterHelper.toJSON(converter2);

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
