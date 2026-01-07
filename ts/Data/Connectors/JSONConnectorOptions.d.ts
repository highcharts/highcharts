/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 *  Authors:
 *  - Pawel Lysy
 *  - Kamil Kubik
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type DataConnectorOptions from './DataConnectorOptions';
import type { DataTableConnectorOptions } from './DataConnectorOptions';
import type { JSONData } from '../Converters/JSONConverterOptions';

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
     * The corresponding connector type.
     */
    type: 'JSON';
    /**
     * If JSON data is row oriented, these options define keys for the columns.
     * In column oriented case this is handled automatically unless the
     * `firstRowAsNames` set to false, then the `columnIds` can be used.
     *
     * In case of complex JSON structure, use the `ColumnIdsOptions` to define
     * the key and path to the data.
     *
     * If you have more complex data, you can adjust it by  the `beforeParse`
     * callback function to manually parse the rows into valid JSON. However,
     * the resulting JSON will still be converted into a proper table structure.
     */
    columnIds?: string[] | ColumnIdsOptions;

    /**
     * Data in JSON format.
     */
    data?: JSONData;

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
    orientation?: 'columns' | 'rows';

    /**
     * Allows defining multiple data tables within a single connector to adjust
     * options or data parsing in various ways based on the same data source.
     *
     * @example
     * dataPool: {
     *     connectors: [{
     *         id: 'data-connector',
     *         type: 'JSON',
     *         data: {
     *             kpis: { a: 1, b: 2 },
     *             more: {
     *                 alpha: [1, 2, 3, 4, 5],
     *                 beta: [10, 20, 30, 40, 50]
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
     *             columnIds: ['a', 'b'],
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
    dataTables?: JSONDataTableConnectorOptions[];

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
 * columnIds: {
 *     InstanceType: ['InstanceType'],
 *     DiskSpace: ['DiskSpace', 'RootDisk', 'SizeGB'],
 *     ReadOps: ['DiskOperations', 0, 'ReadOps']
 * },
 */
export interface ColumnIdsOptions {
    [key: string]: (string|number)[]
}

/**
 * Options of the JSONConnector dataTable.
 */
export interface JSONDataTableConnectorOptions extends DataTableConnectorOptions {
    columnIds?: string[] | ColumnIdsOptions;
    orientation?: 'columns' | 'rows';
    beforeParse?: JSONBeforeParseCallbackFunction;
}

/**
 * Callback function allowing modification of the data before parsing it.
 * Must return a valid JSON structure.
 *
 * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/data-tools/datapool-json-connector-enable-polling/ | JSON Connector with beforeParse and enablePolling }
 */
export interface JSONBeforeParseCallbackFunction {
    (data: JSONData): JSONData;
}

/* *
 *
 *  Default Export
 *
 * */

export default JSONConnectorOptions;
