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
 * Describes the connector registry as a record object with key and
 * class constructor.
 */
export interface DataConnectorTypes {
    // nothing here yet
}

/**
 * Contains all possible connector types.
 */
export type DataConnectorType =
    DataConnectorTypes[keyof DataConnectorTypes]['prototype'];

/* *
 *
 *  Default Export
 *
 * */

export default DataConnectorType;
