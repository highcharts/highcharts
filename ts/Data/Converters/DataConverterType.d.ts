/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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
