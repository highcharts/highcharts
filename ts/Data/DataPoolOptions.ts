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

import type { DataConnectorTypes } from './Connectors/DataConnectorType';
import type CSVConnectorOptions from './Connectors/CSVConnectorOptions';
import type GoogleSheetsConnectorOptions from './Connectors/GoogleSheetsConnectorOptions';
import type HTMLTableConnectorOptions from './Connectors/HTMLTableConnectorOptions';

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
     **/
    connectors: Array<DataPoolConnectorOptions>;

}

/**
 * Options for a connector in the data pool. Available options depend on the
 * type of the `DataConnector.types` registry.
 */
export interface DataPoolConnectorOptions
<T extends keyof DataConnectorTypes = keyof DataConnectorTypes> {

    /**
     * The unique identifier of the connector. Used later when referencing
     * the connector in the component where it is used.
     **/
    id: string;

    /**
     * The options of the given connector type.
     * @example
     * ```TS
     * dataPool: {
     *      connectors: [{
     *      id: 'my-csv-connector',
     *      type: 'CSV',
     *      options: {
     *          csv: csvData
     *          }
     *       }]
     * },
     **/
    options: DataConnectorTypes[T]['prototype']['options'];

    /**
     * The type of the connector, depends on your data source.
     * Possible values are:
     * - `CSV`
     * - `GoogleSheets`
     * - `HTMLTable`
     **/
    type: T;

}

/* *
 *
 *  Default Export
 *
 * */

export default DataPoolOptions;
