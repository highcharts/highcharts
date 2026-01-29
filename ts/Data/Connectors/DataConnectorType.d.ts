/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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
