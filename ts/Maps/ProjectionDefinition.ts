/* *
 *
 *  (c) 2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

export interface ProjectionFunction {
    (coords: [number, number]): [number, number];
}

export interface Projector {
    forward: ProjectionFunction;
    inverse: ProjectionFunction;
}

export interface ProjectionDefinition {
    forward: ProjectionFunction;
    inverse: ProjectionFunction;
    maxLatitude?: number;
}

export default ProjectionDefinition;
