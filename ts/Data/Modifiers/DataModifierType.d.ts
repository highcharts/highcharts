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
