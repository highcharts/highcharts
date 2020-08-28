/* *
 *
 *  Data Layer
 *
 *  (c) 2012-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type DataStore from './DataStore';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Contains all possible types of the class registry.
 */
export type DataStoreRegistryType = DataStoreTypeRegistry[keyof DataStoreTypeRegistry];

/**
 * Describes the class registry as a record object with class name and their
 * class types (aka class constructor).
 */
export interface DataStoreTypeRegistry {
    // nothing here yet
}
