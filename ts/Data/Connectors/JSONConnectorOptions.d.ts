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
     * Should first row be treated as names of columns.
     * @default true
     */
    firstRowAsNames?: boolean,
    /**
     * URL to the JSON data. try it {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/data-tools/datapool-json-connector-dataurl/ | data fetched from url }
     */
    dataUrl?: string;
    /**
     * Whether polling should be enabled.
     */
    enablePolling?: boolean;
    /**
     * Data in JSON format.
     */
    data?: Array<Array<number|string>>;
    /**
     * Data refresh rate in seconds.
     */
    dataRefreshRate?: number;
    /**
     * Whether data is in columns or rows.
     * {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/data-tools/datapool-json-connector-orientation/ | JSON Connector orientation }
     */
    orientation?: 'columns'|'rows';
}

/* *
 *
 *  Default Export
 *
 * */

export default JSONConnectorOptions;
