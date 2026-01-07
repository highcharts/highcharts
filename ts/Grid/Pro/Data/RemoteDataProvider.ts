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

import { DataProvider } from '../../Core/Data/DataProvider.js';
import { registerDataProvider } from '../../Core/Data/DataProviderRegistry';
import QueryingController from '../../Core/Querying/QueryingController';


export class RemoteDataProvider extends DataProvider {

    private static readonly DEFAULT_CHUNK_SIZE: number = 50;

    public readonly options!: RemoteDataProviderOptions;

    private rowCount: number | null = null;
    private columnIds: string[] | null = null;
    private dataChunks: Map<number, DataChunk> | null = null;
    private pendingChunks: Map<number, Promise<DataChunk>> | null = null;

    private get maxChunkSize(): number {
        // TODO: Consider using the pagination page size if available as
        // default instead of or before the hardcoded value.
        return this.options.chunkSize ?? RemoteDataProvider.DEFAULT_CHUNK_SIZE;
    }

    private async getChunkForRowIndex(rowIndex: number): Promise<DataChunk> {
        const chunkIndex = Math.floor(rowIndex / this.maxChunkSize);
        return await this.fetchChunk(chunkIndex);
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
                const offset = chunkIndex * this.maxChunkSize;
                const limit = this.maxChunkSize;

                const result = await this.options.fetchCallback.call(
                    this,
                    this.querying,
                    offset,
                    limit
                );

                this.columnIds = Object.keys(result.columns);
                this.rowCount = result.totalRowCount;

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

    public override async getRowCount(): Promise<number> {
        if (this.rowCount !== null) {
            return Promise.resolve(this.rowCount);
        }
        // Fetch first chunk to get rowCount
        await this.fetchChunk(0);
        return this.rowCount ?? 0;
    }

    public override async getValue(
        columnId: string,
        rowIndex: number
    ): Promise<DT.CellType> {
        // Get the chunk containing this row
        const chunk = await this.getChunkForRowIndex(rowIndex);

        // Calculate local index within the chunk
        const chunkIndex = Math.floor(rowIndex / this.maxChunkSize);
        const localIndex = rowIndex - (chunkIndex * this.maxChunkSize);

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
     * The row index.
     *
     * @returns
     * The row object or undefined if not in cache.
     */
    private getRowObjectFromCache(rowIndex: number): DT.RowObject | undefined {
        if (!this.dataChunks || !this.columnIds) {
            return;
        }

        const chunkIndex = Math.floor(rowIndex / this.maxChunkSize);
        const chunk = this.dataChunks.get(chunkIndex);

        if (!chunk) {
            return;
        }

        const localIndex = rowIndex - (chunkIndex * this.maxChunkSize);
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
     * The row index.
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

        const chunkIndex = Math.floor(rowIndex / this.maxChunkSize);
        const chunk = this.dataChunks.get(chunkIndex);

        if (!chunk) {
            return;
        }

        const localIndex = rowIndex - (chunkIndex * this.maxChunkSize);
        const column = chunk.data[columnId];

        if (column && localIndex < column.length) {
            column[localIndex] = value;
        }
    }

    public override applyQuery(): Promise<void> {
        // TODO: Check if the query fingerprint is the same as the previous one
        // If it is, do nothing. If not, do the following:

        // eslint-disable-next-line no-console
        console.log('debug: applyQuery');

        // Clear cached chunks when query changes.
        this.dataChunks = null;
        this.pendingChunks = null;
        this.columnIds = null;
        this.rowCount = null;

        return Promise.resolve();
    }

    public destroy(): void {
        this.dataChunks = null;
        this.pendingChunks = null;
        this.columnIds = null;
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

registerDataProvider('remote', RemoteDataProvider);
