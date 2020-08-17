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

/* *
 *
 *  Imports
 *
 * */

import type DataEventEmitter from '../DataEventEmitter';
import type DataJSON from '../DataJSON';
import type DataParser from '../Parsers/DataParser';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    fireEvent
} = U;


/* *
 *
 *  Class
 *
 * */

/**
 * Abstract class providing an interface for managing a DataStore
 */
abstract class DataStore<TEventObject extends DataStore.EventObject>
implements DataEventEmitter<TEventObject>, DataJSON.Class {

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Function for converting MetadataJSON to metadata array used within the
     * datastore
     * @param {DataStore.MetadataJSON} metadataJSON JSON containing metadata
     * @return {Array<DataStore.MetaColumn>}
     * Returns an array of MetaColumn objects
     */
    public static getMetadataFromJSON(metadataJSON: DataStore.MetadataJSON):
    Array<DataStore.MetaColumn> {
        const metadata = [];
        let elem;

        for (let i = 0, iEnd = metadataJSON.length; i < iEnd; i++) {
            elem = metadataJSON[i];

            if (elem instanceof Array && typeof elem[0] === 'string' &&
                typeof elem[1] === 'object' && !Array.isArray(elem[1])) {
                metadata.push({
                    name: elem[0],
                    metadata: elem[1] || {}
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

    /**
     * Constructor for the DataStore class
     * @param {DataTable} table
     * Optional DataTable to create the DataStore from
     */
    public constructor(table: DataTable = new DataTable()) {
        this.table = table;
        this.metadata = [];
    }

    /* *
    *
    *  Properties
    *
    * */

    /**
     * The DataParser responsible for handling converting the
     * provided data to a DataStore
     */
    public abstract readonly parser: DataParser<DataParser.EventObject>;

    /**
     * An array of MetaColumns that describes the content of each column in
     * the DataStore
     */
    public metadata: Array<DataStore.MetaColumn>;

    /**
     * The DataTable that the DataStore manages
     */
    public table: DataTable;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Method for adding metadata for a single column
     * @param {string} name
     * The name of the column to be described
     * @param {DataStore.Metadata} metadata
     * The metadata to apply to the column
     */
    public describeColumn(
        name: string,
        metadata: DataStore.MetadataType
    ): void {

        this.metadata.push({
            name: name,
            metadata: metadata
        });
    }

    /**
     * Method for applying metadata to the whole datastore
     * @param {Array<DataStore.MetaColumn>} metadata
     * An array of MetaColumn objects
     */
    public describe(metadata: Array<DataStore.MetaColumn>): void {
        this.metadata = metadata;
    }

    /**
     * Method for retriving metadata from a single column
     * @param {string} name
     * The identifier for the column that should be described
     * @return {DataStore.MetaColumn | void}
     * Returns a MetaColumn object if found
     */
    public whatIs(name: string): (DataStore.MetaColumn | void) {
        const metadata = this.metadata;
        let i;

        for (i = 0; i < metadata.length; i++) {
            if (metadata[i].name === name) {
                return metadata[i];
            }
        }
    }

    /**
     * Internal method for converting metadata to MetadataJSON
     * @return {DataStore.MetadataJSON}
     * Metadata converted to the MetadataJSON scheme
     */
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

    /**
     * The default load method, which fires the `afterLoad` event
     * @emits DataStore#afterLoad
     */
    public load(): void {
        fireEvent(this, 'afterLoad', { table: this.table });
    }

    /**
     * Emits an event on the modifier to all registered callbacks of this event.
     *
     * @param {DataStore.EventObject} [e]
     * Event object containing additional event information.
     */
    public emit(e: TEventObject): void {
        fireEvent(this, e.type, e);
    }

    /**
     * Registers a callback for a specific modifier event.
     *
     * @param {string} type
     * Event type as a string.
     *
     * @param {DataEventEmitter.EventCallback} callback
     * Function to register for an modifier callback.
     *
     * @return {Function}
     * Function to unregister callback from the modifier event.
     */
    public on(
        type: TEventObject['type'],
        callback: DataEventEmitter.EventCallback<this, TEventObject>
    ): Function {
        return addEvent(this, type, callback);
    }

    /**
     * Converts the class instance to ClassJSON
     */
    public abstract toJSON(): DataJSON.ClassJSON;

}

/* *
 *
 *  Namespace
 *
 * */

namespace DataStore {

    /**
     * The JSON schema for datastore metadata
     */
    export type MetadataJSON = Array<DataJSON.Array>;

    /**
     * The default event object for a datastore
     */
    export interface EventObject extends DataEventEmitter.EventObject {
        readonly table: DataTable;
    }

    /**
     * Metadata entry containing the name of the column
     * and a metadata object
     */
    export interface MetaColumn extends DataJSON.Object {
        name?: string;
        metadata?: Partial<MetadataType>;
    }

    /**
     * A metadata object
     */
    export type MetadataType = {
        title: string;
        dataType: DataJSON.Types;
        // validator: Function;
        defaultValue: string;
    }

}

export default DataStore;
