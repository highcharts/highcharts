/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
