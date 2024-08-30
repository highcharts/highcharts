/* *
 *
 *  (c) 2009-2024 Highsoft AS
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
     * When more flexibility is needed you can use the `beforeParse` callback
     * function and parse the rows into a valid JSON yourself. Nevertheless, the
     * parsed JSON is going to be transformed into a valid table structure.
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
     * @default rows
     *
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/data-tools/datapool-json-connector-orientation/ | JSON Connector orientation }
     */
    orientation?: 'columns'|'rows';
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
export interface BeforeParseCallbackFunction {
    (data: JSONConverter.Data): JSONConverter.Data;
}

/* *
 *
 *  Default Export
 *
 * */

export default JSONConnectorOptions;
