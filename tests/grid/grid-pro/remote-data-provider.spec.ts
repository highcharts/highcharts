import type { Page } from '@playwright/test';
import { test, expect } from '~/fixtures.ts';

type RemoteScenarioOptions = {
    totalRowCount: number;
    data?: {
        chunkSize?: number;
        chunksLimit?: number;
    };
    columns?: Array<{
        id: string;
        sorting?: {
            order?: 'asc' | 'desc';
        };
    }>;
    pagination?: {
        enabled: boolean;
        page?: number;
        pageSize?: number;
    };
};

type RemoteScenarioMode = 'cache' | 'pagination' | 'lru' | 'sorting';

type CacheState = {
    chunkKeys: number[];
    chunkCount: number;
    rowIdCount: number;
};

async function runRemoteScenario(
    page: Page,
    options: RemoteScenarioOptions,
    mode: RemoteScenarioMode
): Promise<Record<string, unknown> & {
    fetchCalls: Array<{ offset: number; limit: number }>;
}> {
    await page.goto('/grid-pro/cypress/remote-data-provider');
    await page.waitForFunction(() => {
        const api = (window as any).remoteDataProviderTest;
        return !!(api && api.createGrid && api.getGrid);
    });

    return await page.evaluate(async ({ options, mode }) => {
        const api = (window as any).remoteDataProviderTest;
        await api.createGrid(options);

        const grid = api.getGrid();
        const dp = grid?.dataProvider;
        const result: Record<string, unknown> = {};

        if (!dp) {
            return {
                fetchCalls: api.getFetchCalls(),
                error: 'missing-data-provider'
            };
        }

        if (mode === 'cache') {
            result.v0 = await dp.getValue('name', 0);
            result.v1 = await dp.getValue('name', 1);
            result.v2 = await dp.getValue('name', 2);
            result.rowId0 = await dp.getRowId(0);
            result.rowId2 = await dp.getRowId(2);
            result.rowIndex2 = await dp.getRowIndex(result.rowId2);
            result.rowIndexMissing = await dp.getRowIndex('missing-row');
        } else if (mode === 'pagination') {
            result.rowCount = await dp.getRowCount();
            result.prePaginationCount = await dp.getPrePaginationRowCount();
            result.rowId0 = await dp.getRowId(0);
            result.rowIndex0 = await dp.getRowIndex(result.rowId0);
        } else if (mode === 'lru') {
            result.rowId0 = await dp.getRowId(0);
            await dp.getRowId(2);
            result.cacheState = api.getCacheState();
        } else if (mode === 'sorting') {
            result.rowId0 = await dp.getRowId(0);
            result.rowId1 = await dp.getRowId(1);
        }

        return {
            fetchCalls: api.getFetchCalls(),
            ...result
        };
    }, { options, mode });
}

