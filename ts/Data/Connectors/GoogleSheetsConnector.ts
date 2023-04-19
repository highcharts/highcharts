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

import DataConnector from './DataConnector.js';
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

/**
 * Tests Google's response for error.
 * @private
 */
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
class GoogleSheetsConnector extends DataConnector {

    /* *
     *
     *  Static Properties
     *
     * */

    protected static readonly defaultOptions: GoogleSheetsConnector.Options = {
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
     * Constructs an instance of GoogleSheetsConnector
     *
     * @param {GoogleSheetsConnector.UserOptions} [options]
     * Options for the connector and converter.
     */
    public constructor(
        options?: GoogleSheetsConnector.UserOptions
    ) {
        const mergedOptions =
            merge(GoogleSheetsConnector.defaultOptions, options);

        super(mergedOptions);

        this.converter = new GoogleSheetsConverter(mergedOptions);
        this.options = mergedOptions;
    }

    /* *
     *
     *  Properties
     *
     * */

    public readonly options: GoogleSheetsConnector.Options;

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
     * Same connector instance with modified table.
     */
    public load(eventDetail?: DataEvent.Detail): Promise<this> {
        const connector = this,
            {
                dataRefreshRate,
                enablePolling,
                firstRowAsNames,
                googleAPIKey,
                googleSpreadsheetKey
            } = connector.options,
            url = GoogleSheetsConnector.buildFetchURL(
                googleAPIKey,
                googleSpreadsheetKey,
                connector.options
            );

        // If already loaded, clear the current table
        connector.table.deleteColumns();

        connector.emit<GoogleSheetsConnector.Event>({
            type: 'load',
            detail: eventDetail,
            table: connector.table,
            url
        });

        return fetch(url)
            .then((response): Promise<void> => response
                .json()
                .then((json): void => {

                    if (isGoogleError(json)) {
                        throw new Error(json.error.message);
                    }

                    connector.converter.parse({
                        firstRowAsNames,
                        json:
                            json as GoogleSheetsConverter.GoogleSpreadsheetJSON
                    });

                    connector.table.setColumns(
                        connector.converter.getTable().getColumns()
                    );

                    connector.emit<GoogleSheetsConnector.Event>({
                        type: 'afterLoad',
                        detail: eventDetail,
                        table: connector.table,
                        url
                    });

                    // Polling
                    if (enablePolling) {
                        setTimeout(
                            (): Promise<this> => connector.load(),
                            Math.max(dataRefreshRate || 0, 1) * 1000
                        );
                    }
                })
            )['catch']((error): Promise<void> => {
                connector.emit<GoogleSheetsConnector.Event>({
                    type: 'loadError',
                    detail: eventDetail,
                    error,
                    table: connector.table
                });
                return Promise.reject(error);
            })
            .then((): this =>
                connector
            );
    }

}

/* *
 *
 *  Class Namespace
 *
 * */

namespace GoogleSheetsConnector {

    /* *
     *
     *  Declarations
     *
     * */

    export type Event = (ErrorEvent|LoadEvent);

    export type ErrorEvent = DataConnector.ErrorEvent;

    export interface FetchURLOptions {
        onlyColumnNames?: boolean;
    }

    export interface LoadEvent extends DataConnector.LoadEvent {
        readonly url: string;
    }

    /**
     * Options of the GoogleSheetsConnector.
     */
    export interface Options extends DataConnector.Options {
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

    /**
     * Available options for constructor and converter of the
     * GoogleSheetsConnector.
     */
    export type UserOptions =
        (Partial<Options>&GoogleSheetsConverter.UserOptions);

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
     * Creates GoogleSheets API v4 URL.
     * @private
     */
    export function buildFetchURL(
        apiKey: string,
        sheetKey: string,
        options: Partial<(FetchURLOptions&Options)> = {}
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
     * Creates sheets range.
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

declare module './DataConnectorType' {
    interface DataConnectorTypes {
        GoogleSheets: typeof GoogleSheetsConnector;
    }
}

DataConnector.registerType('GoogleSheets', GoogleSheetsConnector);

/* *
 *
 *  Default Export
 *
 * */

export default GoogleSheetsConnector;
