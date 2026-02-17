/* *
 *
 *  Remote Data Provider class
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type {
    RowObject as RowObjectType,
    Column as DataTableColumnType,
    CellType as DataTableCellType
} from '../../../Data/DataTable';
import type {
    DataProviderOptions,
    ProviderPinningViewState,
    ProviderQueryScope,
    RowId
} from '../../Core/Data/DataProvider';
import type { ColumnDataType } from '../../Core/Table/Column';
import type QueryingController from '../../Core/Querying/QueryingController';
import type { DataSourceOptions } from './DataSourceHelper';

import { DataProvider } from '../../Core/Data/DataProvider.js';
import DataProviderRegistry from '../../Core/Data/DataProviderRegistry.js';
import { createQueryFingerprint } from './QuerySerializer.js';
import { dataSourceFetch } from './DataSourceHelper.js';


/* *
 *
 *  Class
 *
 * */

/**
 * Remote data provider for the Grid.
 *
 * Fetches tabular data from a remote API in chunks and exposes it through the
 * standard `DataProvider` interface used by the Grid viewport.
 *
 * - Caches fetched chunks (optionally with an LRU eviction policy).
 * - Deduplicates concurrent requests for the same chunk.
 * - Uses a query fingerprint to invalidate caches when the query changes.
 */
export class RemoteDataProvider extends DataProvider {


    /* *
     *
     *  Static Properties
     *
     * */

    private static readonly DEFAULT_CHUNK_SIZE: number = 50;


    /* *
     *
     *  Properties
     *
     * */

    public readonly options!: RemoteDataProviderOptions;

    /**
     * Total row count before pagination (from API metadata `totalRowCount`).
     */
    private prePaginationRowCount: number | null = null;

    /**
     * Current row count after pagination (actual rows returned in the chunk).
     * When pagination is disabled, this equals prePaginationRowCount.
     */
    private rowCount: number | null = null;

    /**
     * Array of column IDs that have been fetched from the remote server.
     */
    private columnIds: string[] | null = null;

    /**
     * Cached chunks are used to store the data for the chunks that have been
     * fetched from the remote server.
     */
    private dataChunks: Map<number, DataChunk> | null = null;

    /**
     * Pending chunks are used to deduplicate concurrent requests for the same
     * chunk.
     */
    private pendingChunks: Map<number, Promise<DataChunk>> | null = null;

    /**
     * Reverse lookup map from rowId to { chunkIndex, localIndex } for O(1)
     * lookup in getRowIndex.
     */
    private rowIdToChunkInfo: Map<RowId, {
        chunkIndex: number;
        localIndex: number;
    }> | null = null;

    /**
     * Fingerprint of the last applied query; used to avoid clearing caches
     * when the query did not actually change.
     */
    private lastQueryFingerprint: string | null = null;

    /**
     * Epoch used to invalidate stale in-flight requests when the query changes.
     */
    private requestEpoch = 0;

    /**
     * Cached scoped datasets for provider-aware row pinning.
     */
    private scopedDatasets:
    Partial<Record<ProviderQueryScope, ScopedDataset>> = {};

    /**
     * Fingerprint for each cached scoped dataset.
     */
    private scopedFingerprints: Partial<Record<ProviderQueryScope, string>> = {
    };

    /**
     * Pinning-aware active view for row APIs.
     */
    private pinningActiveView?: ScopedDataset;

    /**
     * Abort controllers for in-flight requests (latest-only policy).
     */
    private pendingControllers: Set<AbortController> = new Set();

    /**
     * Returns the effective chunk size.
     * When pagination is enabled, uses the page size as chunk size,
     * so that one chunk = one page.
     */
    private get maxChunkSize(): number {
        const pagination = this.querying.pagination;

        // When pagination is enabled, chunk size = page size
        if (pagination.enabled) {
            return pagination.currentPageSize;
        }

        return this.options.chunkSize ?? RemoteDataProvider.DEFAULT_CHUNK_SIZE;
    }


    /* *
     *
     *  Methods
     *
     * */

