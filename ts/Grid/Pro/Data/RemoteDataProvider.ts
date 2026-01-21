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
import type { DataProviderOptions, RowId } from '../../Core/Data/DataProvider';
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
                        limit
                    );
                } else if (dataSource) {
                    result = await dataSourceFetch(dataSource, {
                        query: this.querying,
                        offset,
                        limit
                    });
                } else {
                    throw new Error(
                        'RemoteDataProvider: Either `dataSource` or ' +
                        '`fetchCallback` must be provided in options.'
                    );
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
        } catch {
            throw new Error('Error persisting value to remote server.');
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

    public override async applyQuery(): Promise<void> {
        const fingerprint = createQueryFingerprint(this.querying);
        if (this.lastQueryFingerprint === fingerprint) {
            return;
        }
        this.lastQueryFingerprint = fingerprint;

        // Clear cached chunks when query changes.
        this.dataChunks = null;
        this.pendingChunks = null;
        this.rowIdToChunkInfo = null;
        this.columnIds = null;
        this.prePaginationRowCount = null;
        this.rowCount = null;

        // When pagination is enabled, update the total items count
        // for the pagination controller (used to calculate total pages).
        if (this.querying.pagination.enabled) {
            const totalCount = await this.getPrePaginationRowCount();
            this.querying.pagination.totalItemsCount = totalCount;
        }
    }

    public override destroy(): void {
        this.dataChunks = null;
        this.pendingChunks = null;
        this.rowIdToChunkInfo = null;
        this.columnIds = null;
        this.prePaginationRowCount = null;
        this.rowCount = null;
        this.lastQueryFingerprint = null;
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
        limit: number
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
}

declare module '../../Core/Data/DataProviderType' {
    interface DataProviderTypeRegistry {
        remote: typeof RemoteDataProvider;
    }
}

DataProviderRegistry.registerDataProvider('remote', RemoteDataProvider);
