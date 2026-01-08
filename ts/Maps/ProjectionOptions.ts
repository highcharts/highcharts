/* *
 *
 *  (c) 2021-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type { MapBounds } from './MapViewOptions';
import type { ProjectionRegistryName } from './Projections/ProjectionRegistry';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Rotation of the projection in terms of degrees `[lambda, phi, gamma]`.
 * 1st number is mandatory, while 2nd and 3rd are optional.
 */
export type ProjectionRotationOption = (
    [number]|[number, number]|[number, number, number]
);

/**
 * The projection options allow applying client side projection to a map
 * given in geographic coordinates, typically from TopoJSON or GeoJSON.
 */
export interface ProjectionOptions {
    /**
     * Projected bounds used for clipping or constraining the projection.
     * @internal
     */
    projectedBounds?: ('world'|MapBounds);

    /**
     * Projection name. Built-in projections are `EqualEarth`,
     * `LambertConformalConic`, `Miller`, `Orthographic` and `WebMercator`.
     */
    name?: ProjectionRegistryName;

    /**
     * The two standard parallels that define the map layout in conic
     * projections, like the LambertConformalConic projection. If only one
     * number is given, the second parallel will be the same as the first.
     */
    parallels?: number[];

    /**
     * Rotation of the projection in terms of degrees `[lambda, phi, gamma]`.
     * When given, a three-axis spherical rotation is applied to the globe prior
     * to the projection.
     *
     * - `lambda` shifts the longitudes by the given value.
     * - `phi` shifts the latitudes by the given value. Can be omitted.
     * - `gamma` applies a roll. Can be omitted.
     *
     * @sample maps/demo/projection-explorer
     *         Projection explorer
     * @sample maps/mapview/projection-america-centric
     *         America-centric world map
     */
    rotation?: ProjectionRotationOption;
}

/* *
 *
 *  Default Export
 *
 * */

export default ProjectionOptions;
