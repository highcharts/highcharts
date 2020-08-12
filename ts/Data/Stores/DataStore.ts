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

import type DataEventEmitter from '../DataEventEmitter';
import DataJSON from '../DataJSON.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    fireEvent
} = U;

abstract class DataStore<TEventObject extends DataStore.EventObject> implements DataEventEmitter<TEventObject> {

    /* *
     *
     *  Static Functions
     *
     * */

    public static getMetadataFromJSON(metadataJSON: DataStore.MetadataJSON):
    Array<DataStore.MetaColumn> {
        const metadata = [];
        let elem;

        for (let i = 0, iEnd = metadataJSON.length; i < iEnd; i++) {
            elem = metadataJSON[i];

            if (elem instanceof Array && typeof elem[0] === 'string') {
                metadata.push({
                    name: elem[0],
                    metadata: elem[1]
                });
            }
        }

        return metadata;
    }

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

    public emit(e: TEventObject): void {
        fireEvent(this, e.type, e);
    }

    protected getMetadataJSON(): DataStore.MetadataJSON {
        const json = [];
        let elem;

        for (let i = 0, iEnd = this.metadata.length; i < iEnd; i++) {
            elem = this.metadata[i];

            json.push([
                elem.name,
                elem.metadata
            ]);
        }

        return json;
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
        type: TEventObject['type'],
        callback: DataEventEmitter.EventCallback<this, TEventObject>
    ): Function {
        return addEvent(this, type, callback);
    }

}

namespace DataStore {

    export type MetadataJSON = Array<DataJSON.Array>;

    export interface EventObject extends DataEventEmitter.EventObject {
        readonly table: DataTable;
    }

    export interface MetaColumn {
        name?: string;
        metadata?: any;
    }

}

export default DataStore;
