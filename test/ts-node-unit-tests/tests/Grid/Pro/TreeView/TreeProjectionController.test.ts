import { describe, it } from 'node:test';
import { deepStrictEqual } from 'node:assert';

import { mockObservers, setupDOM } from '../../../../test-utils';

function installGridDOMGlobals(
    win: any,
    doc: Document
): void {
    const requestAnimationFrame = (
        callback: FrameRequestCallback
    ): number => {
        callback(0);
        return 0;
    };

    global.window = win;
    global.document = doc;
    global.ResizeObserver = win.ResizeObserver;
    global.requestAnimationFrame = requestAnimationFrame;
    global.cancelAnimationFrame = (): void => {};
    win.requestAnimationFrame = requestAnimationFrame;
    win.cancelAnimationFrame = (): void => {};
}

describe('TreeProjectionController', () => {
    it('should preserve tree root order for default and custom sorting on one Grid instance', async () => {
        const { win, doc, el } = setupDOM();
        mockObservers(win);
        installGridDOMGlobals(win, doc);

        const Grid = require('../../../../../../ts/masters-grid/grid-pro.src.ts');

        const grid = await Grid.grid(el, {
            data: {
                columns: {
                    id: [1, 2, 3],
                    parentId: [null, 1, null],
                    name: ['aa', 'zzzzz', 'zbbb']
                },
                idColumn: 'id',
                treeView: {
                    expandedRowIds: 'all',
                    treeColumn: 'name'
                }
            }
        }, true);

        grid.viewport?.resizeObserver?.disconnect();

        await grid.setSorting([{
            columnId: 'name',
            order: 'desc'
        }]);

        deepStrictEqual(
            grid.querying.sorting.currentSortings,
            [{
                columnId: 'name',
                order: 'desc'
            }],
            'Grid should store descending sorting state.'
        );

        deepStrictEqual(
            (grid.dataProvider as any).getDataTable(true).columns.id,
            [3, 1, 2],
            'Tree projection should order roots by the default descending sort.'
        );

        await grid.update({
            columns: [{
                id: 'name',
                sorting: {
                    compare: (a, b) => String(a ?? '').length - String(b ?? '').length
                }
            }]
        });

        await grid.setSorting([{
            columnId: 'name',
            order: 'asc'
        }]);

        deepStrictEqual(
            grid.querying.sorting.currentSortings,
            [{
                columnId: 'name',
                order: 'asc'
            }],
            'Grid should store ascending sorting state after updating compare.'
        );

        deepStrictEqual(
            (grid.dataProvider as any).getDataTable(true).columns.id,
            [1, 2, 3],
            'Tree projection should preserve root order defined by custom compare.'
        );

        grid.destroy();
    });
});
