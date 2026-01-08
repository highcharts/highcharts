/* *
 *
 *  Projection definition
 *
 *  (c) 2021-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *  Authors:
 *  - Torstein Honsi
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

/**
 * Minimal interface describing a projector's forward and inverse functions.
 *
 * @sample maps/mapview/projection-custom-proj4js
 *         Custom UTM projection definition
 * @sample maps/mapview/projection-custom-d3geo
 *         Custom Robinson projection definition
 *
 * @interface Highcharts.Projector
 */
export interface Projector {
    /**
     * Project a lon/lat coordinate to projected xy.
     */
    forward(coords: LonLatArray): ProjectedXYArray;

    /**
     * Inverse-project a projected xy coordinate to lon/lat.
     */
    inverse(xy: ProjectedXYArray): LonLatArray;
}

/**
 * Definition for a projection, extending the basic projector.
 *
 * @interface Highcharts.ProjectionDefinition
 */
export interface ProjectionDefinition extends Projector {
    /** @internal */
    antimeridianCutting?: boolean;

    /** @internal */
    bounds?: MapBounds;

    /** @internal */
    maxLatitude?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default ProjectionDefinition;
