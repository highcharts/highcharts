/* *
 *
 *  (c) 2010-2026 Highsoft AS
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

import MapLineSeriesOptions from '../MapLine/MapLineSeriesOptions';
import type { MarkerEndOptions } from './FlowMapPointOptions';


/* *
 *
 *  Declarations
 *
 * */

interface FlowMapSeriesOptions extends MapLineSeriesOptions {
    growTowards?: boolean;
    markerEnd?: MarkerEndOptions;
    maxWidth: number;
    minWidth: number;
    weight?: number;
    curveFactor?: number;
    width?: number;
    lineWidth?: number;
}

/* *
 *
 *  Default export
 *
 * */

export default FlowMapSeriesOptions;
