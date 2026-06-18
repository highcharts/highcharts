/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Askel Eirik Johansson
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
    fillOpacity?: number;
}

/* *
 *
 *  Default export
 *
 * */

export default FlowMapSeriesOptions;
