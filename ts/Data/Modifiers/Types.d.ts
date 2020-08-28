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

import type DataModifier from './DataModifier';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Contains all possible types of the class registry.
 */
export type DataModifierRegistryType = DataModifierTypeRegistry[keyof DataModifierTypeRegistry];

/**
 * Describes the class registry as a record object with class name and their
 * class types (aka class constructor).
 */
export interface DataModifierTypeRegistry {
    // nothing here yet
}
