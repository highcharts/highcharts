import CSVConverterHelper from '/base/code/es-modules/Dashboards/SerializeHelper/CSVConverterHelper.js';
import CSVConverter from '/base/code/es-modules/Data/Converters/CSVConverter.js';

QUnit.test('JSON serializer for CSVConverter', function (assert) {

    let converter = new CSVConverter({
            csv: 'Date:Grade;\n24 May;5,8\n25 May;7,9\n15 July;8,1',
            decimalPoint: '.',
            itemDelimiter: ',',
            lineDelimiter: '\n'
        }),
        json = CSVConverterHelper.toJSON(converter),
        converter2 = CSVConverterHelper.fromJSON(json),
        json2 = CSVConverterHelper.toJSON(converter2);

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