    private get requestPolicy(): 'latest' | 'all' {
        return this.options.requestPolicy ?? 'latest';
    }

    private abortPendingRequests(): void {
        for (const controller of this.pendingControllers) {
            controller.abort();
        }
        this.pendingControllers.clear();
    }

    private createScopedQuery(scope: ProviderQueryScope): QueryingController {
        const filteringModifier = (
            scope === 'grouped' || scope === 'active' ?
                this.querying.filtering.modifier :
                void 0
        );
        const sortingModifier = (
            scope === 'grouped' ||
            scope === 'sortingOnly' ||
            scope === 'active' ?
                this.querying.sorting.modifier :
                void 0
        );

        return {
            ...this.querying,
            filtering: {
                ...this.querying.filtering,
                modifier: filteringModifier
            },
            sorting: {
                ...this.querying.sorting,
                modifier: sortingModifier
            },
            pagination: {
                ...this.querying.pagination,
                enabled: (
                    scope === 'active' ?
                        this.querying.pagination.enabled :
                        false
                ),
                currentPage: 1
            }
        } as QueryingController;
    }

    private getScopeFingerprint(scope: ProviderQueryScope): string {
        return `${scope}:${createQueryFingerprint(this.createScopedQuery(scope))}`;
    }

    private async fetchScopedChunk(
        scope: ProviderQueryScope,
        chunkIndex: number
    ): Promise<RemoteFetchCallbackResult> {
        const offset = chunkIndex * this.maxChunkSize;
        const limit = this.maxChunkSize;
        const query = this.createScopedQuery(scope);
        const { fetchCallback, dataSource } = this.options;

        if (fetchCallback) {
            return fetchCallback.call(this, query, offset, limit);
        }

        if (dataSource) {
            return dataSourceFetch(dataSource, {
                query,
                offset,
                limit
            });
        }

        throw new Error(
            'RemoteDataProvider: Either `dataSource` or `fetchCallback` must be provided in options.'
        );
    }

    private async ensureScopedDataset(
        scope: ProviderQueryScope
    ): Promise<ScopedDataset> {
        if (scope === 'active') {
            if (this.pinningActiveView) {
                return this.pinningActiveView;
            }
            const rowCount = await this.getRowCount();
            const rowIds: RowId[] = [];
            const rowObjects: RowObjectType[] = [];
            for (let i = 0; i < rowCount; ++i) {
                const rowId = await this.getRowId(i);
                if (rowId === void 0) {
                    continue;
                }
                rowIds.push(rowId);
                rowObjects.push(await this.getRowObject(i) || {});
            }
            return {
                rowIds,
                rowObjects,
                rowIdToIndex: createRowIdIndexMap(rowIds)
            };
        }

        const fingerprint = this.getScopeFingerprint(scope);
        if (this.scopedFingerprints[scope] === fingerprint) {
            const cached = this.scopedDatasets[scope];
            if (cached) {
                return cached;
            }
        }

        const first = await this.fetchScopedChunk(scope, 0);
        const totalCount = first.totalRowCount;
        const chunkCount = Math.max(
            1,
            Math.ceil(totalCount / this.maxChunkSize)
        );

        const rowIds: RowId[] = [];
        const rowObjects: RowObjectType[] = [];
        const appendChunk = (
            chunk: RemoteFetchCallbackResult,
            chunkOffset: number
        ): void => {
            const columnIds = Object.keys(chunk.columns);
            const rowLength = columnIds[0] ?
                (chunk.columns[columnIds[0]]?.length || 0) :
                0;
            const fallbackIds = chunk.rowIds || Array.from(
                { length: rowLength },
                (_, i): number => i + chunkOffset
            );
            const rowSettings = this.querying.grid.options?.rendering?.rows;
            const idColumn = (
                rowSettings?.pinning?.idColumn ||
                rowSettings?.pinned?.idColumn
            );
            const idColumnValues = (
                idColumn &&
                chunk.columns[idColumn] ?
                    chunk.columns[idColumn] :
                    void 0
            );

            for (let i = 0; i < rowLength; ++i) {
                const idColumnValue = idColumnValues?.[i];
                const rowId = (
                    typeof idColumnValue === 'string' ||
                    typeof idColumnValue === 'number'
                ) ?
                    idColumnValue :
                    fallbackIds[i];
                rowIds.push(rowId);

                const row: RowObjectType = {};
                for (const columnId of columnIds) {
                    row[columnId] = chunk.columns[columnId][i];
                }
                rowObjects.push(row);
            }
        };

        appendChunk(first, 0);

        for (let chunkIndex = 1; chunkIndex < chunkCount; ++chunkIndex) {
            const chunk = await this.fetchScopedChunk(scope, chunkIndex);
            appendChunk(chunk, chunkIndex * this.maxChunkSize);
        }

        const dataset: ScopedDataset = {
            rowIds,
            rowObjects,
            rowIdToIndex: createRowIdIndexMap(rowIds)
        };

        this.scopedDatasets[scope] = dataset;
        this.scopedFingerprints[scope] = fingerprint;
        return dataset;
    }

