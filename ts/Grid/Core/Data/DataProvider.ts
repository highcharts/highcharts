/* *
 *
 *  Data Provider abstract class
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
    CellType as DataTableCellType,
    Column as DataTableColumnType
} from '../../../Data/DataTable';
import type QueryingController from '../Querying/QueryingController';
import type { ColumnDataType } from '../Table/Column';

import U from '../../../Core/Utilities.js';
const { defined } = U;


/**
 * Base class for Grid data providers.
 *
 * Data providers are responsible for serving data to the grid, applying query
 * modifiers and persisting edits.
 */
export abstract class DataProvider {

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Querying controller used to build and apply modifiers.
     */
    protected readonly querying: QueryingController;

    /**
     * Provider options as passed via `grid.options.data`.
     */
    protected readonly options: DataProviderOptions;

    /* *
     *
     *  Constructor
     *
     * */

    constructor(
        queryingController: QueryingController,
        options: DataProviderOptions
    ) {
        this.querying = queryingController;
        this.options = options;
    }

    /* *
     *
     *  Methods
     *
     * */

    /**
     * Returns all available column IDs.
     */
    public abstract getColumnIds(): Promise<string[]>;

    /**
     * Returns a stable row id for a given row index (as used by the viewport).
     */
    public abstract getRowId(rowIndex: number): Promise<RowId | undefined>;

    /**
     * Returns the current row index for a given stable row id.
     */
    public abstract getRowIndex(rowId: RowId): Promise<number | undefined>;

    /**
     * Returns a row as an object keyed by column IDs.
     */
    public abstract getRowObject(
        rowIndex: number
    ): Promise<RowObjectType | undefined>;

    /**
     * Returns the current number of rows in the presentation dataset (after
     * applying all query modifiers).
     */
    public abstract getRowCount(): Promise<number>;

    /**
     * Returns the assumed / configured data type for a column.
     */
    public abstract getColumnDataType(
        columnId: string
    ): Promise<ColumnDataType>;

    /**
     * Returns a cell value for a given column and row index.
     */
    public abstract getValue(
        columnId: string,
        rowIndex: number
    ): Promise<DataTableCellType>;

    /**
     * Persists a cell value for a given row id.
     */
    public abstract setValue(
        value: DataTableCellType,
        columnId: string,
        rowId: RowId
    ): Promise<void>;

    /**
     * Applies the current query modifiers to update the provider's presentation
     * state.
     */
    public abstract applyQuery(): Promise<void>;

    /**
     * Destroys the provider and releases resources.
     */
    public abstract destroy(): void;

    /**
     * Returns the number of rows in a specific query scope.
     *
     * @param scope
     * The query scope to read.
     */
    public async getScopedRowCount(
        scope: ProviderQueryScope = 'active'
    ): Promise<number> {
        if (scope !== 'active') {
            this.warnScopeFallback(scope, 'getScopedRowCount');
        }
        return this.getRowCount();
    }

    /**
     * Returns row index for a row ID in a specific query scope.
     *
     * @param rowId
     * The row ID to find.
     *
     * @param scope
     * The query scope to read.
     */
    public async getScopedRowIndex(
        rowId: RowId,
        scope: ProviderQueryScope = 'active'
    ): Promise<number | undefined> {
        if (scope === 'active') {
            return this.getRowIndex(rowId);
        }

        this.warnScopeFallback(scope, 'getScopedRowIndex');
        const rowCount = await this.getScopedRowCount(scope);
        for (let i = 0; i < rowCount; ++i) {
            const scopedRowId = await this.getScopedRowId(i, scope);
            if (scopedRowId === rowId) {
                return i;
            }
        }
    }

    /**
     * Returns row ID for a row index in a specific query scope.
     *
     * @param rowIndex
     * The row index in the scope.
     *
     * @param scope
     * The query scope to read.
     */
    public async getScopedRowId(
        rowIndex: number,
        scope: ProviderQueryScope = 'active'
    ): Promise<RowId | undefined> {
        if (scope !== 'active') {
            this.warnScopeFallback(scope, 'getScopedRowId');
        }
        return this.getRowId(rowIndex);
    }

