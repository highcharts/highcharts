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

import type DT from '../../../Data/DataTable';
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
    public abstract getRowId(rowIndex: number): Promise<number | undefined>;

    /**
     * Returns the current row index for a given stable row id.
     */
    public abstract getRowIndex(rowId: number): Promise<number | undefined>;

    /**
     * Returns a row as an object keyed by column IDs.
     */
    public abstract getRowObject(
        rowIndex: number
    ): Promise<DT.RowObject | undefined>;

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
    ): Promise<DT.CellType>;

    /**
     * Persists a cell value for a given row id.
     */
    public abstract setValue(
        value: DT.CellType,
        columnId: string,
        rowId: number
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
        columnSample: DT.Column,
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

/**
 * A base interface for the data provider options (`grid.options.data`).
 */
export interface DataProviderOptions {
    /**
     * The type of the data provider.
     */
    providerType: string;
}


/* *
 *
 * Default Export
 *
 * */

export default DataProvider;
