/* *
 *
 *  (c) 2009-2025 Highsoft AS
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
 *  - Jomar Hønsi
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type DataEvent from '../DataEvent';
import type GoogleSheetsConnectorOptions from './GoogleSheetsConnectorOptions';
import type Types from '../../Shared/Types';
import type DataTable from '../DataTable';

import DataConnector from './DataConnector.js';
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

    protected static readonly defaultOptions: GoogleSheetsConnectorOptions = {
        googleAPIKey: '',
        googleSpreadsheetKey: '',
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
        options?: GoogleSheetsConnector.UserOptions,
        dataTables?: Array<DataTable>
    ) {
        const mergedOptions =
            merge(GoogleSheetsConnector.defaultOptions, options);

        super(mergedOptions, dataTables);

        this.converter = new GoogleSheetsConverter(mergedOptions);
        this.options = mergedOptions;
    }

    /* *
     *
     *  Properties
     *
     * */

    public readonly options: GoogleSheetsConnectorOptions;

    /**
     * The attached converter, which can be replaced in the constructor
     */
    public converter: GoogleSheetsConverter;

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
            tables = connector.dataTables,
            {
                dataModifier,
                dataRefreshRate,
                enablePolling,
                googleAPIKey,
                googleSpreadsheetKey
            } = connector.options,
            url = GoogleSheetsConnector.buildFetchURL(
                googleAPIKey,
                googleSpreadsheetKey,
                connector.options
            );

        connector.emit<GoogleSheetsConnector.Event>({
            type: 'load',
            detail: eventDetail,
            tables,
            url
        });

        if (!URL.canParse(url)) {
            throw new Error('Invalid URL: ' + url);
        }

        return fetch(url, { signal: connector?.pollingController?.signal })
            .then((
                response
            ): Promise<GoogleSheetsConverter.GoogleSpreadsheetJSON> => (
                response.json()
            ))
            .then((json): Promise<this> => {
                if (isGoogleError(json)) {
                    throw new Error(json.error.message);
                }

                this.initConverters<GoogleSheetsConverter.GoogleSpreadsheetJSON>(
                    json,
                    (key, table): GoogleSheetsConverter => {
                        const options = this.options;
                        // Takes over the connector default options.
                        const dataTableOptions = {
                            dataTableKey: key,
                            firstRowAsNames: table.firstRowAsNames ??
                                options.firstRowAsNames,
                            beforeParse: table.beforeParse ??
                                options.beforeParse
                        };

                        return new GoogleSheetsConverter(
                            merge(this.options, dataTableOptions)
                        );
                    },
                    (converter, data): void => {
                        converter.parse({ json: data });
                    }
                );
                return connector.setModifierOptions(dataModifier);
            })
            .then((): this => {
                connector.emit<GoogleSheetsConnector.Event>({
                    type: 'afterLoad',
                    detail: eventDetail,
                    tables,
                    url
                });

                // Polling
                if (enablePolling) {
                    setTimeout(
                        (): Promise<this> => connector.load(),
                        Math.max(dataRefreshRate || 0, 1) * 1000
                    );
                }

                return connector;
            })['catch']((error): never => {
                connector.emit<GoogleSheetsConnector.Event>({
                    type: 'loadError',
                    detail: eventDetail,
                    error,
                    tables
                });
                throw error;
            });
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

    export type Event = (ErrorEvent | LoadEvent);

    export type ErrorEvent = DataConnector.ErrorEvent;

    export interface FetchURLOptions {
        onlyColumnNames?: boolean;
    }

    export interface LoadEvent extends DataConnector.LoadEvent {
        readonly url: string;
    }

    /**
     * Available options for constructor of the GoogleSheetsConnector.
     */
    export type UserOptions = Types.DeepPartial<GoogleSheetsConnectorOptions>;

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
        options: Partial<(FetchURLOptions & GoogleSheetsConnectorOptions)> = {}
    ): string {
        const url = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${sheetKey}/values/`);

        const range = options.onlyColumnNames ?
            'A1:Z1' : buildQueryRange(options);
        url.pathname += range;

        const searchParams = url.searchParams;
        searchParams.set('alt', 'json');

        if (!options.onlyColumnNames) {
            searchParams.set('dateTimeRenderOption', 'FORMATTED_STRING');
            searchParams.set('majorDimension', 'COLUMNS');
            searchParams.set('valueRenderOption', 'UNFORMATTED_VALUE');
        }
        searchParams.set('prettyPrint', 'false');
        searchParams.set('key', apiKey);

        return url.href;
    }

    /**
     * Creates sheets range.
     * @private
     */
    export function buildQueryRange(
        options: Partial<GoogleSheetsConnectorOptions> = {}
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
