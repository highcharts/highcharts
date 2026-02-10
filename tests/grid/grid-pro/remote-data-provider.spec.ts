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
        api.createGrid(options);

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

    test('supports row pinning state with remote provider', async ({ page }) => {
        await page.goto('/grid-pro/cypress/remote-data-provider');
        await page.waitForFunction(() => {
            const api = (window as any).remoteDataProviderTest;
            return !!(api && api.createGrid && api.getGrid);
        });

        const result = await page.evaluate(async () => {
            const api = (window as any).remoteDataProviderTest;
            api.createGrid({
                totalRowCount: 8,
                rendering: {
                    rows: {
                        pinned: {
                            idColumn: 'id',
                            top: ['row-0'],
                            bottom: ['row-7']
                        }
                    }
                },
                pagination: {
                    enabled: true,
                    page: 1,
                    pageSize: 2
                }
            });

            const grid = api.getGrid();
            await new Promise<void>((resolve) => {
                const tick = (): void => {
                    if (
                        grid &&
                        grid.viewport &&
                        grid.viewport.tbodyElement
                    ) {
                        resolve();
                        return;
                    }
                    requestAnimationFrame(tick);
                };
                tick();
            });
            const pinned = grid.getPinnedRows();

            const topIds = Array.from(
                grid.viewport.pinnedTopTbodyElement.querySelectorAll(
                    'td[data-column-id="id"]'
                )
            ).map((el: Element) => (el.textContent || '').trim());
            const bottomIds = Array.from(
                grid.viewport.pinnedBottomTbodyElement.querySelectorAll(
                    'td[data-column-id="id"]'
                )
            ).map((el: Element) => (el.textContent || '').trim());
            const scrollableIds = Array.from(
                grid.viewport.tbodyElement.querySelectorAll(
                    'td[data-column-id="id"]'
                )
            ).map((el: Element) => (el.textContent || '').trim());

            return {
                pinned,
                topIds,
                bottomIds,
                scrollableIds
            };
        });

        expect(result.pinned.top).toEqual(['row-0']);
        expect(result.pinned.bottom).toEqual(['row-7']);
        expect(result.topIds).toEqual(['0']);
        expect(result.bottomIds).toEqual(['7']);
        expect(result.scrollableIds).toEqual(['1', '2']);
    });

    test('pinRow and unpinRow update remote provider active view', async ({ page }) => {
        await page.goto('/grid-pro/cypress/remote-data-provider');
        await page.waitForFunction(() => {
            const api = (window as any).remoteDataProviderTest;
            return !!(api && api.createGrid && api.getGrid);
        });

        const result = await page.evaluate(async () => {
            const api = (window as any).remoteDataProviderTest;
            api.createGrid({
                totalRowCount: 6,
                rendering: {
                    rows: {
                        pinned: {
                            idColumn: 'id',
                            top: [],
                            bottom: []
                        }
                    }
                }
            });

            const grid = api.getGrid();
            await new Promise<void>((resolve) => {
                const tick = (): void => {
                    if (
                        grid &&
                        grid.viewport &&
                        grid.viewport.tbodyElement
                    ) {
                        resolve();
                        return;
                    }
                    requestAnimationFrame(tick);
                };
                tick();
            });

            await grid.pinRow('row-3', 'top');
            await new Promise((resolve) => setTimeout(resolve, 0));
            const afterPin = {
                pinned: grid.getPinnedRows(),
                topIds: Array.from(
                    grid.viewport.pinnedTopTbodyElement.querySelectorAll(
                        'td[data-column-id="id"]'
                    )
                ).map((el: Element) => (el.textContent || '').trim()),
                scrollableHas3: grid.viewport.tbodyElement.textContent.includes('3')
            };

            await grid.unpinRow('row-3');
            await new Promise((resolve) => setTimeout(resolve, 0));
            const afterUnpin = {
                pinned: grid.getPinnedRows(),
                topIds: Array.from(
                    grid.viewport.pinnedTopTbodyElement.querySelectorAll(
                        'td[data-column-id="id"]'
                    )
                ).map((el: Element) => (el.textContent || '').trim()),
                scrollableHas3: grid.viewport.tbodyElement.textContent.includes('3')
            };

            return { afterPin, afterUnpin };
        });

        expect(result.afterPin.pinned.top).toEqual(['row-3']);
        expect(result.afterPin.topIds).toEqual(['3']);
        expect(result.afterPin.scrollableHas3).toBe(false);
        expect(result.afterUnpin.pinned.top).toEqual([]);
        expect(result.afterUnpin.topIds).toEqual([]);
        expect(result.afterUnpin.scrollableHas3).toBe(true);
    });

    test('getPinnedRows returns empty effective state for missing ids in remote mode', async ({ page }) => {
        await page.goto('/grid-pro/cypress/remote-data-provider');
        await page.waitForFunction(() => {
            const api = (window as any).remoteDataProviderTest;
            return !!(api && api.createGrid && api.getGrid);
        });

        const result = await page.evaluate(async () => {
            const api = (window as any).remoteDataProviderTest;
            api.createGrid({
                totalRowCount: 6,
                rendering: {
                    rows: {
                        pinned: {
                            idColumn: 'id',
                            top: ['row-missing-a'],
                            bottom: ['row-missing-b']
                        }
                    }
                }
            });

            const grid = api.getGrid();
            await new Promise<void>((resolve) => {
                const tick = (): void => {
                    if (
                        grid &&
                        grid.viewport &&
                        grid.viewport.tbodyElement
                    ) {
                        resolve();
                        return;
                    }
                    requestAnimationFrame(tick);
                };
                tick();
            });

            return {
                pinned: grid.getPinnedRows(),
                topRows: grid.viewport.pinnedTopRows.length,
                bottomRows: grid.viewport.pinnedBottomRows.length
            };
        });

        expect(result.pinned.top).toEqual([]);
        expect(result.pinned.bottom).toEqual([]);
        expect(result.topRows).toBe(0);
        expect(result.bottomRows).toBe(0);
    });

    test('keeps a consistent final state during async pin/query races', async ({ page }) => {
        await page.goto('/grid-pro/cypress/remote-data-provider');
        await page.waitForFunction(() => {
            const api = (window as any).remoteDataProviderTest;
            return !!(api && api.createGrid && api.getGrid);
        });

        const result = await page.evaluate(async () => {
            const api = (window as any).remoteDataProviderTest;
            api.createGrid({
                totalRowCount: 20,
                data: {
                    chunkSize: 5,
                    fetchDelayMs: 35
                },
                rendering: {
                    rows: {
                        pinned: {
                            idColumn: 'id',
                            top: [],
                            bottom: []
                        }
                    }
                }
            });

            const grid = api.getGrid();
            await Promise.all([
                grid.pinRow('row-3', 'top'),
                grid.update({
                    columns: [{
                        id: 'name',
                        sorting: {
                            order: 'desc'
                        }
                    }]
                }),
                grid.unpinRow('row-3'),
                grid.pinRow('row-6', 'bottom')
            ]);
            await new Promise((resolve) => setTimeout(resolve, 80));

            const pinned = grid.getPinnedRows();
            const bottomIds = Array.from(
                grid.viewport.pinnedBottomTbodyElement.querySelectorAll(
                    'td[data-column-id="id"]'
                )
            ).map((el: Element) => (el.textContent || '').trim());
            const scrollableIds = Array.from(
                grid.viewport.tbodyElement.querySelectorAll(
                    'td[data-column-id="id"]'
                )
            ).map((el: Element) => (el.textContent || '').trim());

            return {
                pinned,
                bottomIds,
                scrollableIds
            };
        });

        expect(result.pinned.top).toEqual([]);
        expect(result.pinned.bottom).toEqual(['row-6']);
        expect(result.bottomIds).toEqual(['6']);
        expect(result.scrollableIds).not.toContain('6');
    });

    test('preserves pinned visibility across remote sorting and pagination transitions', async ({ page }) => {
        await page.goto('/grid-pro/cypress/remote-data-provider');
        await page.waitForFunction(() => {
            const api = (window as any).remoteDataProviderTest;
            return !!(api && api.createGrid && api.getGrid);
        });

        const result = await page.evaluate(async () => {
            const api = (window as any).remoteDataProviderTest;
            api.createGrid({
                totalRowCount: 20,
                pagination: {
                    enabled: true,
                    page: 2,
                    pageSize: 5
                },
                columns: [{
                    id: 'name',
                    sorting: {
                        order: 'asc'
                    }
                }],
                rendering: {
                    rows: {
                        pinned: {
                            idColumn: 'id',
                            top: ['row-0'],
                            bottom: ['row-19']
                        }
                    }
                }
            });

            const grid = api.getGrid();
            await new Promise<void>((resolve) => {
                const tick = (): void => {
                    if (
                        grid &&
                        grid.viewport &&
                        grid.viewport.tbodyElement
                    ) {
                        resolve();
                        return;
                    }
                    requestAnimationFrame(tick);
                };
                tick();
            });
            const readIds = (): string[] => Array.from(
                grid.viewport.tbodyElement.querySelectorAll(
                    'td[data-column-id="id"]'
                )
            ).map((el: Element) => (el.textContent || '').trim());

            const ascPage2 = readIds();

            await grid.update({
                columns: [{
                    id: 'name',
                    sorting: {
                        order: 'desc'
                    }
                }]
            });
            const descPage2 = readIds();

            await grid.update({
                pagination: {
                    enabled: true,
                    page: 3,
                    pageSize: 5
                }
            });
            const descPage3 = readIds();

            return {
                pinned: grid.getPinnedRows(),
                ascPage2,
                descPage2,
                descPage3
            };
        });

        expect(result.pinned.top).toEqual(['row-0']);
        expect(result.pinned.bottom).toEqual(['row-19']);
        expect(result.ascPage2).toEqual(['6', '7', '8', '9', '10']);
        expect(result.descPage2).toEqual(['13', '12', '11', '10', '9']);
        expect(result.descPage3).toEqual(['8', '7', '6', '5', '4']);
    });
});
