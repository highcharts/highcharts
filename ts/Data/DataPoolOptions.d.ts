/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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

/* eslint-disable @typescript-eslint/no-unused-vars */
/* API docs */
import type CSVConnectorOptions from './Connectors/CSVConnectorOptions';
import type GoogleSheetsConnectorOptions from './Connectors/GoogleSheetsConnectorOptions';
import type HTMLTableConnectorOptions from './Connectors/HTMLTableConnectorOptions';
import type JSONConnectorOptions from './Connectors/JSONConnectorOptions';
/* eslint-enable @typescript-eslint/no-unused-vars */


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
