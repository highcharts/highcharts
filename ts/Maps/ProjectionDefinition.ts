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

/**
 * Minimal interface describing a projector's forward and inverse functions.
 * @internal
 */
export interface Projector {
    /**
     * Project a lon/lat coordinate to projected xy.
     * @internal
     */
    forward(coords: LonLatArray): ProjectedXYArray;

    /**
     * Inverse-project a projected xy coordinate to lon/lat.
     * @internal
     */
    inverse(xy: ProjectedXYArray): LonLatArray;
}

/**
 * Definition for a projection, extending the basic projector.
 * @internal
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

/** @internal */
export default ProjectionDefinition;
