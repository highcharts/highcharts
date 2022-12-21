
import GoogleSheetsStore from '/base/code/es-modules/Data/Stores/GoogleSheetsStore.js'
import { registerStoreEvents } from './utils.js'
const { test, only } = QUnit;

test('GoogleDataStore', function (assert) {
    const registeredEvents = [];

    const datastore = new GoogleSheetsStore(undefined, {
        googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
        googleSpreadsheetKey: '1U17c4GljMWpgk1bcTvUzIuWT8vdOnlCBHTm5S8Jh8tw'
    });

    const done = assert.async(2); // event + promise

    registerStoreEvents(datastore, registeredEvents, assert);

    datastore.on('afterLoad', (e) => {
        assert.deepEqual(
            registeredEvents,
            ['load', 'afterLoad'],
            'Events are fired in the correct order'
        );

        assert.deepEqual(
            e.table.getRow(1).map(cellValue => typeof cellValue),
            ['string', 'number', 'number', 'number'],
            'The store table has the correct data types'
        );

        const columnNames = e.table.getColumnNames();

        assert.notOk(
            columnNames.includes('null'),
            'Columns where the first value is of type `null`, ' +
            'should be assigned an unique name'
        );

        e.table.renameColumn(columnNames[0], 'null');

        assert.ok(
            e.table.getColumnNames().includes('null'),
            'A string value of `null` is ok'
        );

        done();
    });

    datastore
        .load()
        .catch((error) => assert.strictEqual(
            error,
            null,
            'Test should not fail.'
        ))
        .then(() => done())
});

test('GoogleDataStore, bad spreadsheetkey', function (assert) {
    const registeredEvents = [];

    const datastore = new GoogleSheetsStore(undefined, {
        googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
        googleSpreadsheetKey: 'thisisnotaworkingspreadsheet'
    });

    const done = assert.async(2); // event + promise

    registerStoreEvents(datastore, registeredEvents, assert);

    datastore.on('loadError', (error) => {
        assert.deepEqual(
            registeredEvents,
            ['load', 'loadError'],
            'Errors after firing load event'
        );

        done();
    });

    datastore
        .load()
        .catch((error) => assert.strictEqual(
            error.message,
            'Requests from referer http://localhost:9876/ are blocked.',
            'Test should fail.'
        ))
        .then(() => done());
});
