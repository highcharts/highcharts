/* *
 *
 *  (c) 2010-2022 Askel Eirik Johansson
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import MapLineSeriesOptions from '../MapLine/MapLineSeriesOptions';
import type { MarkerEndOptions } from './FlowMapPointOptions';

/* *
 *
 *  Imports
 *
 * */

/* *
 *
 *  Declarations
 *
 * */

interface FlowMapSeriesOptions extends MapLineSeriesOptions {
    growTowards?: boolean;
    markerEnd?: MarkerEndOptions;
    maxWeight: number;
    minWeight: number;
    weight?: number;
}

/* *
 *
 *  Default export
 *
 * */

export default FlowMapSeriesOptions;
