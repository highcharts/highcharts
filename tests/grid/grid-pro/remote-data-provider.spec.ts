import type { Page } from '@playwright/test';
import { test, expect } from '~/fixtures.ts';

type RemoteScenarioOptions = {
    totalRowCount: number;
    data?: {
        chunkSize?: number;
        chunksLimit?: number;
        idColumn?: string;
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
    await page.goto('/grid-pro/e2e/remote-data-provider');
    await page.waitForFunction(() => {
        const api = (window as any).remoteDataProviderTest;
        return !!(api && api.createGrid && api.getGrid);
    });

    return await page.evaluate(async ({ options, mode }) => {
        const api = (window as any).remoteDataProviderTest;
        await api.createGrid(options);
        await new Promise((resolve) => window.setTimeout(resolve, 0));

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
            result.rowId1 = await dp.getRowId(1);
            result.rowId2 = await dp.getRowId(2);
            result.rowIndex2 = await dp.getRowIndex(result.rowId2);
            result.rowIndex1 = await dp.getRowIndex(result.rowId1);
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

async function openRemoteProviderFixture(page: Page): Promise<void> {
    await page.goto('/grid-pro/e2e/remote-data-provider');
    await page.waitForFunction(() => {
        const api = (window as any).remoteDataProviderTest;
        return !!(api && api.createGrid && api.getGrid);
    });
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

    test('pins unfetched remote rows once their chunks are scrolled into cache', async ({
        page
    }) => {
        await openRemoteProviderFixture(page);

        const state = await page.evaluate(async () => {
            const api = (window as any).remoteDataProviderTest;
            await api.createGrid({
                totalRowCount: 100,
                data: {
                    chunkSize: 10,
                    idColumn: 'id'
                }
            });

            const grid = api.getGrid();
            const vp = grid.viewport;
            const frame = (): Promise<void> => new Promise((resolve) => {
                window.requestAnimationFrame(() => resolve());
            });
            const tick = (): Promise<void> => new Promise((resolve) => {
                window.setTimeout(resolve, 0);
            });
            const settle = async (): Promise<void> => {
                await frame();
                await frame();
                await tick();
            };
            const getPinnedTopIds = (): number[] => Array.from(
                vp.rowPinningView.pinnedTopTbodyElement.querySelectorAll(
                    'tr[data-row-id]'
                ) as NodeListOf<HTMLElement>
            ).map((row): number => Number(row.getAttribute('data-row-id')));
            const scrollToRow = async (rowIndex: number): Promise<void> => {
                vp.scrollToRow(rowIndex);
                vp.tbodyElement.dispatchEvent(new Event('scroll'));
                await settle();
            };

            await settle();
            await grid.rowPinning.pin(25);
            await grid.rowPinning.pin(75);
            await settle();

            const initial = {
                pinnedState: grid.rowPinning.getPinnedRows(),
                pinnedTop: getPinnedTopIds()
            };

            await scrollToRow(25);
            const afterFirstChunk = {
                pinnedTop: getPinnedTopIds()
            };

            await scrollToRow(75);
            const afterSecondChunk = {
                pinnedTop: getPinnedTopIds()
            };

            return {
                initial,
                afterFirstChunk,
                afterSecondChunk
            };
        });

        expect(state.initial.pinnedState.topIds).toEqual([25, 75]);
        expect(state.initial.pinnedTop).toEqual([]);
        expect(state.afterFirstChunk.pinnedTop).toEqual([25]);
        expect(state.afterSecondChunk.pinnedTop).toEqual([25, 75]);
    });

    test('pins a fetched remote row immediately and keeps it pinned while scrolling until unpinned', async ({
        page
    }) => {
        await openRemoteProviderFixture(page);

        const state = await page.evaluate(async () => {
            const api = (window as any).remoteDataProviderTest;
            await api.createGrid({
                totalRowCount: 100,
                data: {
                    chunkSize: 10,
                    idColumn: 'id'
                }
            });

            const grid = api.getGrid();
            const vp = grid.viewport;
            const frame = (): Promise<void> => new Promise((resolve) => {
                window.requestAnimationFrame(() => resolve());
            });
            const tick = (): Promise<void> => new Promise((resolve) => {
                window.setTimeout(resolve, 0);
            });
            const settle = async (): Promise<void> => {
                await frame();
                await frame();
                await tick();
            };
            const getPinnedTopIds = (): number[] => Array.from(
                vp.rowPinningView.pinnedTopTbodyElement.querySelectorAll(
                    'tr[data-row-id]'
                ) as NodeListOf<HTMLElement>
            ).map((row): number => Number(row.getAttribute('data-row-id')));
            const scrollToRow = async (rowIndex: number): Promise<void> => {
                vp.scrollToRow(rowIndex);
                vp.tbodyElement.dispatchEvent(new Event('scroll'));
                await settle();
            };

            await settle();
            await grid.rowPinning.pin(5);
            await settle();

            const afterPin = {
                pinnedState: grid.rowPinning.getPinnedRows(),
                pinnedTop: getPinnedTopIds()
            };

            await scrollToRow(95);
            const afterScroll = {
                pinnedTop: getPinnedTopIds()
            };

            await grid.rowPinning.unpin(5);
            await settle();

            const afterUnpin = {
                pinnedState: grid.rowPinning.getPinnedRows(),
                pinnedTop: getPinnedTopIds()
            };

            return {
                afterPin,
                afterScroll,
                afterUnpin
            };
        });

        expect(state.afterPin.pinnedState.topIds).toEqual([5]);
        expect(state.afterPin.pinnedTop).toEqual([5]);
        expect(state.afterScroll.pinnedTop).toEqual([5]);
        expect(state.afterUnpin.pinnedState.topIds).toEqual([]);
        expect(state.afterUnpin.pinnedTop).toEqual([]);
    });

    test('keeps a cached pinned remote row visible across pagination pages until unpinned', async ({
        page
    }) => {
        await openRemoteProviderFixture(page);

        const state = await page.evaluate(async () => {
            const api = (window as any).remoteDataProviderTest;
            await api.createGrid({
                totalRowCount: 100,
                data: {
                    chunkSize: 10,
                    idColumn: 'id'
                },
                pagination: {
                    enabled: true,
                    pageSize: 10,
                    page: 1
                }
            });

            const grid = api.getGrid();
            const vp = grid.viewport;
            const frame = (): Promise<void> => new Promise((resolve) => {
                window.requestAnimationFrame(() => resolve());
            });
            const tick = (): Promise<void> => new Promise((resolve) => {
                window.setTimeout(resolve, 0);
            });
            const settle = async (): Promise<void> => {
                await frame();
                await frame();
                await tick();
            };
            const getPinnedTopIds = (): number[] => Array.from(
                vp.rowPinningView.pinnedTopTbodyElement.querySelectorAll(
                    'tr[data-row-id]'
                ) as NodeListOf<HTMLElement>
            ).map((row): number => Number(row.getAttribute('data-row-id')));

            await settle();
            await grid.rowPinning.pin(5);
            await settle();

            const page1 = {
                currentPage: grid.querying.pagination.currentPage,
                pinnedState: grid.rowPinning.getPinnedRows(),
                pinnedTop: getPinnedTopIds()
            };

            await grid.update({
                pagination: {
                    page: 2
                }
            });
            await settle();

            const page2 = {
                currentPage: grid.querying.pagination.currentPage,
                pinnedState: grid.rowPinning.getPinnedRows(),
                pinnedTop: getPinnedTopIds()
            };

            await grid.rowPinning.unpin(5);
            await settle();

            const afterUnpin = {
                currentPage: grid.querying.pagination.currentPage,
                pinnedState: grid.rowPinning.getPinnedRows(),
                pinnedTop: getPinnedTopIds()
            };

            return {
                page1,
                page2,
                afterUnpin
            };
        });

        expect(state.page1.currentPage).toBe(1);
        expect(state.page1.pinnedState.topIds).toEqual([5]);
        expect(state.page1.pinnedTop).toEqual([5]);

        expect(state.page2.currentPage).toBe(2);
        expect(state.page2.pinnedState.topIds).toEqual([5]);
        expect(state.page2.pinnedTop).toEqual([5]);

        expect(state.afterUnpin.currentPage).toBe(2);
        expect(state.afterUnpin.pinnedState.topIds).toEqual([]);
        expect(state.afterUnpin.pinnedTop).toEqual([]);
    });

    test('keeps cached pinned remote rows visible across sorting changes', async ({
        page
    }) => {
        await openRemoteProviderFixture(page);

        const state = await page.evaluate(async () => {
            const api = (window as any).remoteDataProviderTest;
            await api.createGrid({
                totalRowCount: 100,
                data: {
                    chunkSize: 10,
                    idColumn: 'id'
                },
                columns: [{
                    id: 'name'
                }]
            });

            const grid = api.getGrid();
            const vp = grid.viewport;
            const frame = (): Promise<void> => new Promise((resolve) => {
                window.requestAnimationFrame(() => resolve());
            });
            const tick = (): Promise<void> => new Promise((resolve) => {
                window.setTimeout(resolve, 0);
            });
            const settle = async (): Promise<void> => {
                await frame();
                await frame();
                await tick();
            };
            const getPinnedTopIds = (): number[] => Array.from(
                vp.rowPinningView.pinnedTopTbodyElement.querySelectorAll(
                    'tr[data-row-id]'
                ) as NodeListOf<HTMLElement>
            ).map((row): number => Number(row.getAttribute('data-row-id')));

            await settle();
            await grid.rowPinning.pin(5);
            await settle();

            const beforeSort = {
                pinnedTop: getPinnedTopIds(),
                firstRowId: await grid.dataProvider.getRowId(0)
            };

            await grid.update({
                columns: [{
                    id: 'name',
                    sorting: {
                        order: 'desc'
                    }
                }]
            });
            await settle();

            const afterSort = {
                pinnedState: grid.rowPinning.getPinnedRows(),
                pinnedTop: getPinnedTopIds(),
                firstRowId: await grid.dataProvider.getRowId(0)
            };

            return {
                beforeSort,
                afterSort
            };
        });

        expect(state.beforeSort.pinnedTop).toEqual([5]);
        expect(state.beforeSort.firstRowId).toBe(0);
        expect(state.afterSort.pinnedState.topIds).toEqual([5]);
        expect(state.afterSort.pinnedTop).toEqual([5]);
        expect(state.afterSort.firstRowId).toBe(99);
    });

    test('uses idColumn for row IDs when provided', async ({ page }) => {
        const result = await runRemoteScenario(
            page,
            {
                totalRowCount: 5,
                data: { chunkSize: 2, idColumn: 'id' }
            },
            'cache'
        );

        expect(result.error).toBeUndefined();
        expect(result.fetchCalls).toEqual(expect.arrayContaining([
            { offset: 0, limit: 2 },
            { offset: 2, limit: 2 }
        ]));
        // Row IDs come from column 'id' (numeric) instead of default rowIds
        expect(result.rowId0).toBe(0);
        expect(result.rowId2).toBe(2);
        expect(result.rowIndex2).toBe(2);
        expect(result.rowIndexMissing).toBeUndefined();
    });

    test('with idColumn: getRowIndex resolves row ID to local index', async ({ page }) => {
        const result = await runRemoteScenario(
            page,
            {
                totalRowCount: 4,
                data: { chunkSize: 2, idColumn: 'id' }
            },
            'cache'
        );

        expect(result.error).toBeUndefined();
        expect(result.rowId1).toBe(1);
        expect(result.rowIndex1).toBe(1);
    });
});
