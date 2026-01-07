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

    /**
     * Gets the total number of rows in the data source.
     */
    public abstract getRowCount(): Promise<number>;


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
}

/**
 * A base interface for the data provider options (`grid.options.data`).
 */
export interface DataProviderOptions {
    providerType: string;
}
