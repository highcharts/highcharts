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
     */
    firstRowAsNames?: boolean,
    /**
     * URL to the JSON data.
     */
    dataUrl?: string;
    /**
     * Should polling be enabled.
     */
    enablePolling?: boolean;
    /**
     * Data in JSON format.
     */
    data?: Array<Array<number|string>>;
    /**
     * Data refresh rate in milliseconds.
     */
    dataRefreshRate?: number;
    /**
     * Whether data is in columns or rows.
     */
    orientation?: 'columns'|'rows';
}

/* *
 *
 *  Default Export
 *
 * */

export default JSONConnectorOptions;
