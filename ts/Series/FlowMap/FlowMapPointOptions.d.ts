/* *
 *
 *  (c) 2018-2026 Highsoft AS
 *  Author: Askel Eirik Johansson
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

import type ColorType from '../../Core/Color/ColorType';
import type { LonLatArray } from '../../Maps/MapViewOptions';
import type { MapLonLatObject } from '../../Maps/GeoJSON';
import type MapLinePointOptions from '../MapLine/MapLinePointOptions';


/* *
 *
 *  Declarations
 *
 * */

export interface FlowMapPointOptions extends MapLinePointOptions {
    curveFactor?: number;
    fillColor?: ColorType;
    fillOpacity: number;
    from?: (string|LonLatArray|MapLonLatObject);
    growTowards?: boolean;
    markerEnd?: MarkerEndOptions;
    opacity?: number;
    to?: (string|LonLatArray|MapLonLatObject);
    weight?: number;
    lineWidth?: number;
}

export interface MarkerEndOptions {
    markerType?: string,
    enabled?: boolean,
    width: number | string,
    height: number | string
}

export default FlowMapPointOptions;
