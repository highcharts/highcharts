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

import Ajax from '../../Extensions/Ajax.js';
import DataStore from './DataStore.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
const { merge } = U;
import CSVDataParser from '../Parsers/CSVDataParser.js';
import DataJSON from './../DataJSON.js';
const { ajax } = Ajax;

/* eslint-disable no-invalid-this, require-jsdoc, valid-jsdoc */

/**
 * Class that handles creating a datastore from CSV
 */
class CSVDataStore extends DataStore<CSVDataStore.EventObjects> implements DataJSON.Class {

    /* *
     *
     *  Static Properties
     *
     * */
    protected static readonly defaultOptions: CSVDataStore.Options = {
        csv: '',
        csvURL: '',
        enablePolling: false,
        dataRefreshRate: 1
    }

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Creates a CSVDatastore from a ClassJSON object.
     *
     * @param {CSVDataStore.ClassJSON} json
     * Class JSON (usually with a $class property) to convert.
     *
     * @return {CSVDataStore}
     * CSVDataStore from the ClassJSON.
     */
    public static fromJSON(json: CSVDataStore.ClassJSON): CSVDataStore {
        const options = json.options,
            parser = CSVDataParser.fromJSON(json.parser),
            table = DataTable.fromJSON(json.table),
            store = new CSVDataStore(table, options, parser);

        store.describe(DataStore.getMetadataFromJSON(json.metadata));

        return store;
    }

    /* *
    *
    *  Constructors
    *
    * */

    /**
     * Constructs an instance of CSVDataStore
     *
     * @param {DataTable} table
     * Optional DataTable to create the store from
     *
     * @param {CSVDataStore.OptionsType} options
     * Options for the store and parser
     *
     * @param {DataParser} parser
     * Optional parser to replace the default parser
     */
    public constructor(
        table: DataTable = new DataTable(),
        options: CSVDataStore.OptionsType = {},
        parser?: CSVDataParser
    ) {
        super(table);

        const { csv, csvURL, enablePolling, dataRefreshRate, ...parserOptions } = options;

        this.options = merge(CSVDataStore.defaultOptions, { csv, csvURL, enablePolling, dataRefreshRate });
        this.parser = parser || new CSVDataParser(parserOptions);
    }


    /* *
    *
    *  Properties
    *
    * */

    /**
     * Options related to the handling of the CSV datastore,
     * i.e. source, fetching, polling
     */
    public readonly options: CSVDataStore.Options;

    /**
     * The attached parser, which can be replaced in the constructor
     */
    public readonly parser: CSVDataParser;

    /**
     * The URL to fetch if the source is external
     */
    private liveDataURL?: string;

    /**
     * The current timeout ID if polling is enabled
     */
    private liveDataTimeout?: number;

    /**
     * Handles polling of live data
     */
    private poll(): void {
        const { dataRefreshRate, enablePolling: pollingEnabled, csvURL } = this.options;
        const updateIntervalMs = (dataRefreshRate > 1 ? dataRefreshRate : 1) * 1000;
        if (pollingEnabled && csvURL === this.liveDataURL) {
            // We need to stop doing this if the URL has changed
            this.liveDataTimeout = setTimeout((): void => {
                this.fetchCSV();
            }, updateIntervalMs);
        }
    }

    /**
     * Fetches CSV from external source
     *
     * @param {boolean} initialFetch
     * Indicates whether this is a single fetch or a repeated fetch
     *
     * @param {Record<string,string>} [eventDetail]
     * Custom information for pending events.
     *
     * @emits CSVDataStore#load
     * @emits CSVDataStore#afterLoad
     * @emits CSVDataStore#loadError
     */
    private fetchCSV(
        initialFetch?: boolean,
        eventDetail?: Record<string, string>
    ): void {
        const store = this,
            maxRetries = 3,
            { csvURL } = store.options;
        let currentRetries: number;

        if (initialFetch) {
            clearTimeout(store.liveDataTimeout);
            store.liveDataURL = csvURL;
        }

        store.emit({ type: 'load', detail: eventDetail, table: store.table });

        ajax({
            url: store.liveDataURL,
            dataType: 'text',
            success: function (csv: string): void {
                store.parser.parse({ csv });
                if (store.liveDataURL) {
                    store.poll();
                }
                store.table = store.parser.getTable();
                store.emit({
                    type: 'afterLoad',
                    csv,
                    detail: eventDetail,
                    table: store.table
                });
            },
            error: function (xhr, error): void {
                if (++currentRetries < maxRetries) {
                    store.poll();
                }
                store.emit({
                    type: 'loadError',
                    detail: eventDetail,
                    error,
                    table: store.table,
                    xhr
                });
            }
        });
    }

    /**
     * Initiates the loading of the CSV source to the store
     *
     * @param {Record<string,string>} [eventDetail]
     * Custom information for pending events.
     *
     * @emits CSVDataParser#load
     * @emits CSVDataParser#afterLoad
     */
    public load(eventDetail?: Record<string, string>): void {
        const store = this,
            { csv, csvURL } = store.options;

        if (csv) {
            store.emit({
                type: 'load',
                csv,
                detail: eventDetail,
                table: store.table
            });
            store.parser.parse({ csv });
            store.table = store.parser.getTable();
            store.emit({
                type: 'afterLoad',
                csv,
                detail: eventDetail,
                table: store.table
            });
        } else if (csvURL) {
            store.fetchCSV(true, eventDetail);
        }
    }

    public save(): void {

    }

    /**
     * Converts the store to a class JSON.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this store.
     */
    public toJSON(): CSVDataStore.ClassJSON {
        const json: CSVDataStore.ClassJSON = {
            $class: 'CSVDataStore',
            metadata: this.getMetadataJSON(),
            options: merge(this.options),
            parser: this.parser.toJSON(),
            table: this.table.toJSON()
        };

        return json;
    }
}

/**
 *
 *  Namespace
 *
 */

/**
 * Types for class-specific options and events
 */
namespace CSVDataStore {

    /**
     * Event objects fired from CSVDataStore events
     */
    export type EventObjects = (ErrorEventObject|LoadEventObject);

    /**
     * Options for the CSVDataStore class constructor
     */
    export type OptionsType = Partial<(CSVDataStore.Options & CSVDataParser.OptionsType)>

    /**
     * The class JSON when importing/exporting CSVDataStore
     */
    export interface ClassJSON extends DataJSON.ClassJSON {
        metadata: DataStore.MetadataJSON;
        options: Options;
        parser: CSVDataParser.ClassJSON;
        table: DataTable.ClassJSON;
    }

    /**
     * @todo move this to the dataparser?
     */
    export interface DataBeforeParseCallbackFunction {
        (csv: string): string;
    }

    /**
     * The event object that is provided on errors within CSVDataStore
     */
    export interface ErrorEventObject extends DataStore.EventObject {
        type: ('loadError');
        error: (string|Error);
        xhr: XMLHttpRequest;
    }

    /**
     * The event object that is provided on load events within CSVDataStore
     */
    export interface LoadEventObject extends DataStore.EventObject {
        type: ('load'|'afterLoad');
        csv?: string;
    }

    /**
     * Internal options for CSVDataStore
     */
    export interface Options extends DataJSON.Object {
        csv: string;
        csvURL: string;
        enablePolling: boolean;
        dataRefreshRate: number;
    }

}

/* *
 *
 *  Registry
 *
 * */

declare module './Types' {
    interface DataStoreTypeRegistry {
        CSV: typeof CSVDataStore;
    }
}

/* *
 *
 *  Export
 *
 * */

export default CSVDataStore;
