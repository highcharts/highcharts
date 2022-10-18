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
    growTowards?: boolean;
    markerEnd?: MarkerEndOptions;
    maxWeight: number;
    minWeight: number;
    weight?: number;
}

interface MarkerEndOptions {
    markerType?: string;
    enabled?: boolean;
    width: number;
    height: number;
}

/* *
 *
 *  Default export
 *
 * */

export default FlowMapSeriesOptions;
