import { describe, it } from 'node:test';
import { deepStrictEqual, strictEqual, throws } from 'node:assert';

import DataTable from '../../../../../ts/Data/DataTable.js';
import DataModifier from '../../../../../ts/Data/Modifiers/DataModifier.js';
import RangeModifier from '../../../../../ts/Data/Modifiers/RangeModifier.js';

describe('RangeModifier', () => {

    class RecordingModifier extends DataModifier {
        public readonly options = { type: 'Range' as const };
        public calls = 0;

        public modifyTable(table: DataTable): DataTable {
            ++this.calls;
            this.emit({ type: 'modify', table });
            this.emit({ type: 'afterModify', table });
            return table;
        }
    }

    describe('modify', () => {
        it('should keep all rows when no range is specified', async () => {
            const table = new DataTable({
                columns: {
                    x: [-2, -1, 0, 1, 2],
                    y: ['a', 'b', 'c', 'd', 'e'],
                    z: [1e1, 1e2, 1e3, 1e4, 1e5]
                }
            });
            const modifier = new RangeModifier();

            await modifier.modify(table);

            deepStrictEqual(
                table.getModified().getRow(0),
                table.getRow(0),
                'Filtered table should contain same rows.'
            );
        });

        it('should filter rows based on start and end range', async () => {
            const table = new DataTable({
                columns: {
                    x: [-2, -1, 0, 1, 2],
                    y: ['a', 'b', 'c', 'd', 'e'],
                    z: [1e1, 1e2, 1e3, 1e4, 1e5]
                }
            });
            const modifier = new RangeModifier();

            modifier.options.start = 1;
            modifier.options.end = 3;

            await modifier.modify(table);

            const modified = table.getModified().getColumns();

            // Check x column - note: -0 and 0 are equal in JavaScript
            deepStrictEqual(modified.x, [-1, 0], 'x column filtered correctly');
            deepStrictEqual(modified.y, ['b', 'c'], 'y column filtered correctly');
            deepStrictEqual(modified.z, [1e2, 1e3], 'z column filtered correctly');
        });

        it('should handle start without end', async () => {
            const table = new DataTable({
                columns: {
                    x: [-2, -1, 0, 1, 2],
                    y: ['a', 'b', 'c', 'd', 'e'],
                    z: [1e1, 1e2, 1e3, 1e4, 1e5]
                }
            });
            const modifier = new RangeModifier();

            modifier.options.start = 4;
            modifier.options.end = void 0;

            await modifier.modify(table);

            deepStrictEqual(
                table.getModified().getColumns(),
                {
                    x: [2],
                    y: ['e'],
                    z: [1e5]
                },
                'Filtered table should contain intersective reduction of rows.'
            );
        });

        it('should set row indexes correctly', async () => {
            const table = new DataTable({
                columns: {
                    x: [-2, -1, 0, 1, 2],
                    y: ['a', 'b', 'c', 'd', 'e'],
                    z: [1e1, 1e2, 1e3, 1e4, 1e5]
                }
            });
            const modifier = new RangeModifier();

            modifier.options.start = 4;
            modifier.options.end = void 0;

            await modifier.modify(table);

            const localRowIndexes = (table.getModified() as any).localRowIndexes;
            const originalRowIndexes = (table.getModified() as any).originalRowIndexes;

            // Check sparse array values at specific positions
            strictEqual(localRowIndexes[0], undefined, 'localRowIndexes[0] should be undefined');
            strictEqual(localRowIndexes[1], undefined, 'localRowIndexes[1] should be undefined');
            strictEqual(localRowIndexes[2], undefined, 'localRowIndexes[2] should be undefined');
            strictEqual(localRowIndexes[3], undefined, 'localRowIndexes[3] should be undefined');
            strictEqual(localRowIndexes[4], 0, 'localRowIndexes[4] should be 0');

            deepStrictEqual(
                originalRowIndexes,
                [4],
                'Original row indexes should be set correctly.'
            );
        });
    });

    describe('benchmark', () => {
        it('should isolate the source table and repeated runs', () => {
            const table = new DataTable({ columns: { x: [1, 2, 3] } });
            const sourceColumns = table.getColumns();
            const rangeModifier = new RangeModifier({ start: 1 });

            strictEqual(rangeModifier.benchmark(table).length, 1);
            deepStrictEqual(table.getColumns(), sourceColumns);

            const modifier = new RecordingModifier();
            let benchmarkEvents = 0;
            let iterationEvents = 0;

            modifier.on('afterBenchmark', (): void => ++benchmarkEvents);
            modifier.on(
                'afterBenchmarkIteration',
                (): void => ++iterationEvents
            );

            strictEqual(modifier.benchmark(table, { iterations: 2 }).length, 2);
            strictEqual(modifier.benchmark(table, { iterations: 1 }).length, 1);
            strictEqual(modifier.calls, 3);
            strictEqual(iterationEvents, 3);
            strictEqual(benchmarkEvents, 2);
        });

        it('should handle bounded iteration counts without recursion', () => {
            const table = new DataTable();
            const modifier = new RecordingModifier();

            strictEqual(modifier.benchmark(table, { iterations: 0 }).length, 0);
            strictEqual(
                modifier.benchmark(table, { iterations: 10_000 }).length,
                10_000
            );
            throws(
                (): void => {
                    modifier.benchmark(table, { iterations: 1.5 });
                },
                /non-negative integer/
            );
        });
    });

});