    private async getChunkForRowIndex(rowIndex: number): Promise<DataChunk> {
        // When pagination enabled, all rows for current page are in chunk 0
        // When disabled, calculate chunk from global index
        if (this.querying.pagination.enabled) {
            return await this.fetchChunk(0);
        }

        const chunkIndex = Math.floor(rowIndex / this.maxChunkSize);
        return await this.fetchChunk(chunkIndex);
    }

    /**
     * Gets the chunk index for a given row index.
     * When pagination is enabled, all rows are in chunk 0.
     *
     * @param rowIndex
     * The row index passed from the grid.
     *
     * @returns
     * The chunk index.
     */
    private getChunkIndexForRow(rowIndex: number): number {
        if (this.querying.pagination.enabled) {
            return 0;
        }
        return Math.floor(rowIndex / this.maxChunkSize);
    }

    /**
     * Gets the local index within the cached chunk data.
     * When pagination is enabled, rowIndex is already 0-based within the page.
     * When disabled, need to calculate offset within the chunk.
     *
     * @param rowIndex
     * The row index passed from the grid.
     *
     * @returns
     * The local index within the chunk.
     */
    private getLocalIndexInChunk(rowIndex: number): number {
        // When pagination enabled, rowIndex is already page-relative
        if (this.querying.pagination.enabled) {
            return rowIndex;
        }

        // Standard chunking: calculate local offset within chunk
        const chunkIndex = Math.floor(rowIndex / this.maxChunkSize);
        return rowIndex - (chunkIndex * this.maxChunkSize);
    }

    /**
     * Evicts the least recently used chunk if the cache limit is reached.
     * Also cleans up the reverse lookup map for evicted rowIds.
     */
    private evictLRUChunkIfNeeded(): void {
        const { chunksLimit } = this.options;

        if (
            !chunksLimit ||
            !this.dataChunks ||
            this.dataChunks.size < chunksLimit
        ) {
            return;
        }

        // Get the first (oldest/LRU) chunk
        const oldestKey = this.dataChunks.keys().next().value;
        if (oldestKey === void 0) {
            return;
        }

        const oldestChunk = this.dataChunks.get(oldestKey);

        // Clean up reverse lookup map for evicted chunk's rowIds
        if (oldestChunk && this.rowIdToChunkInfo) {
            for (const rowId of oldestChunk.rowIds) {
                this.rowIdToChunkInfo.delete(rowId);
            }
        }

        this.dataChunks.delete(oldestKey);
    }

