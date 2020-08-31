
import DataStore from '/base/js/Data/Stores/DataStore.js';
import '/base/js/Data/Stores/CSVStore.js';
import '/base/js/Data/Stores/GoogleSheetsStore.js';
import '/base/js/Data/Stores/HTMLTableStore.js';

const { test, only } = QUnit;

test('DataStore metadata', function (assert) {
    const datastore = new DataStore();

    datastore.describe([
        {
            name: 'column1',
            metadata: {
                dataType: String,
                title: 'This is a title',
                defaultValue: 'banana'
            }
        }
    ]);

    const description = datastore.whatIs('column1');
    const metaJSON = datastore.getMetadataJSON();

    assert.ok(description, 'Managed to get `column1`');
    datastore.describe([]); // Set metadata to empty array

    datastore.describe(DataStore.getMetadataFromJSON(metaJSON))

    assert.deepEqual(
        datastore.whatIs('column1',),
        description,
        'Importing exported metadata gives same result'
    );

    datastore.describeColumn(
        'columnX',
        { title: 'Column X', dataType: Number, defaultValue: -5 }
    );
    assert.ok(datastore.whatIs('columnX'), 'ColumnX was added');
    assert.ok(datastore.whatIs('column1'), 'Column1 is still there');

})

test('DataStore registry', function (assert) {
    // Todo: maybe empty the registry
    // before adding the stores back
    // DataStore.registry = {};

    const stores = [
        'CSVStore',
        'HTMLTableStore',
        'GoogleSheetsStore'
    ];

    stores.forEach(store => {
        assert.strictEqual(
            typeof DataStore.getStore(store),
            'function',
            `${store} is registered`
        )
   });

})