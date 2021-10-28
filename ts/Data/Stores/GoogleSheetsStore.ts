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
const {
    merge,
    pick
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * @private
 * @todo implement save, requires oauth2
 */
class GoogleSheetsStore extends DataStore<GoogleSheetsStore.Event> {

    /* *
     *
     *  Static Properties
     *
     * */

    protected static readonly defaultOptions: GoogleSheetsStore.Options = {
        googleAPIKey: '',
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
            {
                googleAPIKey: string;
                googleSpreadsheetKey: string;
            }
        ),
        parser?: GoogleSheetsParser
    ) {
        super(table);
        this.options = merge(GoogleSheetsStore.defaultOptions, options);
        this.parser = parser || new GoogleSheetsParser({ firstRowAsNames: this.options.firstRowAsNames });
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

    /* eslint-disable valid-jsdoc */

    /**
     * @param {DataEventEmitter.EventDetail} [eventDetail]
     * Custom information for pending events.
     */
    public load(eventDetail?: DataEventEmitter.EventDetail): void {
        const store = this,
            {
                dataRefreshRate,
                enablePolling,
                firstRowAsNames,
                googleAPIKey,
                googleSpreadsheetKey,
                worksheet
            } = store.options,
            handleError = (
                xhr: XMLHttpRequest,
                error: (string|Error)
            ): void => {
                store.emit({
                    type: 'loadError',
                    detail: eventDetail,
                    error,
                    table: store.table,
                    xhr
                });
            },
            url = GoogleSheetsStore.getFetchURL(
                googleAPIKey,
                googleSpreadsheetKey,
                store.options
            );

        // If already loaded, clear the current table
        store.table.deleteColumns();

        store.emit({
            type: 'load',
            detail: eventDetail,
            table: store.table,
            url
        });

        ajax({
            url,
            error: handleError,
            success: (
                json: GoogleSheetsParser.GoogleSpreadsheetJSON
            ): void => {
                store.parser.parse({ firstRowAsNames, json });
                store.table.setColumns(store.parser.getTable().getColumns());

                // Polling
                if (enablePolling) {
                    setTimeout(
                        (): void => store.load(),
                        dataRefreshRate * 1000
                    );
                }

                store.emit({
                    type: 'afterLoad',
                    detail: eventDetail,
                    table: store.table,
                    url
                });
            }
        });
    }

}

/* *
 *
 *  Class Name
 *
 * */

namespace GoogleSheetsStore {

    /* *
     *
     *  Declarations
     *
     * */

    export type Event = (ErrorEvent|LoadEvent);

    export interface ErrorEvent extends DataStore.Event {
        readonly type: 'loadError';
        readonly error: (string|Error);
        readonly xhr: XMLHttpRequest;
    }

    export interface FetchURLOptions {
        onlyColumnNames?: boolean;
    }

    export interface LoadEvent extends DataStore.Event {
        readonly type: ('load'|'afterLoad');
        readonly url: string;
    }

    export interface Options extends JSON.Object {
        dataRefreshRate: number;
        enablePolling: boolean;
        endColumn?: number;
        endRow?: number;
        firstRowAsNames: boolean;
        googleAPIKey: string;
        googleSpreadsheetKey: string;
        googleSpreadsheetRange?: string;
        startColumn?: number;
        startRow?: number;
        worksheet?: number;
    }

    /* *
     *
     *  Constants
     *
     * */

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    /* *
     *
     *  Functions
     *
     * */

    /**
     * @private
     */
    export function getFetchURL(
        apiKey: string,
        sheetKey: string,
        options: Partial<(FetchURLOptions|Options)> = {}
    ): string {
        return (
            `https://sheets.googleapis.com/v4/spreadsheets/${sheetKey}/values/` +
            (
                options.onlyColumnNames ?
                    'A1:Z1' :
                    getRange(options)
            ) +
            '?alt=json' +
            (
                options.onlyColumnNames ?
                    '' :
                    '&dateTimeRenderOption=FORMATTED_STRING' +
                    '&majorDimension=COLUMNS' +
                    '&valueRenderOption=UNFORMATTED_VALUE'
            ) +
            '&prettyPrint=false' +
            `&key=${apiKey}`
        );
    }

    /**
     * @private
     */
    export function getRange(
        options: Partial<Options> = {}
    ): string {
        const {
            endColumn,
            endRow,
            googleSpreadsheetRange,
            startColumn,
            startRow
        } = options;

        return googleSpreadsheetRange || (
            (alphabet[startColumn || 0] || 'A') +
            (Math.max((startRow || 0), 0) + 1) +
            ':' +
            (alphabet[pick(endColumn, 25)] || 'Z') +
            (
                endRow ?
                    Math.max(endRow, 0) :
                    'Z'
            )
        );
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
