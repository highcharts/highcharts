import DataConverter from '/base/code/es-modules/Data/Converters/DataConverter.js';
import DataConverterHelper from '/base/code/es-modules/Dashboards/SerializeHelper/DataConverterHelper.js';

QUnit.test('JSON serializer for DataConverter', function (assert) {

    const converter = new DataConverter(
            {
                alternativeFormat: '@YY@mm@dd'
            },
            () => {
                console.log('Hello World!');
            }
        ),
        json = DataConverterHelper.toJSON(converter),
        converter2 = DataConverterHelper.fromJSON(json),
        json2 = DataConverterHelper.toJSON(converter2);

    assert.deepEqual(
        json.options,
        json2.options,
        'JSON should contain all option values.'
    );

    assert.equal(
        `${converter2.parseDateFn}`,
        `${converter.parseDateFn}`,
        'Deserialized parseDateFn should be equal.'
    );

    assert.deepEqual(
        json,
        json2,
        'Reserialized json should contain all values.'
    );

});
