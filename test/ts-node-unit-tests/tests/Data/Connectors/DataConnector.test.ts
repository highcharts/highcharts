import { describe, it } from 'node:test';
import { ok, deepStrictEqual, strictEqual } from 'node:assert';

import DataConnector from '../../../../../ts/Data/Connectors/DataConnector';
import CSVConnector from '../../../../../ts/Data/Connectors/CSVConnector';
// Import these to register them with DataConnector.types
import '../../../../../ts/Data/Connectors/GoogleSheetsConnector';
import '../../../../../ts/Data/Connectors/HTMLTableConnector';
import '../../../../../ts/Data/Connectors/JSONConnector';

describe('DataConnector', () => {
    describe('metadata', () => {
        it('should describe columns', () => {
            const connector = new CSVConnector();
            const columns = connector.metadata.columns;

            connector.describeColumns({
                'column1': {
                    title: 'This is a title',
                    dataType: 'string',
                    defaultValue: 'banana'
                }
            });

            const description = columns['column1'];

            ok(description, 'Managed to get `column1`');
        });

        it('should export and import metadata consistently', () => {
            const connector = new CSVConnector();
            const columns = connector.metadata.columns;

            connector.describeColumns({
                'column1': {
                    title: 'This is a title',
                    dataType: 'string',
                    defaultValue: 'banana'
                }
            });

            const description = columns['column1'];
            const metadata = connector.metadata;

            connector.describeColumns(metadata.columns);

            deepStrictEqual(
                columns['column1'],
                description,
                'Importing exported metadata gives same result'
            );
        });

        it('should add additional columns', () => {
            const connector = new CSVConnector();
            const columns = connector.metadata.columns;

            connector.describeColumns({
                'column1': {
                    title: 'This is a title',
                    dataType: 'string',
                    defaultValue: 'banana'
                }
            });

            connector.describeColumn(
                'columnX',
                { title: 'Column X', dataType: 'number', defaultValue: -5 }
            );

            ok(columns['columnX'], 'ColumnX was added');
            ok(columns['column1'], 'Column1 is still there');
        });

        it('should set column order', () => {
            const connector = new CSVConnector();
            const columns = connector.metadata.columns;

            connector.describeColumns({
                'column1': {
                    title: 'This is a title',
                    dataType: 'string',
                    defaultValue: 'banana'
                }
            });

            connector.describeColumn(
                'columnX',
                { title: 'Column X', dataType: 'number', defaultValue: -5 }
            );

            connector.setColumnOrder(['columnX', 'column1']);

            deepStrictEqual(
                [columns['columnX'].index, columns['column1'].index],
                [0, 1],
                'ColumnX should come before column1.'
            );
        });

        it('should get column order', () => {
            const connector = new CSVConnector();

            connector.describeColumns({
                'column1': {
                    title: 'This is a title',
                    dataType: 'string',
                    defaultValue: 'banana'
                }
            });

            connector.describeColumn(
                'columnX',
                { title: 'Column X', dataType: 'number', defaultValue: -5 }
            );

            connector.setColumnOrder(['columnX', 'column1']);

            deepStrictEqual(
                connector.getColumnOrder(),
                ['columnX', 'column1'],
                'Column order should be descendent.'
            );
        });
    });

    describe('registry', () => {
        const connectors = [
            'CSV',
            'HTMLTable',
            'GoogleSheets',
            'JSON'
        ];

        for (const connector of connectors) {
            it(`${connector} should be registered`, () => {
                strictEqual(
                    typeof DataConnector.types[connector],
                    'function',
                    `${connector} is registered`
                );
            });
        }
    });
});
