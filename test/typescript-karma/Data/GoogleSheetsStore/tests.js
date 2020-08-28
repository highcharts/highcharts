
import GoogleSheetsStore from '/base/js/Data/Stores/GoogleSheetsStore.js'
import { registerStoreEvents } from '../utils.js'
const { test, only } = QUnit;

test('GoogleDataStore', function (assert) {
    const registeredEvents = [];

    const datastore = new GoogleSheetsStore(undefined, { googleSpreadsheetKey: '0AoIaUO7wH1HwdENPcGVEVkxfUDJkMmFBcXMzOVVPdHc' });

    const doneLoading = assert.async();

    registerStoreEvents(datastore, registeredEvents, assert);

    datastore.on('afterLoad', (e) => {
        assert.deepEqual(
            registeredEvents,
            ['load', 'afterLoad'],
            'Events are fired in the correct order'
        )
        doneLoading();
    });

    datastore.load()
})

test('GoogleDataStore, bad spreadsheetkey', function (assert) {
    const registeredEvents = [];

    const datastore = new GoogleSheetsStore(undefined, { googleSpreadsheetKey: 'thisisnotaworkingspreadsheet' });

    const hasErrored = assert.async();

    registerStoreEvents(datastore, registeredEvents, assert);

    datastore.on('loadError', (e) => {
        assert.deepEqual(
            registeredEvents,
            ['load', 'loadError'],
            'Errors after firing load event'
        );

        hasErrored();
    });

    datastore.load()
})