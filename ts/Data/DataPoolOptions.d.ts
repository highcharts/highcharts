/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *  - Kamil Kubik
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type { DataConnectorTypeOptions } from './Connectors/DataConnectorType';


/* *
 *
 *  Declarations
 *
 * */

/**
 * Options to initialize a data pool.
 */
export interface DataPoolOptions {
    /**
     * The connectors to use for loading data. Available connectors and its
     * options:
     *
     * {@link CSVConnectorOptions | CSVConnector}
     *
     * {@link GoogleSheetsConnectorOptions | GoogleSheetsConnector}
     *
     * {@link HTMLTableConnectorOptions | HTMLTableConnector}
     *
     * {@link JSONConnectorOptions | JSONConnector}
     *
     **/
    connectors: DataConnectorTypeOptions[];
}

/* *
 *
 *  Default Export
 *
 * */

export default DataPoolOptions;
