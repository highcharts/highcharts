/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
