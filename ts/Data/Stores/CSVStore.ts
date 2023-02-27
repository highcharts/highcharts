/* *
 *
 *  (c) 2009-2023 Highsoft AS
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

import CSVConverter from '../Converters/CSVConverter.js';
import DataStore from './DataStore.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
const { merge } = U;

/* *
 *
 *  Class
 *
 * */

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
     *  Constructor
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
     * @param {DataConverter} converter
     * Optional converter to replace the default converter.
     */
    public constructor(
        table: DataTable = new DataTable(),
        options: CSVStore.OptionsType = {},
        converter?: CSVConverter
    ) {
        super(table);

        this.options = merge(
            CSVStore.defaultOptions,
            options
        );

        this.converter = converter || new CSVConverter(options);

        if (options.enablePolling) {
            this.startPolling(Math.max(options.dataRefreshRate || 0, 1) * 1000);
        }
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
    public readonly converter: CSVConverter;

    /**
     * The URL to fetch if the source is external
     */
    private liveDataURL?: string;

    /**
     * The current timeout ID if polling is enabled
     */
    private liveDataTimeout?: number;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Initiates the loading of the CSV source to the store
     *
     * @param {DataEvent.Detail} [eventDetail]
     * Custom information for pending events.
     *
     * @emits CSVParser#load
     * @emits CSVParser#afterLoad
     */
    public load(eventDetail?: DataEvent.Detail): Promise<this> {
        const store = this,
            converter = store.converter,
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
            converter.parse({ csv });
            table.setColumns(converter.getTable().getColumns());
            store.emit<CSVStore.Event>({
                type: 'afterLoad',
                csv,
                detail: eventDetail,
                table
            });
        } else if (csvURL) {
            // Clear the table
            store.table.deleteColumns();

            store.emit<CSVStore.Event>({
                type: 'load',
                detail: eventDetail,
                table: store.table
            });

            return fetch(csvURL || '')
                .then((response): Promise<void> => response.text().then(
                    (csv): void => {
                        store.converter.parse({ csv });

                        // On inital fetch we need to set the columns
                        store.table.setColumns(
                            store.converter.getTable().getColumns()
                        );

                        store.emit<CSVStore.Event>({
                            type: 'afterLoad',
                            csv,
                            detail: eventDetail,
                            table: store.table
                        });
                    }
                ))['catch']((error): Promise<void> => {
                    store.emit<CSVStore.Event>({
                        type: 'loadError',
                        detail: eventDetail,
                        error,
                        table: store.table
                    });

                    return Promise.reject(error);
                })
                .then((): this =>
                    store
                );
        } else {
            store.emit<CSVStore.Event>({
                type: 'loadError',
                detail: eventDetail,
                error: 'Unable to load: no CSV string or URL was provided',
                table
            });
        }

        return Promise.resolve(store);
    }

}

/* *
 *
 *  Class Namespace
 *
 * */

/**
 * Types for class-specific options and events
 */
namespace CSVStore {

    /* *
     *
     *  Declarations
     *
     * */

    /**
     * Event objects fired from CSVDataStore events
     */
    export type Event = (ErrorEvent|LoadEvent);

    /**
     * Options for the CSVDataStore class constructor
     */
    export type OptionsType =
        Partial<(CSVStore.Options&CSVConverter.OptionsType)>;

    /**
     * @todo move this to the dataparser?
     */
    export interface DataBeforeParseCallbackFunction {
        (csv: string): string;
    }

    /**
     * The event object that is provided on errors within CSVDataStore
     */
    export interface ErrorEvent extends DataStore.ErrorEvent {
        csv?: string;
    }

    /**
     * The event object that is provided on load events within CSVDataStore
     */
    export interface LoadEvent extends DataStore.LoadEvent {
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
 *  Default Export
 *
 * */

export default CSVStore;
