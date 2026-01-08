/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Torstein Hønsi
 *  - Gøran Slettemark
 *  - Wojciech Chmiel
 *  - Sophie Bremer
 *  - Jomar Hønsi
 *  - Kamil Kubik
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
import type { GoogleSpreadsheetJSON } from '../Converters/GoogleSheetsConverterOptions';
import type DataTable from '../DataTable';

import DataConnector from './DataConnector.js';
import GoogleSheetsConverter from '../Converters/GoogleSheetsConverter.js';
import U from '../../Core/Utilities.js';
const {
    merge,
    pick,
    fireEvent
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
        id: 'google-sheets-connector',
        type: 'GoogleSheets',
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
     * @param {Partial<GoogleSheetsConnectorOptions>} [options]
     * Options for the connector and converter.
     */
    public constructor(options: Partial<GoogleSheetsConnectorOptions>) {
        const mergedOptions = merge(
            GoogleSheetsConnector.defaultOptions,
            options
        );

        super(mergedOptions);
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
    public converter?: GoogleSheetsConverter;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Overrides the DataConnector method. Emits an event on the connector to
     * all registered callbacks of this event.
     *
     * @param {GoogleSheetsConnector.Event} e
     * Event object containing additional event information.
     */
    public emit(e: GoogleSheetsConnector.Event): void {
        fireEvent(this, e.type, e);
    }

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
        const connector = this;
        const options = connector.options;
        const {
            dataRefreshRate,
            enablePolling,
            googleAPIKey,
            googleSpreadsheetKey,
            dataTables
        } = options;
        const url = GoogleSheetsConnector.buildFetchURL(
            googleAPIKey,
            googleSpreadsheetKey,
            options
        );

        connector.emit({
            type: 'load',
            detail: eventDetail,
            url
        });

        if (!URL.canParse(url)) {
            throw new Error('Invalid URL: ' + url);
        }

        return fetch(url, { signal: connector?.pollingController?.signal })
            .then((
                response
            ): Promise<GoogleSpreadsheetJSON> => (
                response.json()
            ))
            .then((json): Promise<this> => {
                if (isGoogleError(json)) {
                    throw new Error(json.error.message);
                }

                this.initConverters<GoogleSpreadsheetJSON>(
                    json,
                    (key): GoogleSheetsConverter => {
                        const tableOptions = dataTables?.find(
                            (dataTable): boolean => dataTable.key === key
                        );

                        // The data table options takes precedence over the
                        // connector options.
                        const {
                            firstRowAsNames = options.firstRowAsNames,
                            beforeParse = options.beforeParse
                        } = tableOptions || {};
                        const converterOptions = {
                            firstRowAsNames,
                            beforeParse
                        };
                        return new GoogleSheetsConverter(converterOptions);
                    },
                    (converter, data): DataTable.ColumnCollection =>
                        converter.parse({ json: data })
                );
                return connector.applyTableModifiers();
            })
            .then((): this => {
                connector.emit({
                    type: 'afterLoad',
                    detail: eventDetail,
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
                connector.emit({
                    type: 'loadError',
                    detail: eventDetail,
                    error
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

    export interface Event extends DataConnector.Event {
        readonly url?: string;
    }

    export interface FetchURLOptions {
        onlyColumnIds?: boolean;
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
     * Creates GoogleSheets API v4 URL.
     * @private
     */
    export function buildFetchURL(
        apiKey: string,
        sheetKey: string,
        options: Partial<(FetchURLOptions & GoogleSheetsConnectorOptions)> = {}
    ): string {
        const url = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${sheetKey}/values/`);

        const range = options.onlyColumnIds ?
            'A1:Z1' : buildQueryRange(options);
        url.pathname += range;

        const searchParams = url.searchParams;
        searchParams.set('alt', 'json');

        if (!options.onlyColumnIds) {
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
 *  Declarations
 *
 * */

declare module './DataConnectorType' {
    interface DataConnectorTypes {
        GoogleSheets: typeof GoogleSheetsConnector;
    }
}

/* *
 *
 *  Registry
 *
 * */

DataConnector.registerType('GoogleSheets', GoogleSheetsConnector);

/* *
 *
 *  Default Export
 *
 * */

export default GoogleSheetsConnector;
