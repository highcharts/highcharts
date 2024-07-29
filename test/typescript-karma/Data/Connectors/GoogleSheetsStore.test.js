
import GoogleSheetsConnector from '/base/code/es-modules/Data/Connectors/GoogleSheetsConnector.js'
import { registerConnectorEvents } from './utils.js'
import GoogleSheetsConverter from '/base/code/es-modules/Data/Converters/GoogleSheetsConverter.js';
const { test, only } = QUnit;

test('GoogleDataConnector', (assert) => {
    const registeredEvents = [];

    const connector = new GoogleSheetsConnector({
        googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
        googleSpreadsheetKey: '1U17c4GljMWpgk1bcTvUzIuWT8vdOnlCBHTm5S8Jh8tw'
    });

    const done = assert.async(2); // event + promise

    registerConnectorEvents(connector, registeredEvents, assert);

    connector.on('afterLoad', (e) => {
        assert.deepEqual(
            registeredEvents,
            ['load', 'afterLoad'],
            'Events are fired in the correct order'
        );

        assert.deepEqual(
            e.table.getRow(1).map(cellValue => typeof cellValue),
            ['string', 'number', 'number', 'number'],
            'The connector table has the correct data types'
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

    connector
        .load()
        .catch((error) => assert.strictEqual(
            error,
            null,
            'Test should not fail.'
        ))
        .then(() => done())
});

test('GoogleDataConnector, bad spreadsheetkey', function (assert) {
    const registeredEvents = [];

    const connector = new GoogleSheetsConnector({
        googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
        googleSpreadsheetKey: 'thisisnotaworkingspreadsheet'
    });

    const done = assert.async(2); // event + promise

    registerConnectorEvents(connector, registeredEvents, assert);

    connector.on('loadError', (error) => {
        assert.deepEqual(
            registeredEvents,
            ['load', 'loadError'],
            'Errors after firing load event'
        );

        done();
    });

    connector
        .load()
        .catch((error) => assert.strictEqual(
            error.message,
            'Requests from referer http://localhost:9876/ are blocked.',
            'Test should fail.'
        ))
        .then(() => done());
});

test('GoogleDataConnector with beforeParse', async (assert) => {
    const registeredEvents = [];
    let beforeParseFired = false;

    const connector = new GoogleSheetsConnector({
        googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
        googleSpreadsheetKey: '1U17c4GljMWpgk1bcTvUzIuWT8vdOnlCBHTm5S8Jh8tw',
        firstRowAsNames: true,
        beforeParse: data => {
            beforeParseFired = true;
            for (let i = 0; i < data.length; i++) {
                const row = data[i];
                row[0] = 'Test' + i;
            }
            return data;
        }
    });

    const done = assert.async(2); // event + promise

    // Test data converter event
    const converter = connector.converter;
    converter.on('afterParse', (e) => {
        assert.equal(
            beforeParseFired,
            true,
            'beforeParse was fired'
        );
    });

    // Test after load event
    registerConnectorEvents(connector, registeredEvents, assert);

    connector.on('afterLoad', (e) => {
        assert.deepEqual(
            registeredEvents,
            ['load', 'afterLoad'],
            'Events are fired in the correct order'
        );

        assert.equal(
            beforeParseFired,
            true,
            'beforeParse was fired'
        );

        const columnNames = e.table.getColumnNames();
        assert.deepEqual(
            columnNames,
            ['Test0', 'Test1', 'Test2', 'Test3'],
            'The column names have been changed by the beforeParse function'
        );

        done();
    });

    connector
        .load()
        .catch((error) => assert.strictEqual(
            error,
            null,
            'Test should not fail.'
        ))
        .then(() => done())
});


test('GoogleDataConnector, worksheet 1', async (assert) => {
    const registeredEvents = [];

    const connector = new GoogleSheetsConnector({
        googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
        googleSpreadsheetKey: '1Z6vzR7EUZiqLBDZ66jf82rw5kvPBQHzmMLyY4miUVKA',
        googleSpreadsheetRange: 'Sheet1',
        firstRowAsNames: true
    });

    const done = assert.async(2); // event + promise

    // Test after load event
    registerConnectorEvents(connector, registeredEvents, assert);

    connector.on('afterLoad', (e) => {
        assert.deepEqual(
            registeredEvents,
            ['load', 'afterLoad'],
            'Events are fired in the correct order'
        );

        const columnNames = e.table.getColumnNames();
        assert.deepEqual(
            columnNames,
            ['0', 'John', 'Jane', 'Joe'],
            'Column names are correct'
        );

        const firstColumn = e.table.getColumn('0');
        assert.deepEqual(
            firstColumn,
            ['Apples', 'Oranges', 'Pears', 'Bananas'],
            'The first column has correct content'
        );

        done();
    });

    connector
        .load()
        .catch((error) => assert.strictEqual(
            error,
            null,
            'Test should not fail.'
        ))
        .then(() => done())
});


test('GoogleDataConnector, worksheet 2', async (assert) => {
    const registeredEvents = [];

    const connector = new GoogleSheetsConnector({
        googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
        googleSpreadsheetKey: '1Z6vzR7EUZiqLBDZ66jf82rw5kvPBQHzmMLyY4miUVKA',
        googleSpreadsheetRange: 'Sheet2',
        firstRowAsNames: true
    });

    const done = assert.async(2); // event + promise

    // Test after load event
    registerConnectorEvents(connector, registeredEvents, assert);

    connector.on('afterLoad', (e) => {
        assert.deepEqual(
            registeredEvents,
            ['load', 'afterLoad'],
            'Events are fired in the correct order'
        );

        const columnNames = e.table.getColumnNames();
        assert.deepEqual(
            columnNames,
            ['0', 'John', 'Jane', 'Joe'],
            'Column names are correct'
        );

        const firstColumn = e.table.getColumn('0');
        assert.deepEqual(
            firstColumn,
            ['Apricots', 'Melons', 'Papayas', 'Kiwis'],
            'The first column has content from sheet 2'
        );

        done();
    });

    connector
        .load()
        .catch((error) => assert.strictEqual(
            error,
            null,
            'Test should not fail.'
        ))
        .then(() => done())
});
