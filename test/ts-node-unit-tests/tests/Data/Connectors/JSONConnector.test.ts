import { describe, it } from 'node:test';
import { deepStrictEqual, strictEqual } from 'node:assert';

import JSONConnector from '../../../../../ts/Data/Connectors/JSONConnector';

describe('JSONConnector', () => {
    const rows = [
        ['id', 'weight', 'age'],
        [1, 88, 30],
        [2, 58, 25],
        [3, 78, 20]
    ];
    const columns = [
        [1, 2, 3, 4],
        [3, 4, 3, 4],
        [3, 4, 3, 4]
    ];
    const columnIds = ['id', 'weight', 'age'];

    describe('from rows', () => {
        it('should have the same amount of rows', async () => {
            const connector = new JSONConnector({ data: rows });
            await connector.load();

            strictEqual(
                connector.getTable().getRowCount(),
                rows.length - 1,
                'Should have the same amount of rows'
            );
        });

        it('should have correct column names', async () => {
            const connector = new JSONConnector({ data: rows });
            await connector.load();

            deepStrictEqual(
                connector.getTable().getColumnIds(),
                rows[0],
                'Should have correct column Names'
            );
        });
    });

    describe('from columns', () => {
        it('should have the same amount of rows', async () => {
            const connector = new JSONConnector({
                orientation: 'columns',
                columnIds: ['id', 'weight', 'age'],
                firstRowAsNames: false,
                data: columns
            });
            await connector.load();

            strictEqual(
                connector.getTable().getRowCount(),
                columns[0].length,
                'Should have the same amount of rows'
            );
        });

        it('should have correct column names', async () => {
            const connector = new JSONConnector({
                orientation: 'columns',
                columnIds: ['id', 'weight', 'age'],
                firstRowAsNames: false,
                data: columns
            });
            await connector.load();

            deepStrictEqual(
                connector.getTable().getColumnIds(),
                columnIds,
                'Should have correct column Names'
            );
        });
    });

    describe('from objects', () => {
        const data = [{
            id: 1,
            weight: 88,
            age: 30
        }, {
            id: 2,
            weight: 58,
            age: 25
        }, {
            id: 3,
            weight: 78,
            age: 20
        }, {
            id: 4,
            weight: 98,
            age: 35
        }];

        it('should have the same amount of rows', async () => {
            const connector = new JSONConnector({
                firstRowAsNames: false,
                data
            });
            await connector.load();

            strictEqual(
                connector.getTable().getRowCount(),
                data.length,
                'Should have the same amount of rows'
            );
        });

        it('should have correct column Ids', async () => {
            const connector = new JSONConnector({
                firstRowAsNames: false,
                data
            });
            await connector.load();

            deepStrictEqual(
                connector.getTable().getColumnIds(),
                columnIds,
                'Should have correct Column Ids'
            );
        });
    });

    describe('with beforeParse', () => {
        const data = [{
            id: 1,
            weight: 88,
            age: 30
        }, {
            id: 2,
            weight: 58,
            age: 25
        }, {
            id: 3,
            weight: 78,
            age: 20
        }, {
            id: 4,
            weight: 98,
            age: 35
        }];

        it('should have the same amount of rows', async () => {
            const connector = new JSONConnector({
                firstRowAsNames: false,
                beforeParse: (data: Array<{id: number, weight: number, age: number}>) => {
                    data.forEach((row) => {
                        row.age = row.age + 10;
                    });
                    return data;
                },
                data
            });
            await connector.load();

            strictEqual(
                connector.getTable().getRowCount(),
                data.length,
                'Should have the same amount of rows.'
            );
        });

        it('should have 4 rows', async () => {
            const connector = new JSONConnector({
                firstRowAsNames: false,
                beforeParse: (data: Array<{id: number, weight: number, age: number}>) => {
                    data.forEach((row) => {
                        row.age = row.age + 10;
                    });
                    return data;
                },
                data
            });
            await connector.load();

            strictEqual(
                connector.getTable().getRowCount(),
                4,
                'There should be 4 rows.'
            );
        });
    });
});
