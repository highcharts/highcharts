import { describe, it } from 'node:test';
import { ok, deepStrictEqual, strictEqual } from 'node:assert';

import DataConnector from '../../../../../ts/Data/Connectors/DataConnector';
import CSVConnector from '../../../../../ts/Data/Connectors/CSVConnector';
import JSONConnector from '../../../../../ts/Data/Connectors/JSONConnector';
// Import these to register them with DataConnector.types
import '../../../../../ts/Data/Connectors/GoogleSheetsConnector';
import '../../../../../ts/Data/Connectors/HTMLTableConnector';

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

    describe('polling', () => {
        const hadWindow = Object.prototype.hasOwnProperty.call(
            global,
            'window'
        );
        const originalWindow = global.window;

        function installPollingWindow(): {
            delays: Array<unknown>;
            callbacks: Array<() => Promise<void>>;
        } {
            const delays: Array<unknown> = [];
            const callbacks: Array<() => Promise<void>> = [];

            global.window = {
                setTimeout: (
                    callback: () => Promise<void>,
                    delay: unknown
                ): number => {
                    delays.push(delay);
                    callbacks.push(callback);
                    return callbacks.length;
                },
                clearTimeout: (): void => undefined
            };

            return { delays, callbacks };
        }

        function restoreWindow(): void {
            if (hadWindow) {
                global.window = originalWindow;
            } else {
                delete global.window;
            }
        }

        function isValidDelay(delay: unknown): boolean {
            return typeof delay === 'number' &&
                Number.isFinite(delay) &&
                delay >= 1000;
        }

        it('keeps a polling delay below one second', () => {
            const { delays } = installPollingWindow();
            const connector = new CSVConnector();

            try {
                connector.startPolling(500);

                deepStrictEqual(
                    delays,
                    [500],
                    'A finite delay below 1000 ms is kept.'
                );
            } finally {
                connector.stopPolling();
                restoreWindow();
            }
        });

        it('keeps a valid refresh rate of at least one second', () => {
            const { delays } = installPollingWindow();
            const connectors = [];

            try {
                for (const Connector of [CSVConnector, JSONConnector]) {
                    connectors.push(new Connector({
                        enablePolling: true,
                        dataRefreshRate: 2
                    }));
                }

                deepStrictEqual(
                    delays,
                    [2000, 2000],
                    'Polling waits two seconds for a refresh rate of 2.'
                );
            } finally {
                for (const connector of connectors) {
                    connector.stopPolling();
                }
                restoreWindow();
            }
        });

        it('falls back when the refresh rate is not numeric', async () => {
            const { delays, callbacks } = installPollingWindow();
            const connectors = [];

            try {
                for (const Connector of [CSVConnector, JSONConnector]) {
                    connectors.push(new Connector({
                        enablePolling: true,
                        dataRefreshRate: 'invalid' as unknown as number
                    }));
                }

                strictEqual(delays.length, 2);
                ok(
                    delays.every(isValidDelay),
                    'Delays are finite and at least 1000 ms, got ' +
                        delays.join(', ') + '.'
                );

                await callbacks[0]();

                ok(
                    isValidDelay(delays[2]),
                    'Rescheduled polling stays on a finite delay.'
                );
            } finally {
                for (const connector of connectors) {
                    connector.stopPolling();
                }
                restoreWindow();
            }
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
