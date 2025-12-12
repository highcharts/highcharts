import { describe, it } from 'node:test';
import { deepStrictEqual } from 'node:assert';

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
    });

});
