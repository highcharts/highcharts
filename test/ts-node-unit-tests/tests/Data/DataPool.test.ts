import { describe, it } from 'node:test';
import { deepStrictEqual, strictEqual, notStrictEqual, ok } from 'node:assert';

import DataPool from '../../../../ts/Data/DataPool.js';
// Import connectors to register them with DataConnector
import '../../../../ts/Data/Connectors/CSVConnector.js';
import '../../../../ts/Data/Connectors/JSONConnector.js';
// Import modifiers to register them
import '../../../../ts/Data/Modifiers/ChainModifier.js';
import '../../../../ts/Data/Modifiers/RangeModifier.js';

describe('DataPool', () => {

    describe('basic operations', () => {
        it('should store and retrieve connector IDs', () => {
            const dataPool = new DataPool();

            dataPool.setConnectorOptions({
                id: 'A',
                type: 'CSV',
                csvURL: 'https://domain.example/data.csv'
            });

            dataPool.setConnectorOptions({
                id: 'B',
                type: 'CSV',
                csvURL: 'https://domain.example/data.csv'
            });

            deepStrictEqual(
                dataPool.getConnectorIds(),
                ['A', 'B'],
                'The connectorsNames array should contain two elements, A and B.'
            );
        });
    });

    describe('events', () => {
        it('should emit set events when setting connector options', async () => {
            const connectorOptions = {
                type: 'CSV' as const,
                id: 'my-connector',
                csv: 'A,B\n1,2'
            };
            const dataPool = new DataPool();

            const eventLog: string[] = [];

            function logEvent(this: DataPool, e: { type: string }) {
                strictEqual(
                    this,
                    dataPool,
                    'Event scope should be the data pool.'
                );
                eventLog.push(e.type);
            }

            dataPool.on('load', logEvent);
            dataPool.on('afterLoad', logEvent);
            dataPool.on('setConnectorOptions', logEvent);
            dataPool.on('afterSetConnectorOptions', logEvent);

            dataPool.setConnectorOptions(connectorOptions);

            deepStrictEqual(
                eventLog,
                ['setConnectorOptions', 'afterSetConnectorOptions'],
                'Data pool should emit set events.'
            );
        });

        it('should emit load events when getting connector', async () => {
            const connectorOptions = {
                type: 'CSV' as const,
                id: 'my-connector',
                csv: 'A,B\n1,2'
            };
            const dataPool = new DataPool();

            const eventLog: string[] = [];

            function logEvent(this: DataPool, e: { type: string }) {
                eventLog.push(e.type);
            }

            dataPool.on('load', logEvent);
            dataPool.on('afterLoad', logEvent);

            dataPool.setConnectorOptions(connectorOptions);

            eventLog.length = 0;

            await dataPool.getConnector('my-connector');

            deepStrictEqual(
                eventLog,
                ['load', 'afterLoad'],
                'Data pool should emit load events.'
            );
        });

        it('should emit new set events after connector is loaded', async () => {
            const connectorOptions = {
                type: 'CSV' as const,
                id: 'my-connector',
                csv: 'A,B\n1,2'
            };
            const dataPool = new DataPool();

            const eventLog: string[] = [];

            function logEvent(this: DataPool, e: { type: string }) {
                eventLog.push(e.type);
            }

            dataPool.on('setConnectorOptions', logEvent);
            dataPool.on('afterSetConnectorOptions', logEvent);

            dataPool.setConnectorOptions(connectorOptions);
            await dataPool.getConnector('my-connector');

            eventLog.length = 0;

            dataPool.setConnectorOptions(connectorOptions);

            deepStrictEqual(
                eventLog,
                ['setConnectorOptions', 'afterSetConnectorOptions'],
                'Data pool should emit new set events.'
            );
        });
    });

    describe('promises', () => {
        it('should resolve second connector request after first one', async () => {
            // Using a simpler modifier chain (the old RangeModifier API with conditions
            // has been deprecated/removed)
            const dataPool = new DataPool({
                connectors: [{
                    id: 'My Data',
                    type: 'CSV',
                    csv: 'a,b,c\n1,2,3\n4,5,6\n7,8,9',
                    dataModifier: {
                        type: 'Chain',
                        chain: [{
                            type: 'Range',
                            start: 0,
                            end: 2
                        }]
                    }
                }]
            });

            let firstLoadingDone = false;

            /* first no await */
            dataPool
                .getConnector('My Data')
                .then(() => { firstLoadingDone = true; });

            /* second time await */
            await dataPool.getConnector('My Data');

            ok(
                firstLoadingDone,
                'DataPool should resolve second connector request after first one.'
            );
        });
    });

    describe('replacement', () => {
        it('should track new vs loaded connectors', async () => {
            const dataPool = new DataPool({
                connectors: [{
                    id: 'My Data',
                    type: 'CSV',
                    csv: 'a,b,c\n1,2,3\n4,5,6\n7,8,9'
                }]
            });

            ok(
                dataPool.isNewConnector('My Data'),
                'DataPool connector should be new.'
            );

            const firstConnector = await dataPool.getConnector('My Data');

            strictEqual(
                dataPool.isNewConnector('My Data'),
                false,
                'DataPool connector should be not new anymore.'
            );

            dataPool.setConnectorOptions({
                id: 'My Data',
                type: 'JSON',
                columnIds: ['a', 'b', 'c'],
                data: [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
            });

            ok(
                dataPool.isNewConnector('My Data'),
                'DataPool connector should be new again.'
            );

            const secondConnector = await dataPool.getConnector('My Data');

            strictEqual(
                dataPool.isNewConnector('My Data'),
                false,
                'DataPool connector should be not new anymore.'
            );

            notStrictEqual(
                firstConnector,
                secondConnector,
                'DataPool connectors should not be equal.'
            );
        });
    });

});
