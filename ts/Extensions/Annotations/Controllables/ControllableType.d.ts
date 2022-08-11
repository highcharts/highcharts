/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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

export type ControllableLabelType = ControllableLabelTypeRegistry[
    keyof ControllableLabelTypeRegistry
]['prototype'];

export interface ControllableLabelTypeRegistry {
    // placeholder to add class types
}

export type ControllableShapeType = ControllableShapeTypeRegistry[
    keyof ControllableShapeTypeRegistry
]['prototype'];

export interface ControllableShapeTypeRegistry {
    // placeholder to add class types
}

export type ControllableType = (ControllableLabelType|ControllableShapeType);

/* *
 *
 *  Default Export
 *
 * */

export default ControllableType;
