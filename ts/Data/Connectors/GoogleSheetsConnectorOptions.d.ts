/* *
 *
 *  (c) 2009-2024 Highsoft AS
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
     * The key for a Google Spreadsheet to load. See [general information
     * on GS](https://developers.google.com/gdata/samples/spreadsheet_sample).
     */
    googleAPIKey: string;
    /**
     * The Google Spreadsheet worksheet to use in combination with
     * [googleSpreadsheetKey](#data.googleSpreadsheetKey). The available id's from
     * your sheet can be read from `https://spreadsheets.google.com/feeds/worksheets/{key}/public/basic`.
     */
    googleSpreadsheetKey: string;
    /**
     * The Google Spreadsheet `range` to use in combination with
     * [googleSpreadsheetKey](#data.googleSpreadsheetKey). See
     * [developers.google.com](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get)
     * for details.
     *
     * If given, it takes precedence over `startColumn`, `endColumn`, `startRow` and
     * `endRow`.
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