    /**
     * Returns row object for a row index in a specific query scope.
     *
     * @param rowIndex
     * The row index in the scope.
     *
     * @param scope
     * The query scope to read.
     */
    public async getScopedRowObject(
        rowIndex: number,
        scope: ProviderQueryScope = 'active'
    ): Promise<RowObjectType | undefined> {
        if (scope !== 'active') {
            this.warnScopeFallback(scope, 'getScopedRowObject');
        }
        return this.getRowObject(rowIndex);
    }

    /**
     * Returns row objects keyed by row ID for provided row IDs in a scope.
     *
     * @param rowIds
     * Row IDs to resolve.
     *
     * @param scope
     * The query scope to read.
     */
    public async getScopedRowsByIds(
        rowIds: RowId[],
        scope: ProviderQueryScope = 'active'
    ): Promise<Map<RowId, RowObjectType>> {
        const result = new Map<RowId, RowObjectType>();
        for (const rowId of rowIds) {
            const rowIndex = await this.getScopedRowIndex(rowId, scope);
            if (rowIndex === void 0) {
                continue;
            }
            const row = await this.getScopedRowObject(rowIndex, scope);
            if (row) {
                result.set(rowId, row);
            }
        }
        return result;
    }

    /**
     * Applies row pinning view state.
     *
     * @param state
     * Pinning view state.
     */
    public setPinningView(
        state?: ProviderPinningViewState
    ): Promise<void> {
        void state;
        // Overridden in providers that support scoped pinning views.
        return Promise.resolve();
    }

    /**
     * Returns the number of items before pagination has been applied.
     */
    public async getPrePaginationRowCount(): Promise<number> {
        return await this.getRowCount();
    }

    /**
     * Warn about expensive fallback scoped operations once per scope+method.
     *
     * @param scope
     * The scope that uses fallback.
     *
     * @param methodName
     * The fallback method name.
     */
    protected warnScopeFallback(
        scope: ProviderQueryScope,
        methodName: string
    ): void {
        const key = `${this.constructor.name}:${scope}:${methodName}`;
        if (fallbackWarnings.has(key)) {
            return;
        }
        fallbackWarnings.add(key);
        // eslint-disable-next-line no-console
        console.warn(
            `Grid ${this.constructor.name}: falling back to active-scope ` +
            `implementation for "${methodName}" in "${scope}" scope.`
        );
    }

    /**
     * Helper method to assume the data type of a column based on the sample
     * of the column data.
     *
     * @param columnSample
     * The sample of the column data to determine the data type from.
     *
     * @param columnId
     * The id of the column to determine the data type for.
     */
    protected static assumeColumnDataType(
        columnSample: DataTableColumnType,
        columnId: string
    ): ColumnDataType {
        for (let i = 0, iEnd = columnSample.length; i < iEnd; ++i) {
            if (!defined(columnSample[i])) {
                // If the data is null or undefined, we should look
                // at the next value to determine the type.
                continue;
            }

            switch (typeof columnSample[i]) {
                case 'number':
                    return 'number';
                case 'boolean':
                    return 'boolean';
                default:
                    return 'string';
            }
        }

        // eslint-disable-next-line no-console
        console.warn(
            `Column "${columnId}" sample does not contain any defined ` +
            'values; defaulting dataType to "string". Set `dataType` option ' +
            'for the column to determine the data type and avoid unnecessary ' +
            'column scanning.'
        );

        return 'string';
    }
}

/* *
 *
 *  Types
 *
 * */

/**
 * A type for the row ID.
 */
export type RowId = number | string;

/**
 * Query scope used by provider-aware row pinning.
 */
export type ProviderQueryScope = 'raw' | 'grouped' | 'sortingOnly' | 'active';

/**
 * Provider view state for row pinning.
 */
export interface ProviderPinningViewState {
    topRowIds: RowId[];
    bottomRowIds: RowId[];
    scrollableRowIds: RowId[];
    activeRowIds: RowId[];
    topCount: number;
    bottomCount: number;
    scrollableCount: number;
}

/**
 * A base interface for the data provider options (`grid.options.data`).
 */
export interface DataProviderOptions {
    /**
     * The type of the data provider.
     */
    providerType: string;
}

const fallbackWarnings = new Set<string>();


/* *
 *
 * Default Export
 *
 * */

export default DataProvider;
