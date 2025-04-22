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
import type JSONConverter from './Converters/JSONConverter';
import type GoogleSheetsConverter from './Converters/GoogleSheetsConverter';
import type { ColumnNamesOptions } from './Connectors/JSONConnectorOptions';


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
     * A custom callback function that parses the data table data. Supported
     * connectors are: JSON, CSV and Google Spreadsheets.
     */
    beforeParse?: DataTableParserCallbackFunction<
    | JSONConverter.Data
    | string
    | GoogleSheetsConverter.GoogleSpreadsheetJSON
    >;
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