    /**
     * Fetches a chunk from the remote server and caches it.
     * Deduplicates concurrent requests for the same chunk.
     *
     * @param chunkIndex
     * The index of the chunk to fetch.
     *
     * @returns
     * The cached chunk.
     */
    private async fetchChunk(chunkIndex: number): Promise<DataChunk> {
        if (!this.dataChunks) {
            this.dataChunks = new Map();
        }

        // Check if chunk is already cached (with LRU update)
        const existingChunk = this.dataChunks.get(chunkIndex);
        if (existingChunk) {
            // Move to end (most recently used) by re-inserting
            this.dataChunks.delete(chunkIndex);
            this.dataChunks.set(chunkIndex, existingChunk);
            return existingChunk;
        }

        // Check if there's already a pending request for this chunk
        if (!this.pendingChunks) {
            this.pendingChunks = new Map();
        }

        if (this.pendingChunks.has(chunkIndex)) {
            // Return the existing pending request to avoid duplicate fetches
            const pendingRequest = this.pendingChunks.get(chunkIndex);
            return pendingRequest!;
        }

        // Start a new fetch
        const requestEpoch = this.requestEpoch;
        const controller = this.requestPolicy === 'latest' ?
            new AbortController() :
            null;
        if (controller) {
            this.pendingControllers.add(controller);
        }
        const fetchPromise = (async (): Promise<DataChunk> => {
            try {
                const pagination = this.querying.pagination;
                let offset: number;
                let limit: number;

                if (pagination.enabled) {
                    // When pagination is enabled, fetch the current page
                    offset = (pagination.currentPage - 1) *
                        pagination.currentPageSize;
                    limit = pagination.currentPageSize;
                } else {
                    // Standard chunking
                    offset = chunkIndex * this.maxChunkSize;
                    limit = this.maxChunkSize;
                }

                let result: RemoteFetchCallbackResult;

                const { fetchCallback, dataSource } = this.options;
                if (fetchCallback) {
                    result = await fetchCallback.call(
                        this,
                        this.querying,
                        offset,
                        limit,
                        controller?.signal
                    );
                } else if (dataSource) {
                    result = await dataSourceFetch(dataSource, {
                        query: this.querying,
                        offset,
                        limit,
                        signal: controller?.signal
                    });
                } else {
                    throw new Error(
                        'RemoteDataProvider: Either `dataSource` or ' +
                        '`fetchCallback` must be provided in options.'
                    );
                }

                if (
                    requestEpoch !== this.requestEpoch ||
                    controller?.signal.aborted
                ) {
                    return {
                        index: chunkIndex,
                        data: {},
                        rowIds: []
                    };
                }

                this.columnIds = Object.keys(result.columns);
                this.prePaginationRowCount = result.totalRowCount;

                // Calculate actual row count from returned data
                const firstColumn = result.columns[this.columnIds[0]];
                const chunkRowCount = firstColumn ? firstColumn.length : 0;

                // When pagination enabled: rowCount = actual rows on page
                // When disabled: rowCount = prePaginationRowCount (same value)
                if (pagination.enabled) {
                    this.rowCount = chunkRowCount;
                } else {
                    this.rowCount = result.totalRowCount;
                }

                const chunk: DataChunk = {
                    index: chunkIndex,
                    data: result.columns,
                    rowIds: result.rowIds ?? Array.from(
                        { length: chunkRowCount },
                        (_, i): number => i + offset
                    )
                };

                // Evict LRU chunk if limit is reached
                this.evictLRUChunkIfNeeded();

                // DataChunks guaranteed to exist (checked at start)
                this.dataChunks?.set(chunkIndex, chunk);

                // Populate reverse lookup map for getRowIndex
                if (!this.rowIdToChunkInfo) {
                    this.rowIdToChunkInfo = new Map();
                }
                for (let i = 0; i < chunk.rowIds.length; i++) {
                    this.rowIdToChunkInfo.set(chunk.rowIds[i], {
                        chunkIndex,
                        localIndex: i
                    });
                }

                return chunk;
            } catch (err: unknown) {
                if (
                    controller?.signal.aborted ||
                    (err instanceof DOMException && err.name === 'AbortError')
                ) {
                    return {
                        index: chunkIndex,
                        data: {},
                        rowIds: []
                    };
                }
                // eslint-disable-next-line no-console
                console.error('Error fetching data from remote server.\n', err);
                return {
                    index: chunkIndex,
                    data: {},
                    rowIds: []
                };
            } finally {
                // Remove from pending requests when done (success or error)
                this.pendingChunks?.delete(chunkIndex);
                if (controller) {
                    this.pendingControllers.delete(controller);
                }
            }
        })();

        // Store the pending request
        this.pendingChunks.set(chunkIndex, fetchPromise);

        return fetchPromise;
    }

