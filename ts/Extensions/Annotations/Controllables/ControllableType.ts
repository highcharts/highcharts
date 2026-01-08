/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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
