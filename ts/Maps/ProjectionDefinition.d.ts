/* *
 *
 *  (c) 2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type {
    LonLatArray,
    MapBounds,
    ProjectedXYArray
} from './MapViewOptions';
import type ProjectionOptions from './ProjectionOptions';

export interface ProjectionForwardFunction {
    (coords: LonLatArray): ProjectedXYArray;
}

export interface ProjectionInverseFunction {
    (xy: ProjectedXYArray): LonLatArray;
}

export interface Projector {
    forward: ProjectionForwardFunction;
    inverse: ProjectionInverseFunction;
}

export declare class ProjectionDefinition {
    constructor(options: ProjectionOptions);
    antimeridianCutting?: boolean;
    bounds?: MapBounds;
    forward: ProjectionForwardFunction;
    inverse: ProjectionInverseFunction;
    maxLatitude?: number;
}

export default ProjectionDefinition;
