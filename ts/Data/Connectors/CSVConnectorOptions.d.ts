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
}

/* *
 *
 *  Default Export
 *
 * */

export default CSVConnectorOptions;
