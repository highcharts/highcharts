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
 * @private
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

    public constructor(
        table: DataTable = new DataTable(),
        options: Partial<(CSVDataStore.Options&CSVDataParser.Options)> = {},
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
    public readonly options: CSVDataStore.Options;
    public readonly parser: CSVDataParser;

    private liveDataURL?: string;
    private liveDataTimeout?: number;

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

        store.emit({ type: 'load', table: store.table });

        ajax({
            url: store.liveDataURL,
            dataType: 'text',
            success: function (csv: string): void {
                store.parser.parse({ csv });
                if (store.liveDataURL) {
                    store.poll();
                }
                store.table = store.parser.getTable();
                store.emit({ type: 'afterLoad', csv, table: store.table });
            },
            error: function (xhr, error): void {
                if (++currentRetries < maxRetries) {
                    store.poll();
                }
                store.emit({ type: 'loadError', error, table: store.table, xhr });
            }
        });
    }

    public load(): void {
        const store = this,
            { csv, csvURL } = store.options;

        if (csv) {
            store.emit({ type: 'load', csv, table: store.table });
            store.parser.parse({ csv });
            store.table = store.parser.getTable();
            store.emit({ type: 'afterLoad', csv, table: store.table });
        } else if (csvURL) {
            store.fetchCSV(true);
        }
    }

    public save(): void {

    }

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

namespace CSVDataStore {

    export type EventObjects = (ErrorEventObject|LoadEventObject);

    export type OptionsType = (CSVDataStore.Options | CSVDataParser.Options)

    export interface ClassJSON extends DataJSON.ClassJSON {
        metadata: DataStore.MetadataJSON;
        options: Options;
        parser: CSVDataParser.ClassJSON;
        table: DataTable.ClassJSON;
    }

    export interface DataBeforeParseCallbackFunction {
        (csv: string): string;
    }

    export interface ErrorEventObject extends DataStore.EventObject {
        type: ('loadError');
        error: (string|Error);
        xhr: XMLHttpRequest;
    }

    export interface LoadEventObject extends DataStore.EventObject {
        type: ('load'|'afterLoad');
        csv?: string;
    }

    export interface Options extends DataJSON.Object {
        csv: string;
        csvURL: string;
        enablePolling: boolean;
        dataRefreshRate: number;
    }

}

export default CSVDataStore;
