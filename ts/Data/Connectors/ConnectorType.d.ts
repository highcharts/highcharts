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
export type ConnectorInstance = ConnectorType['prototype'];

/**
 * Contains all possible types of the connector registry.
 */
export type ConnectorType = ConnectorTypeRegistry[keyof ConnectorTypeRegistry];

/**
 * Describes the connector registry as a record object with type and class.
 */
export interface ConnectorTypeRegistry {
    // nothing here yet
}

/* *
 *
 *  Default Export
 *
 * */

export default ConnectorType;
