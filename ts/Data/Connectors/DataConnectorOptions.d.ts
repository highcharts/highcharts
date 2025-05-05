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
 *  - Karol Kolodziej
 *
 * */


/* *
 *
 *  Imports
 *
 * */


import type { DataModifierTypeOptions } from '../Modifiers/DataModifierType';

import type DataTableOptions from '../DataTableOptions';


/* *
 *
 *  Declarations
 *
 * */


/**
 * Option of the DataConnector.
 */
export interface DataConnectorOptions {
    /**
     * Options for the modifier that shall be applied to the table to create a
     * modified version. This modified version is available via the
     * `DataTable.modified` property.
     *
     * @example
     * ``` JavaScript
     * const connector = new CSVConnector({
     *   csv: 'a,b,c\n1,2,3\n4,5,6',
     *   dataModifier: {
     *     type: 'Invert'
     *   }
     * });
     * await connector.load();
     * console.log(table.getColumns());
     * // {"a":[1,4],"b":[2,5],"c":[3,6]}
     * console.log(table.modified.getColumns());
     * // {0:[1,2,3],1:[4,5,6],columnNames:["a","b","c"]}
     * ```
     */
    dataModifier?: DataModifierTypeOptions;


    /**
     * Options for the data table.
     */
    dataTable?: DataTableOptions;


    /**
     * Contains custom metadata related to the connector source, for example the
     * column order on the source side.
     */
    metadata?: Metadata;


}


/**
 * Contains custom metadata related to the connector source, for example the
 * column order on the source side.
 */
export interface Metadata {


    /**
     * Metadata entry containing the name of the column and a metadata object.
     */
    columns: Record<string, MetaColumn>;


}


/**
 * Metadata for a specific column in the connector source.
 */
export interface MetaColumn {

    dataType?: string;

    defaultValue?: (boolean|null|number|string);

    index?: number;

    title?: string;

}


/* *
 *
 *  Default Export
 *
 * */


export default DataConnectorOptions;
