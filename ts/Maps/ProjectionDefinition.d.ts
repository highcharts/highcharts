/* *
 *
 *  (c) 2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type {
    LonLatArray,
    MapBounds,
    ProjectedXYArray
} from './MapViewOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface Projector {
    forward(coords: LonLatArray): ProjectedXYArray;
    inverse(xy: ProjectedXYArray): LonLatArray;
}

export interface ProjectionDefinition extends Projector {
    antimeridianCutting?: boolean;
    bounds?: MapBounds;
    maxLatitude?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default ProjectionDefinition;
