/* *
 *
 *  (c) 2009-2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { DataConnectorTypes } from './Connectors/DataConnectorType.js';

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
     * Connector options to add to the data pool.
     */
    connectors: Array<DataPoolConnectorOptions>;

}

/**
 * Options for a connector in the data pool. Available options depend on the
 * type of the `DataConnector.types` registry.
 */
export interface DataPoolConnectorOptions
<T extends keyof DataConnectorTypes = keyof DataConnectorTypes> {

    /**
     * Name of the connector in the data pool.
     */
    name: string;

    /**
     * Connector options to use.
     */
    options: DataConnectorTypes[T]['prototype']['options'];

    /**
     * Connector type in the `DataConnector.types` registry, like `CSV`.
     */
    type: T;
}

/* *
 *
 *  Default Export
 *
 * */

export default DataPoolOptions;
