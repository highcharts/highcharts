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

import type DataEvent from '../DataEvent';
import type JSON from '../../Core/JSON';

import DataStore from './DataStore.js';
import DataTable from '../DataTable.js';
import GoogleSheetsConverter from '../Converters/GoogleSheetsConverter.js';
import U from '../../Core/Utilities.js';
const {
    merge,
    pick
} = U;

/* *
 *
 *  Declarations
 *
 * */

interface GoogleError {
    error: {
        code: number;
        message: string;
        status: string;
        details?: unknown;
    }
}

/* *
 *
 *  Functions
 *
 * */

function isGoogleError(
    json: AnyRecord
): json is GoogleError {
    return (
        typeof json === 'object' && json &&
        typeof json.error === 'object' && json.error &&
        typeof json.error.code === 'number' &&
        typeof json.error.message === 'string' &&
        typeof json.error.status === 'string'
    );
}

/* *
 *
 *  Class
 *
 * */

/**
 * @private
 * @todo implement save, requires oauth2
 */
class GoogleSheetsStore extends DataStore {

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
     * Options for the store and converter.
     *
     * @param {DataConverter} converter
     * Optional converter to replace the default converter.
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
        converter?: GoogleSheetsConverter
    ) {
        super(table);
        this.options = merge(GoogleSheetsStore.defaultOptions, options);
        this.converter = converter || new GoogleSheetsConverter({
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
     * The attached converter, which can be replaced in the constructor
     */
    public readonly converter: GoogleSheetsConverter;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Loads data from a Google Spreadsheet.
     *
     * @param {DataEvent.Detail} [eventDetail]
     * Custom information for pending events.
     *
     * @return {Promise<this>}
     * Same store instance with modified table.
     */
    public load(eventDetail?: DataEvent.Detail): Promise<this> {
        const store = this,
            {
                dataRefreshRate,
                enablePolling,
                firstRowAsNames,
                googleAPIKey,
                googleSpreadsheetKey
            } = store.options,
            url = GoogleSheetsStore.buildFetchURL(
                googleAPIKey,
                googleSpreadsheetKey,
                store.options
            );

        // If already loaded, clear the current table
        store.table.deleteColumns();

        store.emit<GoogleSheetsStore.Event>({
            type: 'load',
            detail: eventDetail,
            table: store.table,
            url
        });

        return fetch(url)
            .then((response): Promise<void> => response
                .json()
                .then((json): void => {

                    if (isGoogleError(json)) {
                        throw new Error(json.error.message);
                    }

                    store.converter.parse({
                        firstRowAsNames,
                        json:
                            json as GoogleSheetsConverter.GoogleSpreadsheetJSON
                    });

                    store.table.setColumns(
                        store.converter.getTable().getColumns()
                    );

                    store.emit<GoogleSheetsStore.Event>({
                        type: 'afterLoad',
                        detail: eventDetail,
                        table: store.table,
                        url
                    });

                    // Polling
                    if (enablePolling) {
                        setTimeout(
                            (): Promise<this> => store.load(),
                            Math.max(dataRefreshRate || 0, 1) * 1000
                        );
                    }
                })
            )['catch']((error): Promise<void> => {
                store.emit<GoogleSheetsStore.Event>({
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
    }

}

/* *
 *
 *  Class Namespace
 *
 * */

namespace GoogleSheetsStore {

    /* *
     *
     *  Declarations
     *
     * */

    export type Event = (ErrorEvent|LoadEvent);

    export type ErrorEvent = DataStore.ErrorEvent;

    export interface FetchURLOptions {
        onlyColumnNames?: boolean;
    }

    export interface LoadEvent extends DataStore.LoadEvent {
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
    export function buildFetchURL(
        apiKey: string,
        sheetKey: string,
        options: Partial<(FetchURLOptions|Options)> = {}
    ): string {
        return (
            `https://sheets.googleapis.com/v4/spreadsheets/${sheetKey}/values/` +
            (
                options.onlyColumnNames ?
                    'A1:Z1' :
                    buildQueryRange(options)
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
    export function buildQueryRange(
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
 *  Default Export
 *
 * */

export default GoogleSheetsStore;
