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

import type DT from '../../../Data/DataTable';
import type { DataProviderOptions } from '../../Core/Data/DataProvider';
import type { ColumnDataType } from '../../Core/Table/Column';
import type QueryingController from '../../Core/Querying/QueryingController';

import { DataProvider } from '../../Core/Data/DataProvider.js';
import DataProviderRegistry from '../../Core/Data/DataProviderRegistry';


export class RemoteDataProvider extends DataProvider {

    private static readonly DEFAULT_CHUNK_SIZE: number = 50;

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

    private columnIds: string[] | null = null;
    private dataChunks: Map<number, DataChunk> | null = null;
    private pendingChunks: Map<number, Promise<DataChunk>> | null = null;

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

        // Check if chunk is already cached
        const existingChunk = this.dataChunks.get(chunkIndex);
        if (existingChunk) {
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

                const result = await this.options.fetchCallback.call(
                    this,
                    this.querying,
                    offset,
                    limit
                );

                this.columnIds = Object.keys(result.columns);
                this.prePaginationRowCount = result.totalRowCount;

                // Calculate actual row count from returned data
                const firstColumn = result.columns[this.columnIds[0]];
                const chunkRowCount = firstColumn ? firstColumn.length : 0;

                // When pagination enabled: rowCount = actual rows on page
                // When disabled: rowCount = prePaginationRowCount (same value)
                if (this.querying.pagination.enabled) {
                    this.rowCount = chunkRowCount;
                } else {
                    this.rowCount = result.totalRowCount;
                }

                const chunk: DataChunk = {
                    index: chunkIndex,
                    data: result.columns
                };

                // DataChunks guaranteed to exist (checked at start)
                if (this.dataChunks) {
                    this.dataChunks.set(chunkIndex, chunk);
                }

                return chunk;
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

    public override getRowId(rowIndex: number): Promise<number | undefined> {
        // TODO: Implement this.
        return Promise.resolve(rowIndex);
    }

    public override getRowIndex(rowId: number): Promise<number | undefined> {
        // TODO: Implement this.
        return Promise.resolve(rowId);
    }

    public override async getRowObject(
        rowIndex: number
    ): Promise<DT.RowObject | undefined> {
        // Ensure the chunk is fetched and cached
        await this.getChunkForRowIndex(rowIndex);

        // Return from cache
        return this.getRowObjectFromCache(rowIndex);
    }

    /**
     * Returns the total row count before pagination.
     * Used by PaginationController to calculate total pages.
     */
    public override async getPrePaginationRowCount(): Promise<number> {
        if (this.prePaginationRowCount !== null) {
            return this.prePaginationRowCount;
        }
        // Fetch first chunk to get row count from API metadata
        await this.fetchChunk(0);
        return this.prePaginationRowCount ?? 0;
    }

    /**
     * Returns the row count for the current view (after all modifiers).
     * When pagination is enabled, returns actual rows on current page.
     * Otherwise, returns total row count.
     */
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
    ): Promise<DT.CellType> {
        // Get the chunk containing this row
        const chunk = await this.getChunkForRowIndex(rowIndex);

        // Calculate local index within the chunk.
        // When pagination is enabled, rowIndex is already page-relative.
        // When disabled, need to calculate from global index.
        const localIndex = this.getLocalIndexInChunk(rowIndex);

        // Get the column from chunk data
        const column = chunk.data[columnId];
        if (!column || localIndex >= column.length) {
            return null as DT.CellType;
        }

        return column[localIndex];
    }

    public override async setValue(
        value: DT.CellType,
        columnId: string,
        rowIndex: number
    ): Promise<void> {
        const { setValueCallback } = this.options;

        // If callback is defined, call it to persist to the server
        if (setValueCallback) {
            // Get row object from cache for the callback
            const rowObject = this.getRowObjectFromCache(rowIndex);

            await setValueCallback.call(
                this,
                columnId,
                rowIndex,
                value,
                rowObject
            );
        }

        // Update the local cache
        this.updateCachedValue(columnId, rowIndex, value);
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
    private getRowObjectFromCache(rowIndex: number): DT.RowObject | undefined {
        if (!this.dataChunks || !this.columnIds) {
            return;
        }

        const chunkIndex = this.getChunkIndexForRow(rowIndex);
        const chunk = this.dataChunks.get(chunkIndex);

        if (!chunk) {
            return;
        }

        const localIndex = this.getLocalIndexInChunk(rowIndex);
        const rowObject: DT.RowObject = {};

        for (const columnId of this.columnIds) {
            const column = chunk.data[columnId];
            rowObject[columnId] = (column && localIndex < column.length) ?
                column[localIndex] :
                (null as DT.CellType);
        }

        return rowObject;
    }

    /**
     * Updates a value in the local cache without sending to the server.
     *
     * @param columnId
     * The column ID.
     *
     * @param rowIndex
     * The row index as passed from the grid.
     *
     * @param value
     * The new value.
     */
    private updateCachedValue(
        columnId: string,
        rowIndex: number,
        value: DT.CellType
    ): void {
        if (!this.dataChunks) {
            return;
        }

        const chunkIndex = this.getChunkIndexForRow(rowIndex);
        const chunk = this.dataChunks.get(chunkIndex);

        if (!chunk) {
            return;
        }

        const localIndex = this.getLocalIndexInChunk(rowIndex);
        const column = chunk.data[columnId];

        if (column && localIndex < column.length) {
            column[localIndex] = value;
        }
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
        // TODO: Check if the query fingerprint is the same as the previous one
        // If it is, do nothing. If not, do the following:

        // eslint-disable-next-line no-console
        console.log('debug: applyQuery');

        // Clear cached chunks when query changes.
        this.dataChunks = null;
        this.pendingChunks = null;
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

    public destroy(): void {
        this.dataChunks = null;
        this.pendingChunks = null;
        this.columnIds = null;
        this.prePaginationRowCount = null;
        this.rowCount = null;
    }
}

export interface RemoteFetchCallbackResult {
    columns: Record<string, DT.Column>;
    currentPage: number;
    pageSize: number;
    totalRowCount: number;
}

export interface DataChunk {
    index: number;
    data: Record<string, DT.Column>;
}

export interface RemoteDataProviderOptions extends DataProviderOptions {
    providerType: 'remote';

    /**
     * Callback to fetch data from the remote server.
     */
    fetchCallback: (
        this: RemoteDataProvider,
        query: QueryingController,
        offset: number,
        limit: number
    ) => Promise<RemoteFetchCallbackResult>;

    /**
     * Optional callback to persist value changes to the remote server.
     * If not provided, changes will only be cached locally.
     *
     * The callback receives the full row object from cache, allowing you to
     * extract any column value (e.g., a unique ID) for your API call.
     */
    setValueCallback?: (
        this: RemoteDataProvider,
        columnId: string,
        rowIndex: number,
        value: DT.CellType,
        rowObject: DT.RowObject | undefined
    ) => Promise<void>;

    /**
     * The number of rows to fetch per chunk.
     */
    chunkSize: number;
}

declare module '../../Core/Data/DataProviderType' {
    interface DataProviderTypeRegistry {
        remote: typeof RemoteDataProvider;
    }
}

DataProviderRegistry.registerDataProvider('remote', RemoteDataProvider);
