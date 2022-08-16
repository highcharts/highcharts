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
 *  - Gøran Slettemark
 *  - Wojciech Chmiel
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataEventEmitter from '../DataEventEmitter';
import type JSON from '../../Core/JSON';

import DataStore from './DataStore.js';
import DataTable from '../DataTable.js';
import GoogleSheetsParser from '../Parsers/GoogleSheetsParser.js';
import HU from '../../Core/HttpUtilities.js';
const { ajax } = HU;
import U from '../../Core/Utilities.js';
const { merge } = U;

/* *
 *
 *  Class
 *
 * *7

/* eslint-disable no-invalid-this, require-jsdoc, valid-jsdoc */

/**
 * @private
 */
class GoogleSheetsStore extends DataStore<GoogleSheetsStore.Event> {

    /* *
     *
     *  Static Properties
     *
     * */

    protected static readonly defaultOptions: GoogleSheetsStore.Options = {
        googleSpreadsheetKey: '',
        worksheet: 1,
        enablePolling: false,
        dataRefreshRate: 2,
        firstRowAsNames: true
    };

    /* *
     *
     *  Constructor
     *
     * */

    /**
     * Constructs an instance of GoogleSheetsStore
     *
     * @param {DataTable} table
     * Optional table to create the store from.
     *
     * @param {CSVStore.OptionsType} options
     * Options for the store and parser.
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
        this.parser = parser || new GoogleSheetsParser({
            firstRowAsNames: this.options.firstRowAsNames
        });
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

        // If already loaded, clear the current table
        store.table.deleteColumns();

        store.emit({
            type: 'load',
            detail: eventDetail,
            table: store.table,
            url
        });

        ajax({
            url: url,
            dataType: 'json',
            success: function (json): void {
                store.parser.parse(json);
                store.table.setColumns(store.parser.getTable().getColumns());

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

    export type Event = (ErrorEvent|LoadEvent);

    export interface ErrorEvent extends DataStore.Event {
        readonly type: 'loadError';
        readonly error: (string|Error);
        readonly xhr: XMLHttpRequest;
    }

    export interface LoadEvent extends DataStore.Event {
        readonly type: ('load'|'afterLoad');
        readonly url: string;
    }

    export interface Options extends JSON.Object {
        googleSpreadsheetKey: string;
        worksheet?: number;
        enablePolling: boolean;
        dataRefreshRate: number;
        firstRowAsNames: boolean;
    }

}

/* *
 *
 *  Registry
 *
 * */

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
