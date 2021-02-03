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

import type DataEventEmitter from '../DataEventEmitter';
import AjaxMixin from '../../Extensions/Ajax.js';
const {
    ajax
} = AjaxMixin;
import DataJSON from './../DataJSON.js';
import DataStore from './DataStore.js';
import DataTable from '../DataTable.js';
import U from '../../Core/Utilities.js';
import GoogleSheetsParser from '../Parsers/GoogleSheetsParser.js';
const {
    merge
} = U;

/* eslint-disable no-invalid-this, require-jsdoc, valid-jsdoc */

/**
 * @private
 */

class GoogleSheetsStore extends DataStore<GoogleSheetsStore.EventObject> implements DataJSON.Class {

    /* *
     *
     *  Static Properties
     *
     * */

    protected static readonly defaultOptions: GoogleSheetsStore.Options = {
        googleSpreadsheetKey: '',
        worksheet: 1,
        enablePolling: false,
        dataRefreshRate: 2
    };

    /* *
     *
     *  Static Functions
     *
     * */

    public static fromJSON(json: GoogleSheetsStore.ClassJSON): GoogleSheetsStore {
        const options = json.options,
            table = DataTable.fromJSON(json.table),
            store = new GoogleSheetsStore(table, options);

        store.metadata = merge(json.metadata);

        return store;
    }

    /* *
     *
     *  Constructors
     *
     * */

    /**
     * Constructs an instance of GoogleSheetsStore
     *
     * @param {DataTable} table
     * Optional DataTable to create the store from
     *
     * @param {CSVStore.OptionsType} options
     * Options for the store and parser
     *
     * @param {DataParser} parser
     * Optional parser to replace the default parser
     */
    public constructor(
        table: DataTable,
        options: (
            Partial<GoogleSheetsStore.Options>&
            { googleSpreadsheetKey: string }
        ),
        parser?: GoogleSheetsParser
    ) {
        super(table);
        this.options = merge(GoogleSheetsStore.defaultOptions, options);
        this.parser = parser || new GoogleSheetsParser();
    }

    /* *
     *
     *  Properties
     *
     * */

    public readonly options: GoogleSheetsStore.Options;

    /**
     * The attached parser, which can be replaced in the constructor
     */
    public readonly parser: GoogleSheetsParser;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     */
    private fetchSheet(eventDetail?: DataEventEmitter.EventDetail): void {
        const store = this,
            {
                enablePolling,
                dataRefreshRate,
                googleSpreadsheetKey,
                worksheet
            } = store.options,
            url = [
                'https://spreadsheets.google.com/feeds/cells',
                googleSpreadsheetKey,
                worksheet,
                'public/values?alt=json'
            ].join('/');

        // If already loaded, clear the current rows
        store.table.clear();

        store.emit({
            type: 'load',
            detail: eventDetail,
            table: store.table,
            url
        });

        ajax({
            url: url,
            dataType: 'json',
            success: function (json: Highcharts.JSONType): void {
                store.parser.parse(json);
                store.table.insertRows(store.parser.getTable().getAllRows());
                // Polling
                if (enablePolling) {
                    setTimeout(
                        function (): void {
                            store.fetchSheet();
                        },
                        dataRefreshRate * 1000
                    );
                }

                store.emit({
                    type: 'afterLoad',
                    detail: eventDetail,
                    table: store.table,
                    url
                });
            },
            error: function (
                xhr: XMLHttpRequest,
                error: (string|Error)
            ): void {
                /* *
                 * TODO:
                 * catch error
                 * ...
                 *
                 * */
                // console.log(text);

                store.emit({
                    type: 'loadError',
                    detail: eventDetail,
                    error,
                    table: store.table,
                    xhr
                });
            }
        });

        // return true;
    }

    /**
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     */
    public load(eventDetail?: DataEventEmitter.EventDetail): void {
        if (this.options.googleSpreadsheetKey) {
            this.fetchSheet(eventDetail);
        }
    }

    /**
     * Converts the store to a class JSON.
     *
     * @return {DataJSON.ClassJSON}
     * Class JSON of this store.
     */
    public toJSON(): GoogleSheetsStore.ClassJSON {
        return {
            $class: 'GoogleSheetsStore',
            metadata: merge(this.metadata),
            options: merge(this.options),
            table: this.table.toJSON()
        };
    }

    /* *
     * TODO:
     * public save() {}
     * ...
     *
     * requires oAuth2 auth
     *
     * */
}

namespace GoogleSheetsStore {

    export interface ClassJSON extends DataStore.ClassJSON {
        options: Options;
    }

    export type EventObject = (ErrorEventObject|LoadEventObject);

    export interface ErrorEventObject extends DataStore.EventObject {
        readonly type: 'loadError';
        readonly error: (string|Error);
        readonly xhr: XMLHttpRequest;
    }

    export interface LoadEventObject extends DataStore.EventObject {
        readonly type: ('load'|'afterLoad');
        readonly url: string;
    }

    export interface Options extends DataJSON.JSONObject {
        googleSpreadsheetKey: string;
        worksheet?: number;
        enablePolling: boolean;
        dataRefreshRate: number;
    }

}

/* *
 *
 *  Registry
 *
 * */

DataJSON.addClass(GoogleSheetsStore);
DataStore.addStore(GoogleSheetsStore);

declare module './StoreType' {
    interface StoreTypeRegistry {
        Google: typeof GoogleSheetsStore;
    }
}

/* *
 *
 *  Export
 *
 * */

export default GoogleSheetsStore;
