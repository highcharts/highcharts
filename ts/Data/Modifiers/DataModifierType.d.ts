/* *
 *
 *  (c) 2009-2025 Highsoft AS
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
 * Contains all possible types of the modifier registry.
 */
export type DataModifierType = DataModifierTypes[keyof DataModifierTypes];

/**
 * Contains all possible options of the modifier registry.
 */
export type DataModifierTypeOptions = DataModifierType['prototype']['options'];

/**
 * Describes the modifier registry as a record object with key and class
 * constructor.
 */
export interface DataModifierTypes {
    // Nothing here yet
}

/* *
 *
 *  Default Export
 *
 * */

export default DataModifierType;
