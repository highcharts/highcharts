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
    markerEnd?: MarkerEndOptions,
    growTowards?: boolean,
    minWeight: number,
    maxWeight: number
}

interface MarkerEndOptions {
    markerType?: string,
    enabled?: boolean,
    width: number | string,
    height: number | string,
}

/* *
 *
 *  Default export
 *
 * */

export default FlowMapSeriesOptions;
