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
 *  - Sophie Bremer
 *
 * */

/* *
 *
 *  Declarations
 *
 * */

/**
 * Describes the connector registry as a record object with key and
 * class constructor.
 */
export interface DataConnectorTypes {
    // Nothing here yet
}

/**
 * Contains all possible connector types.
 */
export type DataConnectorType =
    DataConnectorTypes[keyof DataConnectorTypes]['prototype'];

/**
 * Options for specific data connector type.
 */
export type DataConnectorTypeOptions = DataConnectorType['options'];

/* *
 *
 *  Default Export
 *
 * */

export default DataConnectorType;
