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

export type ControllableLabelType = ControllableLabelTypeRegistry[
    keyof ControllableLabelTypeRegistry
]['prototype'];

export interface ControllableLabelTypeRegistry {
    // Placeholder to add class types
}

export type ControllableShapeType = ControllableShapeTypeRegistry[
    keyof ControllableShapeTypeRegistry
]['prototype'];

export interface ControllableShapeTypeRegistry {
    // Placeholder to add class types
}

export type ControllableType = (ControllableLabelType|ControllableShapeType);

/* *
 *
 *  Default Export
 *
 * */

export default ControllableType;
