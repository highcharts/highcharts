import DataStore from '/base/js/Data/Stores/DataStore.js';
import '/base/js/Data/Stores/CSVStore.js';
import '/base/js/Data/Stores/GoogleSheetsStore.js';
import '/base/js/Data/Stores/HTMLTableStore.js';

const { test, only } = QUnit;

test('DataStore metadata', function (assert) {
    const datastore = new DataStore();

    datastore.describeColumns({
        column1: {
            title: 'This is a title',
            dataType: 'string',
            defaultValue: 'banana'
        }
    });

    const description = datastore.whatIs('column1');
    const metadata = datastore.metadata;

    assert.ok(description, 'Managed to get `column1`');

    datastore.describeColumns(metadata.columns);

    assert.deepEqual(
        datastore.whatIs('column1'),
        description,
        'Importing exported metadata gives same result'
    );

    datastore.describeColumn('columnX', {
        title: 'Column X',
        dataType: 'number',
        defaultValue: -5
    });
    assert.ok(datastore.whatIs('columnX'), 'ColumnX was added');
    assert.ok(datastore.whatIs('column1'), 'Column1 is still there');

    datastore.setColumnOrder(['columnX', 'column1']);
    assert.deepEqual(
        [datastore.whatIs('columnX').index, datastore.whatIs('column1').index],
        [0, 1],
        'ColumnX should come before column1.'
    );
    assert.deepEqual(
        datastore.getColumnOrder(),
        ['columnX', 'column1'],
        'Column order should be descendent.'
    );
});

test('DataStore registry', function (assert) {
    // Todo: maybe empty the registry
    // before adding the stores back
    // DataStore.registry = {};

    const stores = ['CSVStore', 'HTMLTableStore', 'GoogleSheetsStore'];

    stores.forEach((store) => {
        assert.strictEqual(
            typeof DataStore.getStore(store),
            'function',
            `${store} is registered`
        );
    });
});
