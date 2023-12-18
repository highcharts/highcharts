/* *
 *
 *  (c) 2009-2023 Highsoft AS
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
     * If JSON data is column oriented, these options defines keys
     * for the columns. In rows oriented case this is handled automatically.
     * In case of complex JSON structure, use the `ColumnNamesOptions` to define
     * the key and path to the data.
     */
    columnNames?: Array<string>|JSONConverter.ColumnNamesOptions;

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
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/data-tools/datapool-json-connector-orientation/ | JSON Connector orientation }
     */
    orientation?: 'columns'|'rows';
}

/**
 * Callback function allowing modification of the data before parsing it.
 * Must return a valid JSON structure.
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
