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

import type DT from '../../../Data/DataTable';
import type QueryingController from '../Querying/QueryingController';
import type { ColumnDataType } from '../Table/Column';

import U from '../../../Core/Utilities.js';
const { defined } = U;


export abstract class DataProvider {

    protected readonly querying: QueryingController;
    protected readonly options: DataProviderOptions;

    constructor(
        queryingController: QueryingController,
        options: DataProviderOptions
    ) {
        this.querying = queryingController;
        this.options = options;
    }

    public abstract getColumnIds(): Promise<string[]>;

    public abstract getRowId(rowIndex: number): Promise<number | undefined>;

    public abstract getRowIndex(rowId: number): Promise<number | undefined>;

    public abstract getRowObject(
        rowIndex: number
    ): Promise<DT.RowObject | undefined>;

    public abstract getRowCount(): Promise<number>;

    public abstract getColumnDataType(
        columnId: string
    ): Promise<ColumnDataType>;

    public abstract getValue(
        columnId: string,
        rowIndex: number
    ): Promise<DT.CellType>;

    public abstract setValue(
        value: DT.CellType,
        columnId: string,
        rowId: number
    ): Promise<void>;

    public abstract applyQuery(): Promise<void>;

    public abstract destroy(): void;

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
    providerType: string;
}


/* *
 *
 * Default Export
 *
 * */

export default DataProvider;
