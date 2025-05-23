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
import type DataTableOptions from '../DataTableOptions';


/* *
 *
 *  Declarations
 *
 * */

/**
 * Options of the CSVConnector.
 */
export interface CSVConnectorOptions extends DataConnectorOptions {
    /**
     * Data in CSV format passed directly to connector as a string.
     */
    csv?: string;
    /**
     * The URL to a remote CSV dataset
     */
    csvURL?: string;
    /**
     * The decimal point used for parsing numbers in the CSV.
     *
     * @default '.'
     */
    decimalPoint?: string;
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
     * Whether to treat the first row of the data set as series names.
     * @default true
     */
    firstRowAsNames?: boolean;
    /**
     * Item or cell delimiter for parsing CSV.
     *
     * @default ','
     */
    itemDelimiter?: string;

    /**
     * A custom callback function that parses the data before it's being parsed
     * to the data table format inside the converter.
     */
    beforeParse?: CSVBeforeParseCallbackFunction;

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
 * Callback function allowing modification of the data before parsing it.
 * Must return a valid CSV structure.
 */
export interface CSVBeforeParseCallbackFunction {
    (csv: string): string;
}

/* *
 *
 *  Default Export
 *
 * */

export default CSVConnectorOptions;
