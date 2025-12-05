import { test, expect } from '../fixtures.ts';

/**
 * Equivalent of test/typescript-karma/Data/Connectors/GoogleSheetsStore.test.js
 * 
 * This test mocks the Google Sheets API to avoid external dependencies
 * and allow reliable testing of the GoogleSheetsConnector.
 */

// Mock response for spreadsheet 1U17c4GljMWpgk1bcTvUzIuWT8vdOnlCBHTm5S8Jh8tw
// Format: majorDimension COLUMNS means each inner array is a column
const mockSpreadsheet1 = {
    majorDimension: 'COLUMNS',
    values: [
        ['Product', 'Apples', 'Pears', 'Plums', 'Bananas'],      // Column 0 (strings)
        ['Price', 1.5, 2.53, 5, 4.5],                             // Column 1 (numbers)
        ['Weight', 100, 40, 0.5, 200],                            // Column 2 (numbers)
        ['Stock', 50, 30, 20, 80]                                 // Column 3 (numbers)
    ]
};

// Mock response for spreadsheet 1Z6vzR7EUZiqLBDZ66jf82rw5kvPBQHzmMLyY4miUVKA Sheet1
const mockSpreadsheetSheet1 = {
    majorDimension: 'COLUMNS',
    values: [
        ['0', 'Apples', 'Oranges', 'Pears', 'Bananas'],
        ['John', 3, 4, 2, 5],
        ['Jane', 2, 3, 4, 1],
        ['Joe', 5, 2, 1, 3]
    ]
};

// Mock response for spreadsheet 1Z6vzR7EUZiqLBDZ66jf82rw5kvPBQHzmMLyY4miUVKA Sheet2
const mockSpreadsheetSheet2 = {
    majorDimension: 'COLUMNS',
    values: [
        ['0', 'Apricots', 'Melons', 'Papayas', 'Kiwis'],
        ['John', 1, 2, 3, 4],
        ['Jane', 4, 3, 2, 1],
        ['Joe', 2, 4, 1, 3]
    ]
};

// Mock error response for invalid spreadsheet
const mockErrorResponse = {
    error: {
        code: 403,
        message: 'Requests from referer http://localhost:9876/ are blocked.',
        status: 'PERMISSION_DENIED'
    }
};

