import DataTable from '/base/code/es-modules/Data/DataTable.js';
import DataTableHelper from '/base/code/es-modules/Dashboard/SerializeHelper/DataTableHelper.js';
import CSVConverter from '/base/code/es-modules/Data/Converters/CSVConverter.js';

QUnit.skip('JSON serializer for CSVConverter', function (assert) {

        let converter = new CSVConverter({
                csv: 'Date:Grade;\n24 May;5,8\n25 May;7,9\n15 July;8,1',
                decimalPoint: '.',
                itemDelimiter: ',',
                lineDelimiter: '\n'
            }),
            json = DataTableHelper.toJSON(converter),
            converter2 = DataTableHelper.fromJSON(json),
            json2 = DataTableHelper.toJSON(converter2);


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
