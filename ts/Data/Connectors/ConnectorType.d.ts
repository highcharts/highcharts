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
 * Contains all possible types of the class registry.
 */
export type ConnectorType = ConnectorTypeRegistry[keyof ConnectorTypeRegistry];

/**
 * Describes the class registry as a record object with class name and their
 * class types (aka class constructor).
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
