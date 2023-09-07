/* *
 *
 *  (c) 2009-2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Karol Kolodziej
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type DataConnectorOptions from './DataConnectorOptions';


/* *
 *
 *  Declarations
 *
 * */

/**
 * Options of the GoogleSheetsConnector.
 */
export interface GoogleSheetsConnectorOptions extends DataConnectorOptions {
    /**
     * The rate in seconds for polling for live data.
     * Note that polling requires the option `enablePolling` to be true.
     */
    dataRefreshRate?: number;
    /**
     * Whether to enable polling for live data.
     */
    enablePolling?: boolean;
    /**
     * The number of the last column to load.
     */
    endColumn?: number;
    /**
     * The number of the last row to load.
     */
    endRow?: number;
    /**
     * Whether to treat the first row of the data set as series names.
     */
    firstRowAsNames?: boolean;
    /**
     * The API key of a Google account to access spreadsheets with.
     *
     * @see {@link https://developers.google.com/workspace/guides/create-credentials#api-key API key credentials}
     */
    googleAPIKey: string;
    /**
     * The Google Docs spreadsheet to load. This is the spreadsheet key itself
     * as found in the document URL as in
     * `https://docs.google.com/spreadsheets/d/{key}/edit#gid=0`
     * or
     * `https://spreadsheets.google.com/feeds/worksheets/{key}/public/basic`.
     */
    googleSpreadsheetKey: string;
    /**
     * The Google Spreadsheet `range` to use in combination with
     * [googleSpreadsheetKey](#data.googleSpreadsheetKey).
     * If given, it takes precedence over `startColumn`, `endColumn`, `startRow`
     * and `endRow`.
     *
     * @see {@link https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get developers.google.com}
     */
    googleSpreadsheetRange?: string;
    /**
     * The number of the first column to load.
     */
    startColumn?: number;
    /**
     * The number of the first row to load.
     */
    startRow?: number;
    /**
     * The number of the worksheet to load.
     */
    worksheet?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default GoogleSheetsConnectorOptions;
