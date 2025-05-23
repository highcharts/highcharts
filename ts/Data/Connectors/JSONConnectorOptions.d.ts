/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Pawel Lysy
 *
 * */

/* *
 *
 *  Imports
 *
* */

import type DataConnectorOptions from './DataConnectorOptions';
import type JSONConverter from '../Converters/JSONConverter';
import type DataTableOptions from '../DataTableOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Options of the JSONConnector.
 */
export interface JSONConnectorOptions extends DataConnectorOptions {
    /**
     * If JSON data is row oriented, these options define keys for the columns.
     * In column oriented case this is handled automatically unless the
     * `firstRowAsNames` set to false, then the `columnNames` can be used.
     *
     * In case of complex JSON structure, use the `ColumnNamesOptions` to define
     * the key and path to the data.
     *
     * If you have more complex data, you can adjust it by  the `beforeParse`
     * callback function to manually parse the rows into valid JSON. However,
     * the resulting JSON will still be converted into a proper table structure.
     */
    columnNames?: Array<string>|ColumnNamesOptions;

    /**
     * Data in JSON format.
     */
    data?: JSONConverter.Data;

    /**
     * Data refresh rate in seconds.
     */
    dataRefreshRate?: number;

    /**
     * URL to the JSON data. try it {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/data-tools/datapool-json-connector-dataurl/ | data fetched from url }
     */
    dataUrl?: string;

    /**
     * Whether polling should be enabled.
     */
    enablePolling?: boolean;

    /**
     * Should first row be treated as names of columns.
     * @default true
     */
    firstRowAsNames?: boolean;

    /**
     * Whether data is in columns or rows.
     *
     * Try it:
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/data-tools/datapool-json-connector-orientation/ | JSON Connector orientation }
     *
     * @default 'rows'
     */
    orientation?: 'columns'|'rows';

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

    /**
     * A custom callback function that parses the data before it's being parsed
     * to the data table format inside the converter.
     */
    beforeParse?: JSONBeforeParseCallbackFunction;
}

/**
 * Options used for parsing JSON data with multiple levels.
 * The key is the column name (later used as a reference), and the value is
 * an array of keys that are used to access the data.
 *
 * @example
 * columnNames: {
 *     InstanceType: ['InstanceType'],
 *     DiskSpace: ['DiskSpace', 'RootDisk', 'SizeGB'],
 *     ReadOps: ['DiskOperations', 0, 'ReadOps']
 * },
 */
export interface ColumnNamesOptions {
    [key: string]: Array<string|number>;
}

/**
 * Callback function allowing modification of the data before parsing it.
 * Must return a valid JSON structure.
 *
 * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/data-tools/datapool-json-connector-enable-polling/ | JSON Connector with beforeParse and enablePolling }
 */
export interface JSONBeforeParseCallbackFunction {
    (data: JSONConverter.Data): JSONConverter.Data;
}

/* *
 *
 *  Default Export
 *
 * */

export default JSONConnectorOptions;
