/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Jomar Hønsi
 *
 * */

/* *
 *
 *  Declarations
 *
 * */

/**
 * Describes the converter registry as a record object with key and
 * class constructor.
 */
export interface DataConverterTypes {
    // Nothing here yet
}

/**
 * Contains all possible connector types.
 */
export type DataConverterType =
    DataConverterTypes[keyof DataConverterTypes]['prototype'];

/* *
 *
 *  Default Export
 *
 * */

export default DataConverterType;
