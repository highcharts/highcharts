/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
