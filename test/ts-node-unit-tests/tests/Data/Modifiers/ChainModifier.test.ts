import { describe, it } from 'node:test';
import { strictEqual, deepStrictEqual } from 'node:assert';

import DataTable from '../../../../../ts/Data/DataTable.js';
import ChainModifier from '../../../../../ts/Data/Modifiers/ChainModifier.js';
import DataModifier from '../../../../../ts/Data/Modifiers/DataModifier.js';
// Import these to register them with DataModifier.types
import '../../../../../ts/Data/Modifiers/FilterModifier.js';
import '../../../../../ts/Data/Modifiers/RangeModifier.js';

describe('ChainModifier', () => {

    class RecordingModifier extends DataModifier {
        public readonly options = { type: 'Chain' as const };

        public constructor(
            private readonly name: string,
            private readonly calls: string[]
        ) {
            super();
        }

        public modifyTable(table: DataTable): DataTable {
            this.calls.push(this.name);
            return table;
        }
    }

    // Note: benchmark test requires browser environment (uses window.performance)
    // Skipped in Node.js environment

    describe('modify', () => {
        it('should chain Filter and Range modifiers correctly', async () => {
            const modifier = new ChainModifier({
                chain: [{
                    type: 'Filter',
                    condition: {
                        operator: 'and',
                        conditions: [{
                            columnId: 'y',
                            operator: '>=',
                            value: 'A'
                        }, {
                            columnId: 'y',
                            operator: '<=',
                            value: 'b'
                        }]
                    }
                }, {
                    type: 'Range',
                    start: 1
                }]
            });
            const table = new DataTable({
                columns: {
                    x: [1, 2, 3, 4, 5, 6],
                    y: ['a', 'a', 'b', 'b', 'c', 'c']
                }
            });

            await modifier.modify(table);

            strictEqual(
                table.getModified().getRowCount(),
                3,
                'Modified table should contain three rows.'
            );

            deepStrictEqual(
                table.getModified().getColumns(),
                {
                    x: [2, 3, 4],
                    y: ['a', 'b', 'b']
                },
                'Modified table should have expected structure of three rows.'
            );

            // Check sparse array values at specific positions
            const localRowIndexes = (table.getModified() as any).localRowIndexes;
            strictEqual(localRowIndexes[0], undefined, 'localRowIndexes[0] should be undefined');
            strictEqual(localRowIndexes[1], 0, 'localRowIndexes[1] should be 0');
            strictEqual(localRowIndexes[2], 1, 'localRowIndexes[2] should be 1');
            strictEqual(localRowIndexes[3], 2, 'localRowIndexes[3] should be 2');

            deepStrictEqual(
                (table.getModified() as any).originalRowIndexes,
                [1, 2, 3],
                'Modified table should have expected original row indexes.'
            );
        });

        it('should preserve a reversed chain across repeated modifications', () => {
            const calls: string[] = [];
            const first = new RecordingModifier('first', calls);
            const second = new RecordingModifier('second', calls);
            const modifier = new ChainModifier(
                { reverse: true },
                first,
                second
            );
            const table = new DataTable();

            modifier.modifyTable(table);
            modifier.modifyTable(table);

            deepStrictEqual(calls, [
                'second', 'first', 'second', 'first'
            ]);
            deepStrictEqual(modifier.chain, [first, second]);
        });
    });

    describe('chain management', () => {
        it('should emit the after-add event', () => {
            const events: string[] = [];
            const modifier = new ChainModifier();
            const added = new RecordingModifier('added', []);

            modifier.on('addModifier', (): void => {
                events.push('addModifier');
            });
            modifier.on('afterAddModifier', (): void => {
                events.push('afterAddModifier');
            });
            modifier.add(added);

            deepStrictEqual(events, ['addModifier', 'afterAddModifier']);
        });

        it('should remove every matching modifier and ignore an absent one', () => {
            const first = new RecordingModifier('first', []);
            const second = new RecordingModifier('second', []);
            const absent = new RecordingModifier('absent', []);
            const modifier = new ChainModifier(
                void 0,
                first,
                second,
                first
            );

            modifier.remove(first);
            deepStrictEqual(modifier.chain, [second]);

            modifier.remove(absent);
            deepStrictEqual(modifier.chain, [second]);
        });
    });

});
