import { describe, it } from 'node:test';
import { strictEqual, notStrictEqual, deepStrictEqual } from 'node:assert';

import DataTable from '../../../../../ts/Data/DataTable.js';
import InvertModifier from '../../../../../ts/Data/Modifiers/InvertModifier.js';

describe('InvertModifier', () => {

    describe('modify', () => {
        it('should invert rows and columns', async () => {
            const modifier = new InvertModifier();
            const table = await modifier.modify(new DataTable({
                columns: {
                    x: [0, 1, 2, 3, 4],
                    y: ['a', 'b', 'c', 'd', 'e']
                }
            }));

            const tableColumnIds = table.getColumnIds();

            notStrictEqual(
                table.getModified(),
                table,
                'The inverted table should be a new table instance.'
            );

            strictEqual(
                table.getModified().getRowCount(),
                tableColumnIds.length,
                'Original and inverted table should have an inverted amount of columns and rows.'
            );

            deepStrictEqual(
                table.getModified().getColumn('columnIds'),
                tableColumnIds,
                'Row names of inverted table should be the same as column names of original table.'
            );
        });

        it('should restore original table when inverted twice', async () => {
            const modifier = new InvertModifier();
            const table = await modifier.modify(new DataTable({
                columns: {
                    x: [0, 1, 2, 3, 4],
                    y: ['a', 'b', 'c', 'd', 'e']
                }
            }));

            const modified = await modifier.modify(table.getModified().clone());

            deepStrictEqual(
                modified.getModified().getColumns(),
                table.getColumns(),
                'Double inverted table should be the same as original table.'
            );
        });
    });

});
