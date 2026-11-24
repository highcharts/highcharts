import { describe, it } from 'node:test';
import { deepStrictEqual, strictEqual } from 'node:assert';

import DataTable from '../../../../../ts/Data/DataTable.js';
import SortModifier from '../../../../../ts/Data/Modifiers/SortModifier.js';

describe('SortModifier', () => {

    describe('modify', () => {
        it('should sort table in descending order by Y values', async () => {
            const table = new DataTable({
                columns: {
                    x: [0, 1, 2],
                    y: [3, 1, 2]
                }
            });
            const descYModifier = new SortModifier({
                direction: 'desc',
                orderByColumn: 'y'
            });

            const tableDescY = await descYModifier.modify(table.clone());

            deepStrictEqual(
                tableDescY.getModified().getColumn('x'),
                [0, 2, 1],
                'Sorted table should be in descending order of Y values.'
            );
        });

        it('should restore original order when resorted in ascending X order', async () => {
            const table = new DataTable({
                columns: {
                    x: [0, 1, 2],
                    y: [3, 1, 2]
                }
            });
            const ascXModifier = new SortModifier({
                direction: 'asc',
                orderByColumn: 'x'
            });
            const descYModifier = new SortModifier({
                direction: 'desc',
                orderByColumn: 'y'
            });

            const tableDescY = await descYModifier.modify(table.clone());
            const tableAscX = await ascXModifier.modify(tableDescY.getModified().clone());

            deepStrictEqual(
                tableAscX.getModified().getColumns(['x', 'y']),
                table.getColumns(['x', 'y']),
                'Resorted table should be ordered the same as original.'
            );
        });

        it('should sort by multiple columns in ascending order', async () => {
            const table = new DataTable({
                columns: {
                    x: [1, 2, 1, 2, 1],
                    y: [5, 4, 3, 2, 1],
                    id: ['a', 'b', 'c', 'd', 'e']
                }
            });
            const modifier = new SortModifier({
                columns: [
                    { column: 'x', direction: 'asc' },
                    { column: 'y', direction: 'asc' }
                ]
            });

            const modifiedTable = await modifier.modify(table.clone());
            const modified = modifiedTable.getModified();

            deepStrictEqual(
                modified.getColumn('id'),
                ['e', 'c', 'a', 'd', 'b'],
                'Table should be sorted by x ascending, then y ascending.'
            );
            strictEqual(
                modified.getOriginalRowIndex(0),
                4,
                'Local row 0 should map to original row 4.'
            );
            strictEqual(
                modified.getOriginalRowIndex(2),
                0,
                'Local row 2 should map to original row 0.'
            );
            strictEqual(
                modified.getLocalRowIndex(0),
                2,
                'Original row 0 should map to local row 2.'
            );
            strictEqual(
                modified.getLocalRowIndex(4),
                0,
                'Original row 4 should map to local row 0.'
            );
        });
    });

});