test.describe('GoogleSheetsConnector', () => {

    test('GoogleSheetsConnector loads data with correct types', async ({ page }) => {
        // Set up route interception for Google Sheets API
        await page.route('**/sheets.googleapis.com/**', async (route) => {
            const url = route.request().url();
            
            if (url.includes('1U17c4GljMWpgk1bcTvUzIuWT8vdOnlCBHTm5S8Jh8tw')) {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockSpreadsheet1)
                });
            } else {
                await route.continue();
            }
        });

        await page.setContent(`
            <!DOCTYPE html>
            <html>
                <head>
                    <script src="https://code.highcharts.com/highcharts.src.js"></script>
                    <script src="https://code.highcharts.com/modules/data-tools.src.js"></script>
                </head>
                <body></body>
            </html>
        `, { waitUntil: 'networkidle' });

        const result = await page.evaluate(async () => {
            const Highcharts = (window as any).Highcharts;
            const GoogleSheetsConnector = Highcharts
                .DataConnector.types.GoogleSheets;

            const registeredEvents: string[] = [];
            
            const connector = new GoogleSheetsConnector({
                googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
                googleSpreadsheetKey: '1U17c4GljMWpgk1bcTvUzIuWT8vdOnlCBHTm5S8Jh8tw'
            });

            // Register events
            ['afterLoad', 'load', 'loadError'].forEach(eventType => {
                connector.on(eventType, (e: any) => {
                    registeredEvents.push(e.type);
                });
            });

            await connector.load();

            const table = connector.getTable();
            const row1 = table.getRow(1);
            const columnIds = table.getColumnIds();

            return {
                events: registeredEvents,
                row1Types: row1?.map((cellValue: any) => typeof cellValue),
                hasNullColumn: columnIds.includes('null'),
                columnIds
            };
        });

        expect(result.events).toStrictEqual(['load', 'afterLoad']);
        expect(result.row1Types).toStrictEqual(['string', 'number', 'number', 'number']);
        expect(result.hasNullColumn).toBe(false);
    });

    test('GoogleSheetsConnector handles bad spreadsheet key with error', async ({ page }) => {
        // Set up route interception to return error for bad key
        await page.route('**/sheets.googleapis.com/**', async (route) => {
            const url = route.request().url();
            
            if (url.includes('thisisnotaworkingspreadsheet')) {
                await route.fulfill({
                    status: 403,
                    contentType: 'application/json',
                    body: JSON.stringify(mockErrorResponse)
                });
            } else {
                await route.continue();
            }
        });

        await page.setContent(`
            <!DOCTYPE html>
            <html>
                <head>
                    <script src="https://code.highcharts.com/highcharts.src.js"></script>
                    <script src="https://code.highcharts.com/modules/data-tools.src.js"></script>
                </head>
                <body></body>
            </html>
        `, { waitUntil: 'networkidle' });

        const result = await page.evaluate(async () => {
            const Highcharts = (window as any).Highcharts;
            const GoogleSheetsConnector = 
                Highcharts.DataConnector.types.GoogleSheets;

            const registeredEvents: string[] = [];
            
            const connector = new GoogleSheetsConnector({
                googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
                googleSpreadsheetKey: 'thisisnotaworkingspreadsheet'
            });

            // Register events
            ['afterLoad', 'load', 'loadError'].forEach(eventType => {
                connector.on(eventType, (e: any) => {
                    registeredEvents.push(e.type);
                });
            });

            let errorMessage = '';
            try {
                await connector.load();
            } catch (error: any) {
                errorMessage = error.message;
            }

            return {
                events: registeredEvents,
                errorMessage
            };
        });

        expect(result.events).toStrictEqual(['load', 'loadError']);
        expect(result.errorMessage).toBe('Requests from referer http://localhost:9876/ are blocked.');
    });

    test('GoogleSheetsConnector with beforeParse callback', async ({ page }) => {
        // Set up route interception for Google Sheets API
        await page.route('**/sheets.googleapis.com/**', async (route) => {
            const url = route.request().url();
            
            if (url.includes('1U17c4GljMWpgk1bcTvUzIuWT8vdOnlCBHTm5S8Jh8tw')) {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockSpreadsheet1)
                });
            } else {
                await route.continue();
            }
        });

        await page.setContent(`
            <!DOCTYPE html>
            <html>
                <head>
                    <script src="https://code.highcharts.com/highcharts.src.js"></script>
                    <script src="https://code.highcharts.com/modules/data-tools.src.js"></script>
                </head>
                <body></body>
            </html>
        `, { waitUntil: 'networkidle' });

        const result = await page.evaluate(async () => {
            const Highcharts = (window as any).Highcharts;
            const GoogleSheetsConnector = 
                Highcharts.DataConnector.types.GoogleSheets;

            const registeredEvents: string[] = [];
            let beforeParseFired = false;
            
            const connector = new GoogleSheetsConnector({
                googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
                googleSpreadsheetKey: '1U17c4GljMWpgk1bcTvUzIuWT8vdOnlCBHTm5S8Jh8tw',
                firstRowAsNames: true,
                beforeParse: (data: any[][]) => {
                    beforeParseFired = true;
                    for (let i = 0; i < data.length; i++) {
                        const row = data[i];
                        row[0] = 'Test' + i;
                    }
                    return data;
                }
            });

            // Register events
            ['afterLoad', 'load', 'loadError'].forEach(eventType => {
                connector.on(eventType, (e: any) => {
                    registeredEvents.push(e.type);
                });
            });

            await connector.load();

            const columnIds = connector.getTable().getColumnIds();

            return {
                events: registeredEvents,
                beforeParseFired,
                columnIds
            };
        });

        expect(result.events).toStrictEqual(['load', 'afterLoad']);
        expect(result.beforeParseFired).toBe(true);
        expect(result.columnIds).toStrictEqual(['Test0', 'Test1', 'Test2', 'Test3']);
    });

    test('GoogleSheetsConnector with worksheet 1 (Sheet1)', async ({ page }) => {
        // Set up route interception for Google Sheets API
        await page.route('**/sheets.googleapis.com/**', async (route) => {
            const url = route.request().url();
            
            if (url.includes('1Z6vzR7EUZiqLBDZ66jf82rw5kvPBQHzmMLyY4miUVKA') && 
                url.includes('Sheet1')) {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockSpreadsheetSheet1)
                });
            } else {
                await route.continue();
            }
        });

        await page.setContent(`
            <!DOCTYPE html>
            <html>
                <head>
                    <script src="https://code.highcharts.com/highcharts.src.js"></script>
                    <script src="https://code.highcharts.com/modules/data-tools.src.js"></script>
                </head>
                <body></body>
            </html>
        `, { waitUntil: 'networkidle' });

        const result = await page.evaluate(async () => {
            const Highcharts = (window as any).Highcharts;
            const GoogleSheetsConnector = 
                Highcharts.DataConnector.types.GoogleSheets;

            const registeredEvents: string[] = [];
            
            const connector = new GoogleSheetsConnector({
                googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
                googleSpreadsheetKey: '1Z6vzR7EUZiqLBDZ66jf82rw5kvPBQHzmMLyY4miUVKA',
                googleSpreadsheetRange: 'Sheet1',
                firstRowAsNames: true
            });

            // Register events
            ['afterLoad', 'load', 'loadError'].forEach(eventType => {
                connector.on(eventType, (e: any) => {
                    registeredEvents.push(e.type);
                });
            });

            await connector.load();

            const table = connector.getTable();
            const columnIds = table.getColumnIds();
            const firstColumn = table.getColumn('0');

            return {
                events: registeredEvents,
                columnIds,
                firstColumn
            };
        });

        expect(result.events).toStrictEqual(['load', 'afterLoad']);
        expect(result.columnIds).toStrictEqual(['0', 'John', 'Jane', 'Joe']);
        expect(result.firstColumn).toStrictEqual(['Apples', 'Oranges', 'Pears', 'Bananas']);
    });

    test('GoogleSheetsConnector with worksheet 2 (Sheet2)', async ({ page }) => {
        // Set up route interception for Google Sheets API
        await page.route('**/sheets.googleapis.com/**', async (route) => {
            const url = route.request().url();
            
            if (url.includes('1Z6vzR7EUZiqLBDZ66jf82rw5kvPBQHzmMLyY4miUVKA') && 
                url.includes('Sheet2')) {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockSpreadsheetSheet2)
                });
            } else {
                await route.continue();
            }
        });

        await page.setContent(`
            <!DOCTYPE html>
            <html>
                <head>
                    <script src="https://code.highcharts.com/highcharts.src.js"></script>
                    <script src="https://code.highcharts.com/modules/data-tools.src.js"></script>
                </head>
                <body></body>
            </html>
        `, { waitUntil: 'networkidle' });

        const result = await page.evaluate(async () => {
            const Highcharts = (window as any).Highcharts;
            const GoogleSheetsConnector = 
                Highcharts.DataConnector.types.GoogleSheets;

            const registeredEvents: string[] = [];
            
            const connector = new GoogleSheetsConnector({
                googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
                googleSpreadsheetKey: '1Z6vzR7EUZiqLBDZ66jf82rw5kvPBQHzmMLyY4miUVKA',
                googleSpreadsheetRange: 'Sheet2',
                firstRowAsNames: true
            });

            // Register events
            ['afterLoad', 'load', 'loadError'].forEach(eventType => {
                connector.on(eventType, (e: any) => {
                    registeredEvents.push(e.type);
                });
            });

            await connector.load();

            const table = connector.getTable();
            const columnIds = table.getColumnIds();
            const firstColumn = table.getColumn('0');

            return {
                events: registeredEvents,
                columnIds,
                firstColumn
            };
        });

        expect(result.events).toStrictEqual(['load', 'afterLoad']);
        expect(result.columnIds).toStrictEqual(['0', 'John', 'Jane', 'Joe']);
        expect(result.firstColumn).toStrictEqual(['Apricots', 'Melons', 'Papayas', 'Kiwis']);
    });

    test('GoogleSheetsConnector column ID handling for null values', async ({ page }) => {
        // Set up route interception for Google Sheets API
        await page.route('**/sheets.googleapis.com/**', async (route) => {
            const url = route.request().url();
            
            if (url.includes('1U17c4GljMWpgk1bcTvUzIuWT8vdOnlCBHTm5S8Jh8tw')) {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockSpreadsheet1)
                });
            } else {
                await route.continue();
            }
        });

        await page.setContent(`
            <!DOCTYPE html>
            <html>
                <head>
                    <script src="https://code.highcharts.com/highcharts.src.js"></script>
                    <script src="https://code.highcharts.com/modules/data-tools.src.js"></script>
                </head>
                <body></body>
            </html>
        `, { waitUntil: 'networkidle' });

        const result = await page.evaluate(async () => {
            const Highcharts = (window as any).Highcharts;
            const GoogleSheetsConnector = 
                Highcharts.DataConnector.types.GoogleSheets;

            const connector = new GoogleSheetsConnector({
                googleAPIKey: 'AIzaSyCQ0Jh8OFRShXam8adBbBcctlbeeA-qJOk',
                googleSpreadsheetKey: '1U17c4GljMWpgk1bcTvUzIuWT8vdOnlCBHTm5S8Jh8tw'
            });

            await connector.load();

            const table = connector.getTable();
            const columnIds = table.getColumnIds();

            // Test that columns with null first value get unique names (not 'null')
            const hasNullColumn = columnIds.includes('null');

            // Test that we can manually rename a column to 'null' (string value is ok)
            table.changeColumnId(columnIds[0], 'null');
            const columnIdsAfterRename = table.getColumnIds();
            const hasNullColumnAfterRename = columnIdsAfterRename.includes('null');

            return {
                hasNullColumn,
                hasNullColumnAfterRename
            };
        });

        expect(
            result.hasNullColumn,
            'Columns where the first value is of type `null`, should be assigned a unique name'
        ).toBe(false);
        
        expect(
            result.hasNullColumnAfterRename,
            'A string value of `null` is ok'
        ).toBe(true);
    });
});
