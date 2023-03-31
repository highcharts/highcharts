/* *
 *
 *  (c) 2009-2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
 * Contains all possible instances of the connector registry.
 */
export type DataConnectorInstance = DataConnectorType['prototype'];

/**
 * Describes the connector registry as a record object with type and class.
 */
export interface DataConnectorRegistry {
    // nothing here yet
}

/**
 * Contains all possible types of the connector registry.
 */
export type DataConnectorType =
    DataConnectorRegistry[keyof DataConnectorRegistry];

/* *
 *
 *  Default Export
 *
 * */

export default DataConnectorType;
