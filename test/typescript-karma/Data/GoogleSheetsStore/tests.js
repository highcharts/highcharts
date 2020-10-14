
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

        const cells = e.table.getRow(1).getAllCells();
        assert.deepEqual(
            Object.values(cells).map(cellValue => typeof cellValue),
            ['string', 'number', 'number', 'number'],
            'The store table has the correct data types'
        )

        assert.notOk(
            e.table.getRow(1).getCellNames().includes('null'),
            'Columns where the first value is of type `null`, should be assigned an unique name'
        )
        e.table.getRow(1).insertCell('null');
        assert.ok(
            e.table.getRow(1).getCellNames().includes('null'),
            'A string value of `null` is ok'
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