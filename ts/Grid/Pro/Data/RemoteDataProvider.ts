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

import type DataTable from '../../../Data/DataTable';
import type { DataProviderOptions } from '../../Core/Data/DataProvider';

import { DataProvider } from '../../Core/Data/DataProvider.js';
import { registerDataProvider } from '../../Core/Data/DataProviderRegistry';
import QueryingController from '../../Core/Querying/QueryingController';

/* eslint-disable @typescript-eslint/no-unused-vars */

export class RemoteDataProvider extends DataProvider {

    public readonly options!: RemoteDataProviderOptions;

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(
        queryingController: QueryingController,
        options: RemoteDataProviderOptions
    ) {
        super(queryingController, options);
    }

    public override getColumnIds(): Promise<string[]> {
        throw new Error('Method not implemented.');
    }

    public override getRowId(rowIndex: number): Promise<number | undefined> {
        // TODO: Implement this.
        return Promise.resolve(rowIndex);
    }

    public override getRowIndex(rowId: number): Promise<number | undefined> {
        // TODO: Implement this.
        return Promise.resolve(rowId);
    }

    public override getRowObject(
        rowIndex: number
    ): Promise<DataTable.RowObject | undefined> {
        throw new Error('Method not implemented.');
    }

    public override getRowCount(): Promise<number> {
        throw new Error('Method not implemented.');
    }

    public override getValue(
        columnId: string,
        rowIndex: number
    ): Promise<DataTable.CellType> {
        throw new Error('Method not implemented.');
    }

    public override setValue(
        value: DataTable.CellType,
        columnId: string,
        rowIndex: number
    ): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public override applyQuery(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public destroy(): void {
        throw new Error('Method not implemented.');
    }
}

export interface RemoteDataProviderOptions extends DataProviderOptions {
    providerType: 'remote';
}

declare module '../../Core/Data/DataProviderType' {
    interface DataProviderTypeRegistry {
        remote: typeof RemoteDataProvider;
    }
}

registerDataProvider('remote', RemoteDataProvider);