    public override async getColumnIds(): Promise<string[]> {
        if (this.columnIds) {
            return Promise.resolve(this.columnIds);
        }
        // Fetch first chunk to get columnIds
        await this.fetchChunk(0);
        return this.columnIds ?? [];
    }


    public override async getRowId(
        rowIndex: number
    ): Promise<RowId | undefined> {
        if (this.pinningActiveView) {
            return this.pinningActiveView.rowIds[rowIndex];
        }

        const chunk = await this.getChunkForRowIndex(rowIndex);
        const localIndex = this.getLocalIndexInChunk(rowIndex);

        if (localIndex < chunk.rowIds.length) {
            return chunk.rowIds[localIndex];
        }

        return void 0;
    }

    public override getRowIndex(
        rowId: RowId
    ): Promise<number | undefined> {
        if (this.pinningActiveView) {
            return Promise.resolve(
                this.pinningActiveView.rowIdToIndex.get(rowId)
            );
        }

        // Check reverse lookup map (O(1))
        const info = this.rowIdToChunkInfo?.get(rowId);
        if (info) {
            if (this.querying.pagination.enabled) {
                // When pagination is enabled, return page-relative index
                return Promise.resolve(info.localIndex);
            }
            // Global index: chunk offset + local index
            return Promise.resolve(
                info.chunkIndex * this.maxChunkSize + info.localIndex
            );
        }

        // Not found in cached chunks - return undefined
        // (the chunk containing this rowId hasn't been fetched yet)
        return Promise.resolve(void 0);
    }

    public override async getRowObject(
        rowIndex: number
    ): Promise<RowObjectType | undefined> {
        if (this.pinningActiveView) {
            return this.pinningActiveView.rowObjects[rowIndex];
        }

        // Ensure the chunk is fetched and cached
        await this.getChunkForRowIndex(rowIndex);

        // Return from cache
        return this.getRowObjectFromCache(rowIndex);
    }

    public override async getPrePaginationRowCount(): Promise<number> {
        if (this.prePaginationRowCount !== null) {
            return this.prePaginationRowCount;
        }
        // Fetch first chunk to get row count from API metadata
        await this.fetchChunk(0);
        return this.prePaginationRowCount ?? 0;
    }

    public override async getRowCount(): Promise<number> {
        if (this.pinningActiveView) {
            return this.pinningActiveView.rowIds.length;
        }

        if (this.rowCount !== null) {
            return this.rowCount;
        }
        // Fetch first chunk to get row count
        await this.fetchChunk(0);
        return this.rowCount ?? 0;
    }

    public override async getValue(
        columnId: string,
        rowIndex: number
    ): Promise<DataTableCellType> {
        if (this.pinningActiveView) {
            return this.pinningActiveView.rowObjects[rowIndex]?.[columnId] as
                DataTableCellType;
        }

        // Get the chunk containing this row
        const chunk = await this.getChunkForRowIndex(rowIndex);

        // Calculate local index within the chunk.
        // When pagination is enabled, rowIndex is already page-relative.
        // When disabled, need to calculate from global index.
        const localIndex = this.getLocalIndexInChunk(rowIndex);

        // Get the column from chunk data
        const column = chunk.data[columnId];
        if (!column || localIndex >= column.length) {
            return null;
        }

        return column[localIndex];
    }

