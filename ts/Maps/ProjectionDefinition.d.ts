/* *
 *
 *  (c) 2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type ProjectionOptions from './ProjectionOptions';

export interface ProjectionFunction {
    (coords: [number, number]): [number, number];
}

export interface Projector {
    forward: ProjectionFunction;
    inverse: ProjectionFunction;
}

export declare class ProjectionDefinition {
    constructor(options: ProjectionOptions);
    forward: ProjectionFunction;
    inverse: ProjectionFunction;
    maxLatitude?: number;
}

export default ProjectionDefinition;
