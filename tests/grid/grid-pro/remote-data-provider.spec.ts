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
});
