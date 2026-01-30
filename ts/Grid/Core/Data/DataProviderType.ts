/* *
 *
 *  Data Provider Type
 *
 *  (c) 2020-2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */


/* *
 *
 *  Declarations
 *
 * */

/**
 * Contains all possible class types of the data provider registry.
 */
export type DataProviderClassType =
    DataProviderTypeRegistry[keyof DataProviderTypeRegistry];

/**
 * Contains all possible types of the class registry.
 */
export type DataProviderType = DataProviderClassType['prototype'];

/**
 * Union of all possible options of the data providers in the registry.
 */
export type DataProviderOptionsType = DataProviderType['options'];

/**
 * Describes the class registry as a record object with class name and their
 * class types (aka class constructor).
 */
export interface DataProviderTypeRegistry {
    // Extend this interface with the declare module pattern.
}

/* *
 *
 *  Default Export
 *
 * */

export default DataProviderType;
