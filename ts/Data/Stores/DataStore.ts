/* *
 *
 *  Data module
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    fireEvent
} = U;

import type DataValueType from '../DataValueType.js';

class DataStore {
    /* *
    *
    *  Constructors
    *
    * */

    public constructor(table: DataTable = new DataTable()) {
        this.table = table;
        this.metadata = [];
    }

    /* *
    *
    *  Properties
    *
    * */

    public table: DataTable;

    public metadata: Array<DataStore.MetaColumn>;

    /* *
    *
    *  Functions
    *
    * */

    public describeColumn(
        name: string,
        metadata: any
    ): void {

        this.metadata.push({
            name: name,
            metadata: metadata
        });
    }

    public describe(metadata: Array<DataStore.MetaColumn>): void {
        this.metadata = metadata;
    }

    public load(): void {
        fireEvent(this, 'afterLoad', { table: this.table });
    }

    public whatIs(name: string): (DataStore.MetaColumn|void) {
        const metadata = this.metadata;
        let i;

        for (i = 0; i < metadata.length; i++) {
            if (metadata[i].name === name) {
                return metadata[i];
            }
        }
    }

    public on(
        event: (DataStore.LoadEvents|DataStore.ParseEvents),
        callback: (DataStore.LoadEventListener|DataStore.ParseEventListener)
    ): Function {
        return addEvent(this, event, callback);
    }

}

namespace DataStore {

    export type LoadEvents = ('load'|'afterLoad'|'fail');

    export type ParseEvents = ('parse'|'afterParse'|'fail');

    export interface LoadEventListener {
        (this: DataStore, e: LoadEventObject): void;
    }

    export interface LoadEventObject {
        readonly table: DataTable;
    }

    export interface MetaColumn {
        name?: string;
        metadata?: any;
    }

    export interface ParseEventListener {
        (this: DataStore, e: ParseEventObject): void;
    }

    export interface ParseEventObject {
        readonly columns: DataValueType[][];
        readonly headers: string[];
    }

}

export default DataStore;
