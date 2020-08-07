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

import DataStore from './DataStore.js';
import DataTable from '../DataTable.js';
import DataParser from '../Parsers/DataParser.js';
import ajaxModule from '../../Extensions/Ajax.js';
import U from '../../Core/Utilities.js';
import CSVDataParser from '../Parsers/CSVDataParser.js';
const { ajax } = ajaxModule;
const { fireEvent, merge } = U;
/* eslint-disable valid-jsdoc, require-jsdoc */

/**
 * @private
 */

class CSVDataStore extends DataStore {


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
    *  Constructors
    *
    * */

    public constructor(
        table: DataTable = new DataTable(),
        options: Partial<CSVDataStore.Options & CSVDataParser.Options> = {}
    ) {
        super(table);

        const { csv, csvURL, enablePolling, dataRefreshRate, ...parserOptions } = options;

        this.parserOptions = parserOptions;
        this.options = merge(CSVDataStore.defaultOptions, { csv, csvURL, enablePolling, dataRefreshRate });
        this.dataParser = new CSVDataParser(table);
        this.addEvents();
    }


    /* *
    *
    *  Properties
    *
    * */
    public options: CSVDataStore.Options;
    public parserOptions: Partial<CSVDataParser.Options>;

    private dataParser: CSVDataParser;
    private liveDataURL?: string;
    private liveDataTimeout?: number;

    private addEvents(): void {
        this.on('load', (e: CSVDataStore.LoadEventObject): void => {
            this.dataParser.parse({
                csv: e.csv,
                ...this.parserOptions
            });
            if (this.liveDataURL) {
                this.poll();
            }
            fireEvent(this, 'afterLoad', { table: this.dataParser.getTable() });
        });
        this.on('afterLoad', (e: DataStore.LoadEventObject): void => {
            this.table = e.table;
        });
        this.on('parse', (e: DataStore.ParseEventObject): void => {
            // console.log(e)
        });
        this.on('fail', (e: any): void => {
            // throw new Error(e.error)
        });
    }


    /**
     * Handle polling of live data
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

    private fetchCSV(initialFetch?: boolean): void {
        const store = this,
            maxRetries = 3,
            { csvURL } = store.options;
        let currentRetries: number;

        if (initialFetch) {
            clearTimeout(store.liveDataTimeout);
            store.liveDataURL = csvURL;
        }

        ajax({
            url: store.liveDataURL,
            dataType: 'text',
            success: function (csv: string): void {
                fireEvent(store, 'load', { csv });
            },
            error: function (xhr, text): void {
                if (++currentRetries < maxRetries) {
                    store.poll();
                }
                fireEvent(store, 'fail', { error: { xhr, text } });
            }
        });
    }

    public load(): void {
        const store = this,
            { csv, csvURL } = store.options;
        if (csv) {
            fireEvent(store, 'load', { csv });
        } else if (csvURL) {
            store.fetchCSV(true);
        }
    }

    public save(): void {

    }
}

namespace CSVDataStore {
    export interface Options {
        csv: string;
        csvURL: string;
        enablePolling: boolean;
        dataRefreshRate: number;
    }

    export type optionsType = (CSVDataStore.Options | CSVDataParser.Options)

    export interface DataBeforeParseCallbackFunction {
        (csv: string): string;
    }
    export interface LoadEventObject extends DataStore.LoadEventObject {
        csv?: string;
    }
}

export default CSVDataStore;
