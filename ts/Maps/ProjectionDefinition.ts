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

/* *
 *
 *  Class
 *
 * */

abstract class ProjectionDefinition implements Projector {

    public antimeridianCutting?: boolean;

    public bounds?: MapBounds;

    public abstract forward(coords: LonLatArray): ProjectedXYArray;

    public abstract inverse(xy: ProjectedXYArray): LonLatArray;

    public maxLatitude?: number;

}

/* *
 *
 *  Default Export
 *
 * */

export default ProjectionDefinition;
