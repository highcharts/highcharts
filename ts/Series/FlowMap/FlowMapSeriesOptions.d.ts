/* *
 *
 *  (c) 2010-2022 Askel Eirik Johansson
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
