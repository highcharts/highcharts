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
     * A custom callback function that parses the data table data. Supported
     * connectors are: JSON, CSV and Google Spreadsheets.
     */
    parser?: DataTableParserCallbackFunction<
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
