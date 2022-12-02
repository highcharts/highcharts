/* *
 *
 *  (c) 2012-2021 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Torstein Hønsi
 *  - Christer Vasseng
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataEvent from '../DataEvent';
import type JSON from '../../Core/JSON';

import CSVParser from '../Parsers/CSVParser.js';
import DataPromise from '../DataPromise.js';
import DataStore from './DataStore.js';
import DataTable from '../DataTable.js';
import HU from '../../Core/HttpUtilities.js';
const { ajax } = HU;
import U from '../../Core/Utilities.js';
const {
    merge,
    objectEach
} = U;

/* *
 *
 *  Class
 *
 * */

/* eslint-disable no-invalid-this, require-jsdoc, valid-jsdoc */

/**
 * Class that handles creating a datastore from CSV
 *
 * @private
 */
class CSVStore extends DataStore {

    /* *
     *
     *  Static Properties
     *
     * */

    protected static readonly defaultOptions: CSVStore.Options = {
        csv: '',
        csvURL: '',
        enablePolling: false,
        dataRefreshRate: 1
    };

    /* *
    *
    *  Constructors
    *
    * */

    /**
     * Constructs an instance of CSVDataStore.
     *
     * @param {DataTable} table
     * Optional table to create the store from.
     *
     * @param {CSVStore.OptionsType} options
     * Options for the store and parser.
     *
     * @param {DataParser} parser
     * Optional parser to replace the default parser.
     */
    public constructor(
        table: DataTable = new DataTable(),
        options: CSVStore.OptionsType = {},
        parser?: CSVParser
    ) {
        super(table);

        const {
            csv,
            csvURL,
            enablePolling,
            dataRefreshRate,
            ...parserOptions
        } = options;

        this.parserOptions = parserOptions;
        this.options = merge(
            CSVStore.defaultOptions,
            { csv, csvURL, enablePolling, dataRefreshRate }
        );
        this.parser = parser || new CSVParser(parserOptions);
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
    public readonly options: CSVStore.Options;

    /**
     * The attached parser, which can be replaced in the constructor
     */
    public readonly parser: CSVParser;

    /**
     * The options that were passed to the parser.
     */
    private parserOptions: CSVParser.OptionsType;

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
        const { dataRefreshRate, enablePolling, csvURL } = this.options;
        const updateIntervalMs = (
            dataRefreshRate > 1 ? dataRefreshRate : 1
        ) * 1000;
        if (enablePolling && csvURL === this.liveDataURL) {
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
     * @param {DataEvent.Detail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits CSVDataStore#load
     * @emits CSVDataStore#afterLoad
     * @emits CSVDataStore#loadError
     */
    private fetchCSV(
        initialFetch?: boolean,
        eventDetail?: DataEvent.Detail
    ): void {
        const store = this,
            maxRetries = 3,
            { csvURL } = store.options;
        let currentRetries: number;

        // Clear the table
        store.table.deleteColumns();
        if (initialFetch) {
            clearTimeout(store.liveDataTimeout);
            store.liveDataURL = csvURL;
        }

        store.emit<CSVStore.Event>({
            type: 'load',
            detail: eventDetail,
            table: store.table
        });

        ajax({
            url: store.liveDataURL || '',
            dataType: 'text',
            success: function (csv): void {
                csv = `${csv}`;

                store.parser.parse({ csv });

                // On inital fetch we need to set the columns
                store.table.setColumns(store.parser.getTable().getColumns());

                if (store.liveDataURL) {
                    store.poll();
                }

                store.emit<CSVStore.Event>({
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
                store.emit<CSVStore.Event>({
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
     * @param {DataEvent.Detail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits CSVParser#load
     * @emits CSVParser#afterLoad
     */
    public load(eventDetail?: DataEvent.Detail): DataPromise<this> {
        const store = this,
            parser = store.parser,
            table = store.table,
            {
                csv,
                csvURL
            } = store.options;

        if (csv) {
            // If already loaded, clear the current rows
            table.deleteRows();
            store.emit<CSVStore.Event>({
                type: 'load',
                csv,
                detail: eventDetail,
                table
            });
            parser.parse({ csv });
            table.setColumns(parser.getTable().getColumns());
            store.emit<CSVStore.Event>({
                type: 'afterLoad',
                csv,
                detail: eventDetail,
                table
            });
        } else if (csvURL) {
            store.fetchCSV(true, eventDetail);
        } else {
            store.emit<CSVStore.Event>({
                type: 'loadError',
                detail: eventDetail,
                error: 'Unable to load: no CSV string or URL was provided',
                table
            });
        }

        return DataPromise.resolve(store);
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
namespace CSVStore {

    /**
     * Event objects fired from CSVDataStore events
     */
    export type Event = (ErrorEvent|LoadEvent);

    /**
     * Options for the CSVDataStore class constructor
     */
    export type OptionsType = Partial<(CSVStore.Options&CSVParser.OptionsType)>;

    /**
     * @todo move this to the dataparser?
     */
    export interface DataBeforeParseCallbackFunction {
        (csv: string): string;
    }

    /**
     * The event object that is provided on errors within CSVDataStore
     */
    export interface ErrorEvent extends DataStore.Event {
        type: ('loadError');
        error: (string|Error);
        xhr?: XMLHttpRequest;
    }

    /**
     * The event object that is provided on load events within CSVDataStore
     */
    export interface LoadEvent extends DataStore.Event {
        type: ('load'|'afterLoad');
        csv?: string;
    }

    /**
     * Internal options for CSVDataStore
     */
    export interface Options extends JSON.Object {
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

DataStore.addStore(CSVStore);

declare module './StoreType' {
    interface StoreTypeRegistry {
        CSVStore: typeof CSVStore;
    }
}


/* *
 *
 *  Export
 *
 * */

export default CSVStore;