    public override async setValue(
        value: DataTableCellType,
        columnId: string,
        rowId: RowId
    ): Promise<void> {
        const { setValueCallback } = this.options;

        if (!setValueCallback) {
            throw new Error(
                'The `setValueCallback` option is not defined.'
            );
        }

        try {
            await setValueCallback.call(
                this,
                columnId,
                rowId,
                value
            );

            this.lastQueryFingerprint = null;

            // TODO(optim): Can be optimized by checking if the value was
            // changed in the specific, queried column.

            await this.applyQuery();
        } catch (err: unknown) {
            const prefix = 'Error persisting value to remote server.';
            if (err instanceof Error) {
                err.message = err.message ?
                    `${prefix} ${err.message}` :
                    prefix;
                throw err;
            }
            throw new Error(`${prefix} ${String(err)}`);
        }
    }

    /**
     * Gets a row object from the local cache without fetching.
     * Returns undefined if the row is not cached.
     *
     * @param rowIndex
     * The row index as passed from the grid.
     *
     * @returns
     * The row object or undefined if not in cache.
     */
    private getRowObjectFromCache(rowIndex: number): RowObjectType | undefined {
        if (!this.dataChunks || !this.columnIds) {
            return;
        }

        const chunkIndex = this.getChunkIndexForRow(rowIndex);
        const chunk = this.dataChunks.get(chunkIndex);

        if (!chunk) {
            return;
        }

        const localIndex = this.getLocalIndexInChunk(rowIndex);
        const rowObject: RowObjectType = {};

        for (const columnId of this.columnIds) {
            const column = chunk.data[columnId];
            rowObject[columnId] = (column && localIndex < column.length) ?
                column[localIndex] : null;
        }

        return rowObject;
    }

    public override async getColumnDataType(
        columnId: string
    ): Promise<ColumnDataType> {
        const chunk = await this.getChunkForRowIndex(0);
        const column = chunk.data[columnId];
        if (!column) {
            return 'string';
        }

        if (!Array.isArray(column)) {
            // Typed array
            return 'number';
        }

        return DataProvider.assumeColumnDataType(column.slice(0, 30), columnId);
    }

    public override async getScopedRowCount(
        scope: ProviderQueryScope = 'active'
    ): Promise<number> {
        return (await this.ensureScopedDataset(scope)).rowIds.length;
    }

    public override async getScopedRowId(
        rowIndex: number,
        scope: ProviderQueryScope = 'active'
    ): Promise<RowId | undefined> {
        return (await this.ensureScopedDataset(scope)).rowIds[rowIndex];
    }

    public override async getScopedRowIndex(
        rowId: RowId,
        scope: ProviderQueryScope = 'active'
    ): Promise<number | undefined> {
        return (await this.ensureScopedDataset(scope))
            .rowIdToIndex.get(rowId);
    }

    public override async getScopedRowObject(
        rowIndex: number,
        scope: ProviderQueryScope = 'active'
    ): Promise<RowObjectType | undefined> {
        return (await this.ensureScopedDataset(scope)).rowObjects[rowIndex];
    }

    public override async getScopedRowsByIds(
        rowIds: RowId[],
        scope: ProviderQueryScope = 'active'
    ): Promise<Map<RowId, RowObjectType>> {
        const scoped = await this.ensureScopedDataset(scope);
        const rows = new Map<RowId, RowObjectType>();
        for (const rowId of rowIds) {
            const index = scoped.rowIdToIndex.get(rowId);
            if (index === void 0) {
                continue;
            }
            rows.set(rowId, scoped.rowObjects[index]);
        }
        return rows;
    }

    public override async setPinningView(
        state?: ProviderPinningViewState
    ): Promise<void> {
        if (!state) {
            this.pinningActiveView = void 0;
            return;
        }

        const activeRowIds = state.activeRowIds;
        const groupedRows = await this.getScopedRowsByIds(
            activeRowIds,
            'grouped'
        );
        const rawRows = await this.getScopedRowsByIds(activeRowIds, 'raw');
        const rowObjects: RowObjectType[] = [];

        for (const rowId of activeRowIds) {
            rowObjects.push(
                groupedRows.get(rowId) ||
                rawRows.get(rowId) ||
                {}
            );
        }

        this.pinningActiveView = {
            rowIds: activeRowIds.slice(),
            rowObjects,
            rowIdToIndex: createRowIdIndexMap(activeRowIds)
        };
    }

