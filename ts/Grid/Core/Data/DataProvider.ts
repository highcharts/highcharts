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
 *  - Dawid Draguła
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import type DataTable from '../../../Data/DataTable';
import type {
    RowObject as RowObjectType,
    CellType as DataTableCellType,
    Column as DataTableColumnType
} from '../../../Data/DataTable';
import { defined } from '../../../Shared/Utilities.js';
import type QueryingController from '../Querying/QueryingController';
import type { ColumnDataType } from '../Table/Column';


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
     * Initializes the data provider.
     */
    public init(): Promise<void> {
        return Promise.resolve();
    }

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
     * Whether this provider supports inserting and deleting rows.
     * Default: `false`. Override in providers that can mutate row structure.
     */
    public supportsRowMutation(): boolean {
        return false;
    }

    /**
     * Whether this provider supports inserting and deleting columns.
     * Default: `false`. Override in providers that can mutate column structure.
     */
    public supportsColumnMutation(): boolean {
        return false;
    }

    /**
     * Inserts a row at the given index in the source data table.
     *
     * Providers that do not support row mutation should not override this
     * method (the default rejects).
     *
     * @param row
     * Row data keyed by source column id.
     *
     * @param atOriginalIndex
     * Target index in the source (unfiltered, unsorted) data table.
     *
     * @return
     * Resolves with the inserted row's id (when derivable from the id
     * column), or `undefined`.
     */
    public insertRow(
        row: RowObjectType,
        atOriginalIndex: number
    ): Promise<RowId | undefined> {
        void row;
        void atOriginalIndex;
        return Promise.reject(
            new Error('insertRow is not supported by this data provider.')
        );
    }

    /**
     * Deletes a row by id.
     *
     * @param rowId
     * Id of the row to delete.
     */
    public deleteRow(
        rowId: RowId
    ): Promise<void> {
        void rowId;
        return Promise.reject(
            new Error('deleteRow is not supported by this data provider.')
        );
    }

    /**
     * Inserts a column into the source data table.
     *
     * @param columnId
     * Id of the new column.
     *
     * @param column
     * Initial column data (aligned with existing row count).
     */
    public insertColumn(
        columnId: string,
        column: DataTableColumnType
    ): Promise<void> {
        void columnId;
        void column;
        return Promise.reject(
            new Error('insertColumn is not supported by this data provider.')
        );
    }

    /**
     * Deletes a column by id from the source data table.
     *
     * @param columnId
     * Id of the column to delete.
     */
    public deleteColumn(
        columnId: string
    ): Promise<void> {
        void columnId;
        return Promise.reject(
            new Error('deleteColumn is not supported by this data provider.')
        );
    }

    /**
     * Returns the original (pre-query) source index for a given row id, or
     * `undefined` when the row id is unknown.
     *
     * Default: resolves `undefined`. Providers with access to the source
     * table should override.
     *
     * @param rowId
     * Row id to resolve.
     */
    public getOriginalRowIndex(
        rowId: RowId
    ): Promise<number | undefined> {
        void rowId;
        return Promise.resolve(void 0);
    }

    /**
     * Returns the number of items before pagination has been applied.
     */
    public async getPrePaginationRowCount(): Promise<number> {
        return await this.getRowCount();
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
 * A data provider that can expose the underlying data table.
 */
export interface DataTableProvider extends DataProvider {
    getDataTable(presentation?: boolean): DataTable | undefined;
}

/**
 * Returns whether the provider exposes `getDataTable`.
 *
 * @param provider
 * Data provider instance to test.
 *
 * @returns
 * `true` when provider exposes `getDataTable`.
 */
export function hasDataTableProvider(
    provider: unknown
): provider is DataTableProvider {
    return !!(
        provider &&
        typeof (
            provider as {
                getDataTable?: unknown;
            }
        ).getDataTable === 'function'
    );
}

/**
 * A base interface for the data provider options (`grid.options.data`).
 */
export interface DataProviderOptions {
    /**
     * The type of the data provider.
     *
     * @default 'local'
     */
    providerType?: string;

    /**
     * Whether columns should be generated automatically from data source
     * column ids.
     *
     * If set to `false`, only columns explicitly configured in `columns[]`
     * (or referenced by `header`) will be rendered.
     *
     * With `autogenerateColumns: true` and no `header`, source columns are
     * rendered in provider order, and custom configured columns are appended
     * at the end in their definition order.
     *
     * @sample grid-lite/basic/autogenerate-columns-disabled Manual columns only
     *
     * @default true
     */
    autogenerateColumns?: boolean;
}


/* *
 *
 * Default Export
 *
 * */

export default DataProvider;
