import { describe, it } from 'node:test';
import { deepStrictEqual, strictEqual } from 'node:assert';

import DataTable from '../../../../../ts/Data/DataTable.js';
import RangeModifier from '../../../../../ts/Data/Modifiers/RangeModifier.js';

describe('RangeModifier', () => {

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

});