    public override async applyQuery(): Promise<void> {
        const fingerprint = createQueryFingerprint(this.querying);
        if (this.lastQueryFingerprint === fingerprint) {
            return;
        }
        this.lastQueryFingerprint = fingerprint;
        this.requestEpoch++;
        if (this.requestPolicy === 'latest') {
            this.abortPendingRequests();
        }

        // Clear cached chunks when query changes.
        this.dataChunks = null;
        this.pendingChunks = null;
        this.rowIdToChunkInfo = null;
        this.columnIds = null;
        this.prePaginationRowCount = null;
        this.rowCount = null;
        this.scopedDatasets = {};
        this.scopedFingerprints = {};
        this.pinningActiveView = void 0;

        // When pagination is enabled, update the total items count
        // for the pagination controller (used to calculate total pages).
        if (this.querying.pagination.enabled) {
            const totalCount = await this.getPrePaginationRowCount();
            this.querying.pagination.totalItemsCount = totalCount;
        }
    }

    public override destroy(): void {
        this.abortPendingRequests();
        this.dataChunks = null;
        this.pendingChunks = null;
        this.rowIdToChunkInfo = null;
        this.columnIds = null;
        this.prePaginationRowCount = null;
        this.rowCount = null;
        this.scopedDatasets = {};
        this.scopedFingerprints = {};
        this.pinningActiveView = void 0;
        this.lastQueryFingerprint = null;
        this.requestEpoch++;
    }
}

export interface RemoteFetchCallbackResult {
    columns: Record<string, DataTableColumnType>;
    totalRowCount: number;
    rowIds?: RowId[];
}

export interface DataChunk {
    index: number;
    data: Record<string, DataTableColumnType>;
    rowIds: RowId[];
}

interface ScopedDataset {
    rowIds: RowId[];
    rowObjects: RowObjectType[];
    rowIdToIndex: Map<RowId, number>;
}

/**
 * Create fast lookup map for row IDs.
 *
 * @param rowIds
 * Row IDs to index.
 */
function createRowIdIndexMap(rowIds: RowId[]): Map<RowId, number> {
    const map = new Map<RowId, number>();
    for (let i = 0, iEnd = rowIds.length; i < iEnd; ++i) {
        map.set(rowIds[i], i);
    }
    return map;
}

export interface RemoteDataProviderOptions extends DataProviderOptions {
    providerType: 'remote';

    /**
     * Serialized data source configuration, alternatively to `fetchCallback`.
     */
    dataSource?: DataSourceOptions;

    /**
     * Custom callback to fetch data from the remote server. Has higher priority
     * than `dataSource`.
     */
    fetchCallback?: (
        this: RemoteDataProvider,
        query: QueryingController,
        offset: number,
        limit: number,
        signal?: AbortSignal
    ) => Promise<RemoteFetchCallbackResult>;

    /**
     * Callback to persist value changes to the remote server. If not provided,
     * cell value editing will not be possible.
     *
     * The callback receives the column ID, row ID and value to set.
     */
    setValueCallback?: (
        this: RemoteDataProvider,
        columnId: string,
        rowId: RowId,
        value: DataTableCellType
    ) => Promise<void>;

    /**
     * The number of rows to fetch per chunk.
     */
    chunkSize?: number;

    /**
     * Maximum number of chunks to keep in memory. When exceeded, the least
     * recently used (LRU) chunk is evicted. If not set, all chunks are kept.
     */
    chunksLimit?: number;

    /**
     * Request policy for rapid query changes. `latest` aborts or ignores
     * in-flight requests so only the final query updates the cache.
     * @default 'latest'
     */
    requestPolicy?: 'latest' | 'all';
}

declare module '../../Core/Data/DataProviderType' {
    interface DataProviderTypeRegistry {
        remote: typeof RemoteDataProvider;
    }
}

DataProviderRegistry.registerDataProvider('remote', RemoteDataProvider);
