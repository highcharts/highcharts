/* *
 *
 *  (c) 2010-2025 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
export type ControllableLabelType = ControllableLabelTypeRegistry[
    keyof ControllableLabelTypeRegistry
]['prototype'];

/** @internal */
export interface ControllableLabelTypeRegistry {
    // Placeholder to add class types
}

/** @internal */
export type ControllableShapeType = ControllableShapeTypeRegistry[
    keyof ControllableShapeTypeRegistry
]['prototype'];

/** @internal */
export interface ControllableShapeTypeRegistry {
    // Placeholder to add class types
}

/** @internal */
export type ControllableType = (ControllableLabelType|ControllableShapeType);

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default ControllableType;
