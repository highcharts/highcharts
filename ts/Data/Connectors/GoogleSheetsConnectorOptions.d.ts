/* *
 *
 *  (c) 2009-2025 Highsoft AS
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
import type DataTable from '../DataTable';
import type DataTableOptions from '../DataTableOptions';

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
     * The API key for a Google Spreadsheet (user's credentials).
     * See [general information on GS](https://developers.google.com/sheets/api/quickstart/js#create_an_api_key).
     */
    googleAPIKey: string;
    /**
     * The Google Spreadsheet key that identifies the sheet to use. See
     * [general information on googleSpreadsheetKey](#data.googleSpreadsheetKey).
     * The key for a sheet can be extracted from the sheet's URL
     * `https://docs.google.com/spreadsheets/d/{key}`.
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
     * A custom callback function that parses the data before it's being parsed
     * to the data table format inside the converter.
     */
    beforeParse?: GoogleSheetsBeforeParseCallbackFunction;

    /**
     * Allows defining multiple data tables within a single connector to adjust
     * options or data parsing in various ways based on the same data source.
     *
     * @example
     * dataPool: {
     *     connectors: [{
     *         id: 'data-connector',
     *         type: 'JSON',
     *         options: {
     *             data: {
     *                 kpis: { a: 1, b: 2 },
     *                 more: {
     *                     alpha: [1, 2, 3, 4, 5],
     *                     beta: [10, 20, 30, 40, 50]
     *                 }
     *             }
     *         },
     *         dataTables: [{
     *             key: 'more',
     *             beforeParse: function ({ more }) {
     *                 const keys = Object.keys(more);
     *                 return [
     *                     keys,
     *                     ...more[keys[0]].map((_, index) =>
     *                         keys.map(key => more[key][index])
     *                     )
     *                 ];
     *             }
     *         }, {
     *             key: 'kpis',
     *             firstRowAsNames: false,
     *             columnNames: ['a', 'b'],
     *             beforeParse: function ({ kpis }) {
     *                 return [[kpis.a, kpis.b]];
     *             },
     *             dataModifier: {
     *                 type: 'Math',
     *                 columnFormulas: [{
     *                     column: 'c',
     *                     formula: 'A1+B1'
     *                 }]
     *             }
     *         }]
     *     }]
     * }
     **/
    dataTables?: Array<DataTableOptions>;
}

/**
 * Callback function allowing modification of the GoogleSheets data
 * before parsing it. Must return an array of DataTable columns.
 *
 */
export interface GoogleSheetsBeforeParseCallbackFunction {
    (data: DataTable.BasicColumn[]): DataTable.BasicColumn[];
}

/* *
 *
 *  Default Export
 *
 * */

export default GoogleSheetsConnectorOptions;
