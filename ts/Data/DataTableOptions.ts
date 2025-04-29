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
 *  - Dawid Dragula
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Types from '../Shared/Types';
import type { ColumnNamesOptions } from './Connectors/JSONConnectorOptions';
import type { DataModifierTypeOptions } from './Modifiers/DataModifierType';

import DataConnector from './Connectors/DataConnector.js';


/* *
 *
 *  Declarations
 *
 * */


/**
 * Options to initialize a new DataTable instance.
 */
export interface DataTableOptions {


    /**
     * Initial columns with their values.
     */
    columns?: Record<string, Array<DataTableValue>|Types.TypedArray>;


    /**
     * Custom ID to identify the new DataTable instance.
     */
    id?: string;

    /**
     * A reference to the specific data table key defined in the component's
     * connector options.
     */
    key?: string;

    /**
     * If JSON data is row oriented, these options define keys for the columns.
     * In column oriented case this is handled automatically unless the
     * `firstRowAsNames` set to false, then the `columnNames` can be used.
     *
     * In case of complex JSON structure, use the `ColumnNamesOptions` to define
     * the key and path to the data.
     *
     * When more flexibility is needed you can use the `beforeParse` callback
     * function and parse the rows into a valid JSON yourself. Nevertheless, the
     * parsed JSON is going to be transformed into a valid table structure.
     */
    columnNames?: Array<string> | ColumnNamesOptions;

    /**
     * Should first row be treated as names of columns.
     */
    firstRowAsNames?: boolean;

    /**
     * Whether data is in columns or rows.
     */
    orientation?: 'columns' | 'rows';

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
     * A custom callback function that parses the data before it's being parsed
     * to the data table format inside the converter.
     * Supported connectors are: JSON, CSV and Google Spreadsheets.
     */
    beforeParse?: DataConnector.BeforeParseCallbackFunction;
}


export type DataTableValue = (boolean|null|number|string|undefined);

export type DataTableParserCallbackFunction<T> = {
    (data: T): T;
};


/* *
 *
 *  Default Export
 *
 * */


export default DataTableOptions;