test.describe('RemoteDataProvider', () => {
    test('caches chunks and reuses them for reads', async ({ page }) => {
        const result = await runRemoteScenario(
            page,
            { totalRowCount: 5, data: { chunkSize: 2 } },
            'cache'
        );

        expect(result.error).toBeUndefined();
        expect(result.fetchCalls).toEqual(expect.arrayContaining([
            { offset: 0, limit: 2 },
            { offset: 2, limit: 2 }
        ]));
        expect(result.v0).toBe('name-0');
        expect(result.v1).toBe('name-1');
        expect(result.v2).toBe('name-2');
        expect(result.rowId0).toBe('row-0');
        expect(result.rowId2).toBe('row-2');
        expect(result.rowIndex2).toBe(2);
        expect(result.rowIndexMissing).toBeUndefined();
    });

    test('uses page size as chunk size with pagination enabled', async ({ page }) => {
        const result = await runRemoteScenario(
            page,
            {
                totalRowCount: 5,
                pagination: {
                    enabled: true,
                    page: 1,
                    pageSize: 2
                }
            },
            'pagination'
        );

        expect(result.error).toBeUndefined();
        expect(result.fetchCalls).toEqual(expect.arrayContaining([
            { offset: 0, limit: 2 }
        ]));
        expect(result.rowCount).toBe(2);
        expect(result.prePaginationCount).toBe(5);
        expect(result.rowId0).toBe('row-0');
        expect(result.rowIndex0).toBe(0);
    });

    test('evicts least recently used chunk and clears rowId index', async ({ page }) => {
        const result = await runRemoteScenario(
            page,
            { totalRowCount: 4, data: { chunkSize: 2, chunksLimit: 1 } },
            'lru'
        );

        expect(result.error).toBeUndefined();
        expect(result.fetchCalls).toEqual(expect.arrayContaining([
            { offset: 0, limit: 2 },
            { offset: 2, limit: 2 }
        ]));
        const cacheState = result.cacheState as CacheState;
        expect(cacheState.chunkCount).toBe(1);
    });

    test('handles sorting in remote fetch callback', async ({ page }) => {
        const result = await runRemoteScenario(
            page,
            {
                totalRowCount: 5,
                data: { chunkSize: 2 },
                columns: [{
                    id: 'name',
                    sorting: {
                        order: 'desc'
                    }
                }]
            },
            'sorting'
        );

        expect(result.error).toBeUndefined();
        expect(result.fetchCalls).toEqual(expect.arrayContaining([
            { offset: 0, limit: 2 }
        ]));
        expect(result.rowId0).toBe('row-4');
        expect(result.rowId1).toBe('row-3');
    });

    test('supports sticky rows with remote provider and virtualization', async ({
        page
    }) => {
        await page.goto('/grid-pro/cypress/remote-data-provider');
        await page.waitForFunction(() => {
            const api = (window as any).remoteDataProviderTest;
            return !!(api && api.createGrid && api.getGrid);
        });

        await page.evaluate(() => {
            const api = (window as any).remoteDataProviderTest;
            api.createGrid({
                totalRowCount: 80,
                data: {
                    chunkSize: 200
                },
                rendering: {
                    rows: {
                        virtualization: true,
                        virtualizationThreshold: 20,
                        sticky: {
                            idColumn: 'id',
                            ids: [5, 20, 70]
                        }
                    }
                }
            });
        });

        await page.waitForFunction(() => {
            const grid = (window as any).remoteDataProviderTest.getGrid();
            return !!grid?.viewport?.rowsVirtualizer;
        });

        const result = await page.evaluate(async () => {
            const api = (window as any).remoteDataProviderTest;
            const grid = api.getGrid();
            const vp = grid.viewport;
            const rowCount = await grid.dataProvider.getRowCount();

            await new Promise((resolve) => window.setTimeout(resolve, 0));

            const rowHeight = vp.rowsVirtualizer.defaultRowHeight ||
                vp.rows[0]?.htmlElement.offsetHeight ||
                1;
            vp.tbodyElement.scrollTop = rowHeight * 60;
            vp.tbodyElement.dispatchEvent(new Event('scroll'));

            await new Promise((resolve) => window.setTimeout(resolve, 0));

            const visibleFrom = Math.max(
                0,
                Math.floor(vp.tbodyElement.scrollTop / rowHeight)
            );
            const excluded = new Set(
                (grid.getStickyRows() || []).map(
                    (id: string | number) => String(id)
                )
            );

            let target: { index: number; id: number } = { index: -1, id: -1 };
            for (const row of vp.rows) {
                if (
                    row.index < visibleFrom &&
                    row.index > 0 &&
                    row.index < rowCount - 1 &&
                    !excluded.has(String(row.data.id))
                ) {
                    target = {
                        index: row.index,
                        id: Number(row.data.id)
                    };
                    break;
                }
            }

            if (target.index === -1) {
                return {
                    target,
                    stickyTopIndexes: vp.stickyTopIndexes || [],
                    stickyRows: grid.getStickyRows() || []
                };
            }

            await grid.stickRow(target.id);

            return {
                target,
                stickyRows: grid.getStickyRows() || [],
                stickyMetaIds: grid.rowStickyMeta?.stickyRowIds || [],
                stickyMetaIndexes: grid.rowStickyMeta?.stickyRowIndexes || []
            };
        });

        expect(result.target.index).toBeGreaterThan(-1);
        expect(result.stickyRows).toContain(result.target.id);
        expect(result.stickyMetaIds).toContain(result.target.id);
        expect(result.stickyMetaIndexes).toContain(result.target.index);
    });

    test('supports toggleStickyRow and emits sticky change events', async ({
        page
    }) => {
        await page.goto('/grid-pro/cypress/remote-data-provider');
        await page.waitForFunction(() => {
            const api = (window as any).remoteDataProviderTest;
            return !!(api && api.createGrid && api.getGrid);
        });

        const result = await page.evaluate(async () => {
            const api = (window as any).remoteDataProviderTest;
            api.createGrid({
                totalRowCount: 40,
                data: {
                    chunkSize: 80
                },
                rendering: {
                    rows: {
                        sticky: {
                            idColumn: 'id',
                            ids: [5]
                        }
                    }
                }
            });

            const grid = api.getGrid();
            (window as any).stickyRowsEvents = [];
            grid.hcEvents = grid.hcEvents || {};
            grid.hcEvents.afterStickyRowsChange =
                grid.hcEvents.afterStickyRowsChange || [];

            grid.hcEvents.afterStickyRowsChange.push({
                fn: function (e: any): void {
                    (window as any).stickyRowsEvents.push({
                        rowId: e.rowId,
                        action: e.action,
                        stickyRows: e.stickyRows
                    });
                }
            });

            if (typeof grid.toggleStickyRow !== 'function') {
                return {
                    hasToggle: false,
                    events: [],
                    stickyRows: []
                };
            }

            await grid.toggleStickyRow(5);

            return {
                hasToggle: true,
                events: (window as any).stickyRowsEvents,
                stickyRows: grid.getStickyRows()
            };
        });

        expect(result.hasToggle).toBe(true);
        expect(result.events.length).toBeGreaterThanOrEqual(1);
        expect(result.events[0].rowId).toBe(5);
        expect(result.events[0].action).toBe('unstick');
        expect(result.stickyRows).not.toContain(5);
    });
});
