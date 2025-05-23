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
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { DataConnectorTypes } from './Connectors/DataConnectorType';
import type DataTableOptions from './DataTableOptions';
/* eslint-disable @typescript-eslint/no-unused-vars */
import type CSVConnectorOptions from './Connectors/CSVConnectorOptions';
import type GoogleSheetsConnectorOptions from './Connectors/GoogleSheetsConnectorOptions';
import type HTMLTableConnectorOptions from './Connectors/HTMLTableConnectorOptions';
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
     * - `JSON`
     **/
    type: T;

    /**
     * Allows defining multiple data tables within a single connector to adjust
     * options or data parsing in various ways based on the same data source.
     *
     * @example
     * dataPool: {
     *     connectors: [{
     *         id: 'data-connector',
     *         type: 'JSON',
     *         options: {
     *             data: {
     *                 kpis: { a: 1, b: 2 },
     *                 more: {
     *                     alpha: [1, 2, 3, 4, 5],
     *                     beta: [10, 20, 30, 40, 50]
     *                 }
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
     *             columnNames: ['a', 'b'],
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
    dataTables?: Array<DataTableOptions>;
}

/* *
 *
 *  Default Export
 *
 * */

export default DataPoolOptions;
